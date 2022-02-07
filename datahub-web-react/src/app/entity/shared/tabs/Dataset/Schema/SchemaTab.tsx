import { Empty } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { GetDatasetQuery } from '../../../../../../graphql/dataset.generated';
import SchemaEditableContext from '../../../../../shared/SchemaEditableContext';
// import { EditableSchemaFieldInfo, GlobalTagsUpdate } from '../../../../../types.generated';
import SchemaHeader from '../../../../dataset/profile/schema/components/SchemaHeader';
import SchemaRawView from '../../../../dataset/profile/schema/components/SchemaRawView';
import { KEY_SCHEMA_PREFIX } from '../../../../dataset/profile/schema/utils/constants';
import { groupByFieldPath } from '../../../../dataset/profile/schema/utils/utils';
import { ANTD_GRAY } from '../../../constants';
import { useBaseEntity, useEntityData } from '../../../EntityContext';

import SchemaTable from './SchemaTable';

const NoSchema = styled(Empty)`
    color: ${ANTD_GRAY[6]};
    padding-top: 60px;
`;

export const SchemaTab = ({ properties }: { properties?: any }) => {
    const { entityData } = useEntityData();
    const baseEntity = useBaseEntity<GetDatasetQuery>();
    let editMode = true;
    if (properties && properties.hasOwnProperty('editMode')) {
        editMode = properties.editMode;
    }
    const { schemaMetadata, editableSchemaMetadata } = entityData || {};
    const usageStats = baseEntity?.dataset?.usageStats;
    const [showRaw, setShowRaw] = useState(false);
    const hasRawSchema = useMemo(
        () =>
            schemaMetadata?.platformSchema?.__typename === 'TableSchema' &&
            schemaMetadata?.platformSchema?.schema?.length > 0,
        [schemaMetadata],
    );
    const hasKeySchema = useMemo(
        () =>
            (schemaMetadata?.fields?.length || 0) > 0 &&
            schemaMetadata?.fields?.findIndex((field) => field.fieldPath.indexOf(KEY_SCHEMA_PREFIX) > -1) !== -1,
        [schemaMetadata],
    );

    const hasValueSchema = useMemo(
        () =>
            (schemaMetadata?.fields?.length || 0) > 0 &&
            schemaMetadata?.fields?.findIndex((field) => field.fieldPath.indexOf(KEY_SCHEMA_PREFIX) === -1) !== -1,
        [schemaMetadata],
    );

    const [showKeySchema, setShowKeySchema] = useState(false);

    // if there is no value schema, default the selected schema to Key
    useEffect(() => {
        if (!hasValueSchema && hasKeySchema) {
            setShowKeySchema(true);
        }
    }, [hasValueSchema, hasKeySchema, setShowKeySchema]);
    const rows = useMemo(() => {
        return groupByFieldPath(schemaMetadata?.fields, { showKeySchema });
    }, [schemaMetadata, showKeySchema]);

    return (
        <div>
            <SchemaHeader
                editMode={editMode}
                showRaw={showRaw}
                setShowRaw={setShowRaw}
                hasRaw={hasRawSchema}
                hasKeySchema={hasKeySchema}
                showKeySchema={showKeySchema}
                setShowKeySchema={setShowKeySchema}
            />
            {/* eslint-disable-next-line no-nested-ternary */}
            {showRaw ? (
                <SchemaRawView
                    schemaDiff={{ current: schemaMetadata }}
                    editMode={editMode}
                    showKeySchema={showKeySchema}
                />
            ) : rows && rows.length > 0 ? (
                <>
                    <SchemaEditableContext.Provider value={editMode}>
                        <SchemaTable
                            schemaMetadata={schemaMetadata}
                            rows={rows}
                            editMode={editMode}
                            editableSchemaMetadata={editableSchemaMetadata}
                            usageStats={usageStats}
                        />
                    </SchemaEditableContext.Provider>
                </>
            ) : (
                <NoSchema />
            )}
        </div>
    );
};
