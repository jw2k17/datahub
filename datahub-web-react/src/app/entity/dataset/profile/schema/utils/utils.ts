import * as diff from 'diff';

import {
    EditableSchemaMetadata,
    EditableSchemaFieldInfo,
    EditableSchemaMetadataUpdate,
    SchemaField,
    PlatformSchema,
} from '../../../../../../types.generated';
import { convertTagsForUpdate } from '../../../../../shared/tags/utils/convertTagsForUpdate';
import { SchemaDiffSummary } from '../components/SchemaVersionSummary';
import { KEY_SCHEMA_PREFIX } from './constants';
import { ExtendedSchemaFields } from './types';

export function convertEditableSchemaMeta(
    editableSchemaMeta?: Array<EditableSchemaFieldInfo>,
    fields?: Array<SchemaField>,
): Array<SchemaField> {
    const updatedFields = [...(fields || [])] as Array<SchemaField>;
    if (editableSchemaMeta && editableSchemaMeta.length > 0) {
        editableSchemaMeta.forEach((updatedField) => {
            const originalFieldIndex = updatedFields.findIndex((f) => f.fieldPath === updatedField.fieldPath);
            if (originalFieldIndex > -1) {
                updatedFields[originalFieldIndex] = {
                    ...updatedFields[originalFieldIndex],
                    description: updatedField.description,
                    globalTags: { ...updatedField.globalTags },
                };
            }
        });
    }
    return updatedFields;
}

export function convertEditableSchemaMetadataForUpdate(
    editableSchemaMetadata: EditableSchemaMetadata | null | undefined,
): EditableSchemaMetadataUpdate {
    return {
        editableSchemaFieldInfo:
            editableSchemaMetadata?.editableSchemaFieldInfo.map((editableSchemaFieldInfo) => ({
                fieldPath: editableSchemaFieldInfo?.fieldPath,
                description: editableSchemaFieldInfo?.description,
                globalTags: { tags: convertTagsForUpdate(editableSchemaFieldInfo?.globalTags?.tags || []) },
            })) || [],
    };
}

export function filterKeyFieldPath(showKeySchema: boolean, field: SchemaField) {
    return field.fieldPath.startsWith(KEY_SCHEMA_PREFIX) ? showKeySchema : !showKeySchema;
}

// group schema fields by fieldPath and grouping for hierarchy in schema table
export function groupByFieldPath(
    schemaRows?: Array<SchemaField>,
    options: { showKeySchema: boolean } = { showKeySchema: false },
): Array<ExtendedSchemaFields> {
    const rows = [
        ...(schemaRows?.filter(filterKeyFieldPath.bind({}, options.showKeySchema)) || []),
    ] as Array<ExtendedSchemaFields>;

    const outputRows: Array<ExtendedSchemaFields> = [];
    const outputRowByPath = {};

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = { children: undefined, ...rows[rowIndex] };

        const [parentFieldPath] = row.fieldPath.split(/\.(?=[^.]+$)/);
        const parentRow = outputRowByPath[parentFieldPath];

        // if the parent field exists in the ouput, add the current row as a child
        if (parentRow) {
            parentRow.children = [...(parentRow.children || []), row];
        } else {
            outputRows.push(row);
        }
        outputRowByPath[row.fieldPath] = row;
    }
    return outputRows;
}

export function diffMarkdown(oldStr: string, newStr: string) {
    const diffArray = diff.diffChars(oldStr || '', newStr || '');
    return diffArray
        .map((diffOne) => {
            if (diffOne.added) {
                return `<ins class="diff">${diffOne.value}</ins>`;
            }
            if (diffOne.removed) {
                return `<del class="diff">${diffOne.value}</del>`;
            }
            return diffOne.value;
        })
        .join('');
}

export function diffJson(oldStr: string, newStr: string) {
    const diffArray = diff.diffJson(oldStr || '', newStr || '');
    return diffArray
        .map((diffOne) => {
            if (diffOne.added) {
                return `+${diffOne.value}`;
            }
            if (diffOne.removed) {
                return `-${diffOne.value}`;
            }
            return diffOne.value;
        })
        .join('');
}

export function formatRawSchema(schemaValue?: string | null): string {
    try {
        if (!schemaValue) {
            return schemaValue || '';
        }
        return JSON.stringify(JSON.parse(schemaValue), null, 2);
    } catch (e) {
        return schemaValue || '';
    }
}

export function getRawSchema(schema: PlatformSchema | undefined | null, showKeySchema: boolean): string {
    if (!schema) {
        return '';
    }

    if (schema.__typename === 'TableSchema') {
        return schema.schema;
    }
    if (schema.__typename === 'KeyValueSchema') {
        return showKeySchema ? schema.keySchema : schema.valueSchema;
    }
    return '';
}

// Get diff summary between two versions and prepare to visualize description diff changes
export function getDiffSummary(
    currentVersionRows?: Array<SchemaField>,
    previousVersionRows?: Array<SchemaField>,
    options: { showKeySchema: boolean } = { showKeySchema: false },
): { rows: Array<ExtendedSchemaFields>; diffSummary: SchemaDiffSummary } {
    let rows = [
        ...(currentVersionRows?.filter(filterKeyFieldPath.bind({}, options.showKeySchema)) || []),
    ] as Array<ExtendedSchemaFields>;
    const previousRows = [
        ...(previousVersionRows?.filter(filterKeyFieldPath.bind({}, options.showKeySchema)) || []),
    ] as Array<ExtendedSchemaFields>;

    const diffSummary: SchemaDiffSummary = {
        added: 0,
        removed: 0,
        updated: 0,
    };

    if (previousVersionRows && previousVersionRows.length > 0) {
        rows.forEach((field, rowIndex) => {
            const relevantPastFieldIndex = previousRows.findIndex(
                (pf) => pf.type === rows[rowIndex].type && pf.fieldPath === rows[rowIndex].fieldPath,
            );
            if (relevantPastFieldIndex > -1) {
                if (previousRows[relevantPastFieldIndex].description !== rows[rowIndex].description) {
                    rows[rowIndex] = {
                        ...rows[rowIndex],
                        previousDescription: previousRows[relevantPastFieldIndex].description,
                    };
                    diffSummary.updated++; // Increase updated row number in diff summary
                }
                previousRows.splice(relevantPastFieldIndex, 1);
            } else {
                rows[rowIndex] = { ...rows[rowIndex], isNewRow: true };
                diffSummary.added++; // Increase added row number in diff summary
            }
        });
        rows = [...rows, ...previousRows.map((pf) => ({ ...pf, isDeletedRow: true }))];
        diffSummary.removed = previousRows.length; // removed row number in diff summary
    }

    return { rows, diffSummary };
}
