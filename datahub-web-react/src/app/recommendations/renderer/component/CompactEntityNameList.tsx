import React from 'react';
import { Entity } from '../../../../types.generated';
import { IconStyleType } from '../../../entity/Entity';
import { useEntityRegistry } from '../../../useEntityRegistry';
import { EntityPreviewTag } from './EntityPreviewTag';

type Props = {
    entities: Array<Entity>;
};
export const CompactEntityNameList = ({ entities }: Props) => {
    const entityRegistry = useEntityRegistry();
    return (
        <>
            {entities.map((entity) => {
                console.log(entity);
                const genericProps = entityRegistry.getGenericEntityProperties(entity.type, entity);
                const platformLogoUrl = genericProps?.platform?.info?.logoUrl;
                const displayName = entityRegistry.getDisplayName(entity.type, entity);
                const fallbackIcon = entityRegistry.getIcon(entity.type, 12, IconStyleType.ACCENT);
                const url = entityRegistry.getEntityUrl(entity.type, entity.urn);
                return (
                    <EntityPreviewTag
                        displayName={displayName}
                        url={url}
                        platformLogoUrl={platformLogoUrl || undefined}
                        logoComponent={fallbackIcon}
                    />
                );
            })}
        </>
    );
};
