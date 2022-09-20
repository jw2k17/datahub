import React from 'react';
import { FacetMetadata, EntityType } from '../../types.generated';
import { SetDomainModal } from '../entity/shared/containers/profile/sidebar/Domain/SetDomainModal';
import { EditOwnersModal } from '../entity/shared/containers/profile/sidebar/Ownership/EditOwnersModal';
import EditTagTermsModal from '../shared/tags/AddTagsTermsModal';
import { ChooseEntityTypeModal } from './ChooseEntityTypeModal';
import { EditTextModal } from './EditTextModal';

type Props = {
    facet?: FacetMetadata | null;
    filterField: string;
    onSelect: (values: string[]) => void;
    onCloseModal: () => void;
    initialValues?: string[];
};

export const SelectFilterValueModal = ({ filterField, onSelect, onCloseModal, initialValues, facet }: Props) => {
    if (filterField === 'owners') {
        return (
            <EditOwnersModal
                title="Select Owners"
                urns={[]}
                defaultValues={initialValues?.map((urn) => ({
                    urn,
                    entity: facet?.aggregations.find((aggregation) => aggregation.value === urn)?.entity,
                }))}
                onCloseModal={onCloseModal}
                hideOwnerType
                onOkOverride={(owners) => {
                    onSelect(owners.map((owner) => owner.value.ownerUrn));
                    onCloseModal();
                }}
            />
        );
    }
    if (filterField === 'domains') {
        return (
            <SetDomainModal
                titleOverride="Select Domain"
                urns={[]}
                defaultValue={
                    initialValues?.map((urn) => ({
                        urn,
                        entity: facet?.aggregations.find((aggregation) => aggregation.value === urn)?.entity,
                    }))?.[0]
                }
                onCloseModal={onCloseModal}
                onOkOverride={(domainUrn) => {
                    onSelect([domainUrn]);
                    onCloseModal();
                }}
            />
        );
    }

    if (filterField === 'fieldPaths') {
        return (
            <EditTextModal
                title="Filter by Column"
                defaultValue={initialValues?.[0]}
                onCloseModal={onCloseModal}
                onOkOverride={(newValue) => {
                    onSelect([newValue]);
                    onCloseModal();
                }}
            />
        );
    }

    if (filterField === 'description' || filterField === 'fieldDescriptions') {
        return (
            <EditTextModal
                title="Filter by Description"
                defaultValue={initialValues?.[0]}
                onCloseModal={onCloseModal}
                onOkOverride={(newValue) => {
                    onSelect([newValue]);
                    onCloseModal();
                }}
            />
        );
    }

    if (filterField === 'name') {
        return (
            <EditTextModal
                title="Filter by Name"
                defaultValue={initialValues?.[0]}
                onCloseModal={onCloseModal}
                onOkOverride={(newValue) => {
                    onSelect([newValue]);
                    onCloseModal();
                }}
            />
        );
    }

    if (filterField === 'typeNames') {
        return (
            <EditTextModal
                title="Filter by Subtype"
                defaultValue={initialValues?.[0]}
                onCloseModal={onCloseModal}
                onOkOverride={(newValue) => {
                    onSelect([newValue]);
                    onCloseModal();
                }}
            />
        );
    }

    console.log({ filterField });
    if (filterField === 'entity') {
        return (
            <ChooseEntityTypeModal
                title="Filter by Entity Type"
                defaultValue={initialValues?.[0]}
                onCloseModal={onCloseModal}
                onOkOverride={(newValue) => {
                    onSelect([newValue]);
                    onCloseModal();
                }}
            />
        );
    }

    if (filterField === 'platform') {
        return (
            <EditTextModal
                title="Filter by Platform"
                defaultValue={initialValues?.[0]}
                onCloseModal={onCloseModal}
                onOkOverride={(newValue) => {
                    onSelect([newValue]);
                    onCloseModal();
                }}
            />
        );
    }

    if (filterField === 'tags' || filterField === 'fieldTags') {
        return (
            <EditTagTermsModal
                resources={[]}
                type={EntityType.Tag}
                visible
                onCloseModal={onCloseModal}
                onOkOverride={(urns) => {
                    onSelect(urns);
                    onCloseModal();
                }}
                defaultValues={initialValues?.map((urn) => ({
                    urn,
                    entity: facet?.aggregations.find((aggregation) => aggregation.value === urn)?.entity,
                }))}
            />
        );
    }

    if (filterField === 'removed') {
        onSelect(['true']);
        onCloseModal();
        // return (
        //     <ChooseBooleanModal
        //         title="Is Soft Deleted"
        //         defaultValue={initialValues?.[0]}
        //         onCloseModal={onCloseModal}
        //         onOkOverride={(newValue) => {
        //             onSelect([newValue]);
        //             onCloseModal();
        //         }}
        //     />
        // );
    }

    if (filterField === 'glossaryTerms' || filterField === 'fieldGlossaryTerms') {
        return (
            <EditTagTermsModal
                resources={[]}
                type={EntityType.GlossaryTerm}
                visible
                onCloseModal={onCloseModal}
                onOkOverride={(urns) => {
                    onSelect(urns);
                    onCloseModal();
                }}
                defaultValues={initialValues?.map((urn) => ({
                    urn,
                    entity: facet?.aggregations.find((aggregation) => aggregation.value === urn)?.entity,
                }))}
            />
        );
    }
    return null;
};
