import { useSearchAcrossLineageQuery } from '../../../../../graphql/search.generated';
import { LineageDirection } from '../../../../../types.generated';
import { GetSearchResultsParams } from '../../components/styled/search/types';

export default function generateUseSearchResultsViaRelationshipHook({
    urn,
    direction,
    startTimeMillis,
    endTimeMillis,
}: {
    urn: string;
    direction: LineageDirection;
    startTimeMillis?: number;
    endTimeMillis?: number;
}) {
    return function useGetSearchResultsViaSearchAcrossLineage(params: GetSearchResultsParams) {
        const {
            variables: {
                input: { types, query, start, count, filters, orFilters },
            },
        } = params;

        const { data, loading, error, refetch } = useSearchAcrossLineageQuery({
            variables: {
                input: {
                    urn,
                    direction,
                    types,
                    query,
                    start,
                    count,
                    filters,
                    orFilters,
                    startTimeMillis: startTimeMillis || undefined,
                    endTimeMillis: endTimeMillis || undefined,
                },
            },
        });

        return {
            data: data?.searchAcrossLineage,
            loading,
            error,
            refetch: (refetchParams: GetSearchResultsParams['variables']) => {
                const {
                    input: {
                        types: refetchTypes,
                        query: refetchQuery,
                        start: refetchStart,
                        count: refetchCount,
                        filters: refetchFilters,
                        orFilters: refetchOrFilters,
                    },
                } = refetchParams;
                return refetch({
                    input: {
                        urn,
                        direction,
                        types: refetchTypes,
                        query: refetchQuery,
                        start: refetchStart,
                        count: refetchCount,
                        filters: refetchFilters,
                        orFilters: refetchOrFilters,
                    },
                }).then((res) => res.data.searchAcrossLineage);
            },
        };
    };
}
