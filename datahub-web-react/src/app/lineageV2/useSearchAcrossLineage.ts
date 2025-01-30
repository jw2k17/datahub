import { useEffect, useState } from 'react';
import { useSearchAcrossLineageStructureLazyQuery } from '../../graphql/search.generated';
import { Entity, EntityType, LineageDirection, Maybe, SearchAcrossLineageInput } from '../../types.generated';
import EntityRegistry from '../entityV2/EntityRegistry';
import { DBT_URN } from '../ingest/source/builder/constants';
import { useGetLineageTimeParams } from '../lineage/utils/useGetLineageTimeParams';
import { DEGREE_FILTER_NAME } from '../search/utils/constants';
import { useEntityRegistryV2 } from '../useEntityRegistry';
import {
    addToAdjacencyList,
    createEdgeId,
    FetchStatus,
    Filters,
    getEdgeId,
    isQuery,
    isTransformational,
    isUrnTransformational,
    LINEAGE_FILTER_PAGINATION,
    LineageEntity,
    NodeContext,
    reverseDirection,
    setDefault,
} from './common';

const PER_HOP_LIMIT = 2;

/**
 * Fetches the lineage structure for a given urn and direction, and updates the nodes map with the results.
 * @param urn Urn for which to fetch lineage
 * @param type EntityType of the urn
 * @param context LineageExploreContext storing a map of urn to LineageNode
 * @param direction Direction for which to fetch lineage
 * @param lazy Whether to fetch the lineage immediately
 * @param maxDepth Whether to fetch all lineage, default depth 1
 * @param skipCache Whether to bypass Apollo and Elasticsearch caches
 */
export default function useSearchAcrossLineage(
    urn: string,
    type: EntityType,
    context: NodeContext,
    direction: LineageDirection,
    lazy?: boolean,
    maxDepth?: boolean,
    skipCache?: boolean,
): {
    fetchLineage: () => void;
    processed: boolean;
} {
    const entityRegistry = useEntityRegistryV2();
    const { startTimeMillis, endTimeMillis } = useGetLineageTimeParams();
    const { nodes, edges, adjacencyList, rootUrn, setNodeVersion, setDisplayVersion } = context;

    const input: SearchAcrossLineageInput = {
        urn,
        direction,
        types: type === EntityType.SchemaField ? [EntityType.SchemaField] : undefined,
        start: 0,
        count: 10000,
        orFilters: [
            {
                and: [
                    {
                        field: DEGREE_FILTER_NAME,
                        values: maxDepth ? ['1', '2', '3+'] : ['1'],
                    },
                ],
            },
        ],
        lineageFlags: {
            startTimeMillis,
            endTimeMillis,
            entitiesExploredPerHopLimit: PER_HOP_LIMIT,
            ignoreAsHops: [
                {
                    entityType: EntityType.Dataset,
                    platforms: [DBT_URN],
                },
                {
                    entityType: EntityType.SchemaField,
                    platforms: [DBT_URN],
                },
                { entityType: EntityType.DataJob },
            ],
        },
        searchFlags: {
            skipCache: !!skipCache,
            groupingSpec: { groupingCriteria: [] },
        },
    };

    const [processed] = useState(new Set<string>());

    const [fetchLineage, { data }] = useSearchAcrossLineageStructureLazyQuery({
        variables: { input },
        fetchPolicy: skipCache ? 'no-cache' : undefined,
    });
    useEffect(() => {
        if (!lazy) {
            fetchLineage();
        }
    }, [fetchLineage, lazy]);

    useEffect(() => {
        const smallContext = { nodes, edges, adjacencyList };
        let addedNode = false;

        data?.searchAcrossLineage?.searchResults.forEach((result) => {
            addedNode = addedNode || !nodes.has(result.entity.urn);
            const node = setEntityNodeDefault(result.entity.urn, result.entity.type, direction, nodes);
            if (result.explored || result.ignoredAsHop) {
                node.fetchStatus = { ...node.fetchStatus, [direction]: FetchStatus.COMPLETE };
                node.isExpanded = { ...node.isExpanded, [direction]: true };
            }

            result.paths?.forEach((path) => {
                if (!path) return;
                const parent = path.path[path.path.length - 2];
                if (!parent) return;
                if (isQuery(parent)) {
                    const grandparent = path.path[path.path.length - 3];
                    if (grandparent) {
                        edges.set(getEdgeId(grandparent.urn, result.entity.urn, direction), { isDisplayed: true });
                        addToAdjacencyList(adjacencyList, direction, grandparent.urn, result.entity.urn);
                    }
                } else {
                    edges.set(getEdgeId(parent.urn, result.entity.urn, direction), { isDisplayed: true });
                    addToAdjacencyList(adjacencyList, direction, parent.urn, result.entity.urn);
                }

                addQueryNodes(path.path, direction, smallContext);
            });
        });

        const node = nodes.get(urn);
        if (data && node) {
            node.fetchStatus = { ...node.fetchStatus, [direction]: FetchStatus.COMPLETE };
        }

        if (data) {
            pruneDuplicateEdges(urn, direction, smallContext, entityRegistry);
            processed.add(urn);
            if (addedNode) setNodeVersion((version) => version + 1);

            const nodesToZoom = urn === rootUrn ? [] : [urn, ...(adjacencyList[direction].get(urn) || [])];
            setDisplayVersion(([version]) => [version + 1, nodesToZoom]);
        }
    }, [
        urn,
        data,
        direction,
        nodes,
        edges,
        adjacencyList,
        rootUrn,
        setNodeVersion,
        setDisplayVersion,
        maxDepth,
        entityRegistry,
        processed,
    ]);

    return { fetchLineage, processed: processed.has(urn) };
}

/**
 * Remove direct edges between non-transformational nodes, if there is a path between them through only transformational nodes.
 * This prevents the graph from being cluttered with effectively duplicate edges.
 * @param urn Urn for which to remove parent edges.
 * @param direction Direction to look for parents.
 * @param context Lineage node context.
 * @param entityRegistry EntityRegistry, used to get EntityType from an urn.
 */
export function pruneDuplicateEdges(
    urn: string,
    direction: LineageDirection | null,
    context: Pick<NodeContext, 'adjacencyList' | 'edges'>,
    entityRegistry: EntityRegistry,
) {
    const { edges } = context;
    const neighbors: Record<LineageDirection, Set<string>> = {
        [LineageDirection.Downstream]: new Set(),
        [LineageDirection.Upstream]: new Set(),
    };

    const urnIsTransformational = isUrnTransformational(urn, entityRegistry);
    function getNeighbors(d: LineageDirection) {
        return getNonTransformationalNeighbors(urn, d, urnIsTransformational, context, entityRegistry);
    }

    if (direction) {
        neighbors[direction] = getNeighbors(direction);
    } else {
        neighbors[LineageDirection.Upstream] = getNeighbors(LineageDirection.Upstream);
        neighbors[LineageDirection.Downstream] = getNeighbors(LineageDirection.Downstream);
    }

    if (urnIsTransformational) {
        neighbors[LineageDirection.Upstream].forEach((source) => {
            neighbors[LineageDirection.Downstream].forEach((destination) => {
                const edge = edges.get(createEdgeId(source, destination));
                if (edge?.isDisplayed) {
                    edge.isDisplayed = false;
                }
            });
        });
    } else {
        Object.values(LineageDirection).forEach((d) => {
            neighbors[d].forEach((source) => {
                const edge = edges.get(getEdgeId(urn, source, d));
                if (edge?.isDisplayed) {
                    edge.isDisplayed = false;
                }
            });
        });
    }
}

/**
 * Get the non-transformational nodes that are reachable from `urn` in `direction` via a transformational path.
 * @param urn Urn for which to get neighbors.
 * @param direction Direction to look for neighbors.
 * @param includeDirect If false, only include non-transformational neighbors through a transformational node.
 * @param adjacencyList Adjacency list of the lineage graph.
 * @param entityRegistry EntityRegistry, used to get EntityType from an urn.
 */
function getNonTransformationalNeighbors(
    urn: string,
    direction: LineageDirection,
    includeDirect: boolean,
    { adjacencyList }: Pick<NodeContext, 'adjacencyList'>,
    entityRegistry: EntityRegistry,
) {
    const neighbors = new Set<string>();
    const stack = includeDirect
        ? [urn]
        : Array.from(adjacencyList[direction].get(urn) || []).filter((p) => isUrnTransformational(p, entityRegistry));
    const seen = new Set<string>(stack);
    for (let u = stack.pop(); u; u = stack.pop()) {
        Array.from(adjacencyList[direction].get(u) || []).forEach((parent) => {
            if (isUrnTransformational(parent, entityRegistry)) {
                if (!seen.has(parent)) {
                    stack.push(parent);
                    seen.add(parent);
                }
            } else {
                neighbors.add(parent);
            }
        });
    }
    return neighbors;
}

export function setEntityNodeDefault(
    urn: string,
    type: EntityType,
    direction: LineageDirection,
    nodes: NodeContext['nodes'],
): LineageEntity {
    const node = setDefault(nodes, urn, entityNodeDefault(urn, type, direction));
    if (node.direction && node.direction !== direction && !node.inCycle) {
        // Node is both upstream and downstream
        node.inCycle = true;
        if (node.fetchStatus[direction] === FetchStatus.UNNEEDED) {
            node.fetchStatus[direction] = FetchStatus.UNFETCHED;
        }
    }
    return node;
}

function defaultLineageFilter(): Filters {
    return { limit: LINEAGE_FILTER_PAGINATION, facetFilters: new Map() };
}

export function entityNodeDefault(urn: string, type: EntityType, direction: LineageDirection): LineageEntity {
    const otherDirection =
        direction === LineageDirection.Upstream ? LineageDirection.Downstream : LineageDirection.Upstream;
    return {
        id: urn,
        urn,
        type,
        direction, // TODO: Handle a node that is both upstream and downstream?
        isExpanded: {
            [direction]: isTransformational({ urn, type }),
            [otherDirection]: false,
        } as Record<LineageDirection, boolean>,
        fetchStatus: {
            [direction]: FetchStatus.UNFETCHED,
            [otherDirection]: FetchStatus.UNNEEDED,
        } as Record<LineageDirection, FetchStatus>,
        filters: {
            [LineageDirection.Upstream]: defaultLineageFilter(),
            [LineageDirection.Downstream]: defaultLineageFilter(),
        },
    };
}

export function addQueryNodes(
    maybePath: Array<Maybe<Pick<Entity, 'urn' | 'type'>>> | undefined,
    direction: LineageDirection,
    context: Pick<NodeContext, 'nodes' | 'edges' | 'adjacencyList'>,
) {
    const { nodes, edges, adjacencyList } = context;

    const path = maybePath?.filter((p): p is Pick<Entity, 'urn' | 'type'> => !!p) || [];
    path.forEach((node, i) => {
        if (!node || node.type !== EntityType.Query || i === 0 || i === path.length - 1) return;
        setDefault(nodes, node.urn, {
            id: node.urn,
            urn: node.urn,
            type: node.type,
            direction,
            isExpanded: {
                [LineageDirection.Upstream]: true,
                [LineageDirection.Downstream]: true,
            },
            fetchStatus: {
                [LineageDirection.Upstream]: FetchStatus.UNNEEDED,
                [LineageDirection.Downstream]: FetchStatus.UNNEEDED,
            },
            filters: {
                [LineageDirection.Upstream]: defaultLineageFilter(),
                [LineageDirection.Downstream]: defaultLineageFilter(),
            },
        });
        edges.set(getEdgeId(path[i - 1].urn, path[i + 1].urn, direction), {
            isDisplayed: true,
            isManual: false,
            via: node.urn,
        });
        setDefault(adjacencyList[direction], node.urn, new Set()).add(path[i + 1].urn);
        setDefault(adjacencyList[reverseDirection(direction)], node.urn, new Set()).add(path[i - 1].urn);
    });
}
