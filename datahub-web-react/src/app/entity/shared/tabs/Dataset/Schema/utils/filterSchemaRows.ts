import { EntityType, SchemaField } from '../../../../../../../types.generated';
import EntityRegistry from '../../../../../EntityRegistry';

function matchesTagsOrTerms(field: SchemaField, filterText: string, entityRegistry: EntityRegistry) {
    return (
        field.globalTags?.tags?.find((tagAssociation) =>
            entityRegistry.getDisplayName(EntityType.Tag, tagAssociation.tag).toLocaleLowerCase().includes(filterText),
        ) ||
        field.glossaryTerms?.terms?.find((termAssociation) =>
            entityRegistry
                .getDisplayName(EntityType.GlossaryTerm, termAssociation.term)
                .toLocaleLowerCase()
                .includes(filterText),
        )
    );
}

// returns list of fieldPaths for fields that have Terms or Tags matching the filterText
function getFilteredFieldPathsByMetadata(editableSchemaMetadata: any, entityRegistry, filterText) {
    return (
        editableSchemaMetadata?.editableSchemaFieldInfo
            .filter((fieldInfo) => matchesTagsOrTerms(fieldInfo, filterText, entityRegistry))
            .map((fieldInfo) => fieldInfo.fieldPath) || []
    );
}

function filterDescription(field: SchemaField, filterText: string) {
    return field.description?.toLocaleLowerCase().includes(filterText);
}

// returns list of fieldPaths for fields that have description matching the filterText
function getDescriptionFieldPathsByMetadata(editableSchemaMetadata: any, filterText: string) {
    const data =
        editableSchemaMetadata?.editableSchemaFieldInfo
            .filter((fieldInfo) => {
                return fieldInfo.description !== null;
            })
            .filter((fieldInfo) => filterDescription(fieldInfo, filterText))
            .map((fieldInfo) => fieldInfo.fieldPath) || [];
    return data;
}

function matchesDescription(fieldDescription: any, filterText: string) {
    return fieldDescription.toLocaleLowerCase().includes(filterText);
}

function matchesEditableTagsOrTerms(field: SchemaField, filteredFieldPathsByEditableMetadata: any) {
    return filteredFieldPathsByEditableMetadata.includes(field.fieldPath);
}

function matchesEditableDescription(field: SchemaField, filteredEditableDescription: any) {
    return filteredEditableDescription.includes(field.fieldPath);
}

function matchesFieldName(fieldName: string, filterText: string) {
    return fieldName.toLocaleLowerCase().includes(filterText);
}

export function filterSchemaRows(
    rows: SchemaField[],
    editableSchemaMetadata: any,
    filterText: string,
    entityRegistry: EntityRegistry,
) {
    if (!rows) return { filteredRows: [], expandedRowsFromFilter: new Set() };
    if (!filterText) return { filteredRows: rows, expandedRowsFromFilter: new Set() };
    const formattedFilterText = filterText.toLocaleLowerCase();

    const filteredFieldPathsByEditableMetadata = getFilteredFieldPathsByMetadata(
        editableSchemaMetadata,
        entityRegistry,
        formattedFilterText,
    );

    const filteredEditableDescription = getDescriptionFieldPathsByMetadata(editableSchemaMetadata, formattedFilterText);

    const finalFieldPaths = new Set();
    const expandedRowsFromFilter = new Set();

    rows.forEach((row) => {
        if (
            matchesFieldName(row.fieldPath, formattedFilterText) ||
            matchesEditableTagsOrTerms(row, filteredFieldPathsByEditableMetadata) ||
            matchesEditableDescription(row, filteredEditableDescription) ||
            matchesTagsOrTerms(row, formattedFilterText, entityRegistry) || // non-editable tags and terms
            matchesDescription(row.description, formattedFilterText) // non-editable description
        ) {
            finalFieldPaths.add(row.fieldPath);
        }
        const splitFieldPath = row.fieldPath.split('.');
        const fieldName = splitFieldPath.slice(-1)[0];
        if (
            matchesFieldName(fieldName, formattedFilterText) ||
            matchesEditableTagsOrTerms(row, filteredFieldPathsByEditableMetadata) ||
            matchesEditableDescription(row, filteredEditableDescription) ||
            matchesTagsOrTerms(row, formattedFilterText, entityRegistry) || // non-editable tags and terms
            matchesDescription(row.description, formattedFilterText) // non-editable description
        ) {
            // if we match specifically on this field (not just its parent), add and expand all parents
            splitFieldPath.reduce((previous, current) => {
                finalFieldPaths.add(previous);
                expandedRowsFromFilter.add(previous);
                return `${previous}.${current}`;
            });
        }
    });

    const filteredRows = rows.filter((row) => finalFieldPaths.has(row.fieldPath));

    return { filteredRows, expandedRowsFromFilter };
}
