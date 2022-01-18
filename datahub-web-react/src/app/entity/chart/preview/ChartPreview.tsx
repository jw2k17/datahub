import React from 'react';
import {
    AccessLevel,
    Domain,
    EntityType,
    GlobalTags,
    GlossaryTerms,
    Owner,
    SearchInsight,
} from '../../../../types.generated';
import DefaultPreviewCard from '../../../preview/DefaultPreviewCard';
import { useEntityRegistry } from '../../../useEntityRegistry';
import { getLogoFromPlatform } from '../../../shared/getLogoFromPlatform';
import { capitalizeFirstLetter } from '../../../shared/capitalizeFirstLetter';

export const ChartPreview = ({
    urn,
    name,
    description,
    platform,
    access,
    owners,
    tags,
    glossaryTerms,
    domain,
    insights,
}: {
    urn: string;
    platform: string;
    name?: string;
    description?: string | null;
    access?: AccessLevel | null;
    owners?: Array<Owner> | null;
    tags?: GlobalTags;
    glossaryTerms?: GlossaryTerms | null;
    domain?: Domain | null;
    insights?: Array<SearchInsight> | null;
}): JSX.Element => {
    const entityRegistry = useEntityRegistry();
    const capitalizedPlatform = capitalizeFirstLetter(platform);

    return (
        <DefaultPreviewCard
            url={entityRegistry.getEntityUrl(EntityType.Chart, urn)}
            name={name || ''}
            description={description || ''}
            type="Chart"
            logoUrl={getLogoFromPlatform(platform) || ''}
            platform={capitalizedPlatform}
            qualifier={access}
            tags={tags}
            owners={owners}
            glossaryTerms={glossaryTerms || undefined}
            domain={domain}
            insights={insights}
        />
    );
};
