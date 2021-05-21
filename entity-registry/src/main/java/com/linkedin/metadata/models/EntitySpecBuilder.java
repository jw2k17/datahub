package com.linkedin.metadata.models;

import com.linkedin.data.schema.ArrayDataSchema;
import com.linkedin.data.schema.DataSchema;
import com.linkedin.data.schema.RecordDataSchema;
import com.linkedin.data.schema.TyperefDataSchema;
import com.linkedin.data.schema.UnionDataSchema;
import com.linkedin.data.schema.annotation.DataSchemaRichContextTraverser;
import com.linkedin.data.schema.annotation.PegasusSchemaAnnotationHandlerImpl;
import com.linkedin.data.schema.annotation.SchemaAnnotationHandler;
import com.linkedin.data.schema.annotation.SchemaAnnotationProcessor;
import com.linkedin.metadata.models.annotation.AspectAnnotation;
import com.linkedin.metadata.models.annotation.EntityAnnotation;
import com.linkedin.metadata.models.annotation.RelationshipAnnotation;
import com.linkedin.metadata.models.annotation.SearchableAnnotation;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.annotation.Nonnull;
import lombok.extern.slf4j.Slf4j;


@Slf4j
public class EntitySpecBuilder {

  private static final String URN_FIELD_NAME = "urn";
  private static final String ASPECTS_FIELD_NAME = "aspects";

  public static SchemaAnnotationHandler _searchHandler = new PegasusSchemaAnnotationHandlerImpl(SearchableAnnotation.ANNOTATION_NAME);
  public static SchemaAnnotationHandler _browseHandler = new PegasusSchemaAnnotationHandlerImpl(BrowsePathFieldSpecExtractor.ANNOTATION_NAME);
  public static SchemaAnnotationHandler _relationshipHandler = new PegasusSchemaAnnotationHandlerImpl(RelationshipAnnotation.ANNOTATION_NAME);

  private final Set<String> _entityNames = new HashSet<>();
  private final Set<RelationshipFieldSpec> _relationshipFieldSpecs = new HashSet<>();

  public EntitySpecBuilder() { }

  public List<EntitySpec> buildEntitySpecs(@Nonnull final DataSchema snapshotSchema) {

    final UnionDataSchema snapshotUnionSchema = (UnionDataSchema) snapshotSchema.getDereferencedDataSchema();
    final List<UnionDataSchema.Member> unionMembers = snapshotUnionSchema.getMembers();

    final List<EntitySpec> entitySpecs = new ArrayList<>();
    for (final UnionDataSchema.Member member : unionMembers) {
      final EntitySpec entitySpec = buildEntitySpec(member.getType());
      if (entitySpec != null) {
        entitySpecs.add(buildEntitySpec(member.getType()));
      }

      // Now validate that all relationships point to valid entities.
      for (final RelationshipFieldSpec spec : _relationshipFieldSpecs) {
        if (!_entityNames.containsAll(spec.getValidDestinationTypes())) {
          failValidation(
              String.format("Found invalid relationship with name %s at path %s. Invalid entityType(s) provided.",
                  spec.getRelationshipName(),
                  spec.getPath().toString()));
        }
      }

    }
    return entitySpecs;
  }

  public EntitySpec buildEntitySpec(@Nonnull final DataSchema entitySnapshotSchema) {

    // 0. Validate the Snapshot definition
    final RecordDataSchema entitySnapshotRecordSchema = validateSnapshot(entitySnapshotSchema);

    if (entitySnapshotRecordSchema == null) {
      return null;
    }

    // 1. Parse information about the entity from the "entity" annotation.
    final Object entityAnnotationObj = entitySnapshotRecordSchema.getProperties().get(EntityAnnotation.ANNOTATION_NAME);

    if (entityAnnotationObj != null) {

      final ArrayDataSchema aspectArraySchema =
          (ArrayDataSchema) entitySnapshotRecordSchema.getField(ASPECTS_FIELD_NAME).getType().getDereferencedDataSchema();

      final UnionDataSchema aspectUnionSchema =
          (UnionDataSchema) aspectArraySchema.getItems().getDereferencedDataSchema();

      final List<UnionDataSchema.Member> unionMembers = aspectUnionSchema.getMembers();
      final List<AspectSpec> aspectSpecs = new ArrayList<>();
      for (final UnionDataSchema.Member member : unionMembers) {
        final AspectSpec spec = buildAspectSpec(member.getType());
        if (spec != null) {
          aspectSpecs.add(spec);
        }
      }

      EntityAnnotation entityAnnotation = EntityAnnotation.fromSchemaProperty(entityAnnotationObj, entitySnapshotRecordSchema.getFullName());

      // Validate aspect specs
      Set<String> aspectNames = new HashSet<>();
      boolean foundKey = false;
      for (final AspectSpec aspectSpec : aspectSpecs) {
        if (aspectNames.contains(aspectSpec.getName())) {
          failValidation(String.format("Could not build entity spec for entity with name %s."
                  + " Found multiple Aspects with the same name %s",
              entityAnnotation.getName(), aspectSpec.getName()));
          return null;
        }
        if (aspectSpec.isKey()) {
          if (foundKey) {
            failValidation(String.format("Could not build entity spec for entity with name %s."
                    + " Found multiple Key aspects.",
                entityAnnotation.getName()));
            return null;
          }
          validateKeyAspect(aspectSpec);
          foundKey = true;
        }
        aspectNames.add(aspectSpec.getName());
      }
      if (!foundKey) {
        failValidation(String.format("Could not build entity spec for entity with name %s."
                + " Did not find a Key aspect.",
            entityAnnotation.getName()));
        return null;
      }

      // Validate entity name
      if (_entityNames.contains(entityAnnotation.getName())) {
        // Duplicate entity found.
        failValidation(String.format("Could not build entity spec for entity with name %s."
                + " Found multiple Entity Snapshots with the same name.",
            entityAnnotation.getName()));
        return null;
      }

      _entityNames.add(entityAnnotation.getName());

      return new EntitySpec(
          aspectSpecs,
          entityAnnotation,
          entitySnapshotRecordSchema,
          (TyperefDataSchema) aspectArraySchema.getItems());
    }

    failValidation(String.format("Could not build entity spec for entity with name %s. Missing @%s annotation.",
        entitySnapshotRecordSchema.getName(), EntityAnnotation.ANNOTATION_NAME));
    return null;
  }


  private AspectSpec buildAspectSpec(@Nonnull final DataSchema aspectDataSchema) {

    final RecordDataSchema aspectRecordSchema = validateAspect(aspectDataSchema);

    if (aspectRecordSchema == null) {
      return null;
    }

    final Object aspectAnnotationObj = aspectRecordSchema.getProperties().get(AspectAnnotation.ANNOTATION_NAME);

    if (aspectAnnotationObj != null) {

      final AspectAnnotation aspectAnnotation =
          AspectAnnotation.fromSchemaProperty(aspectAnnotationObj, aspectRecordSchema.getFullName());

      final SchemaAnnotationProcessor.SchemaAnnotationProcessResult processedSearchResult =
          SchemaAnnotationProcessor.process(Collections.singletonList(_searchHandler),
              aspectRecordSchema, new SchemaAnnotationProcessor.AnnotationProcessOption());

      final SchemaAnnotationProcessor.SchemaAnnotationProcessResult processedRelationshipResult =
          SchemaAnnotationProcessor.process(Collections.singletonList(_relationshipHandler),
              aspectRecordSchema, new SchemaAnnotationProcessor.AnnotationProcessOption());

      final SchemaAnnotationProcessor.SchemaAnnotationProcessResult processedBrowseResult =
          SchemaAnnotationProcessor.process(Collections.singletonList(_browseHandler),
              aspectRecordSchema, new SchemaAnnotationProcessor.AnnotationProcessOption());

      // Extract Searchable Field Specs
      final SearchableFieldSpecExtractor searchableFieldSpecExtractor = new SearchableFieldSpecExtractor();
      final DataSchemaRichContextTraverser searchableFieldSpecTraverser =
          new DataSchemaRichContextTraverser(searchableFieldSpecExtractor);
      searchableFieldSpecTraverser.traverse(processedSearchResult.getResultSchema());

      // Extract Relationship Field Specs
      final RelationshipFieldSpecExtractor relationshipFieldSpecExtractor = new RelationshipFieldSpecExtractor();
      final DataSchemaRichContextTraverser relationshipFieldSpecTraverser =
          new DataSchemaRichContextTraverser(relationshipFieldSpecExtractor);
      relationshipFieldSpecTraverser.traverse(processedRelationshipResult.getResultSchema());

      // Extract Browsable Field Specs
      final BrowsePathFieldSpecExtractor browsePathFieldSpecExtractor = new BrowsePathFieldSpecExtractor();
      final DataSchemaRichContextTraverser browsePathFieldSpecTraverser =
          new DataSchemaRichContextTraverser(browsePathFieldSpecExtractor);
      browsePathFieldSpecTraverser.traverse(processedBrowseResult.getResultSchema());

      // Capture the list of entity names from relationships extracted.
      _relationshipFieldSpecs.addAll(relationshipFieldSpecExtractor.getSpecs());

      return new AspectSpec(
          aspectAnnotation,
          searchableFieldSpecExtractor.getSpecs(),
          relationshipFieldSpecExtractor.getSpecs(),
          browsePathFieldSpecExtractor.getSpecs(),
          aspectRecordSchema);
    }

    failValidation(String.format("Could not build aspect spec for aspect with name %s. Missing @Aspect annotation.",
        aspectRecordSchema.getName()));
    return null;
  }

  private RecordDataSchema validateSnapshot(@Nonnull final DataSchema entitySnapshotSchema) {
    // 0. Validate that schema is a Record
    if (entitySnapshotSchema.getType() != DataSchema.Type.RECORD) {
      failValidation(String.format("Failed to validate entity snapshot schema of type %s. Schema must be of record type.",
          entitySnapshotSchema.getType().toString()));
      return null;
    }

    final RecordDataSchema entitySnapshotRecordSchema = (RecordDataSchema) entitySnapshotSchema;

    // 1. Validate Urn field
    if (entitySnapshotRecordSchema.getField(URN_FIELD_NAME) == null
        || entitySnapshotRecordSchema.getField(URN_FIELD_NAME).getType().getDereferencedType() != DataSchema.Type.STRING) {
      failValidation(String.format("Failed to validate entity snapshot schema with name %s. Invalid urn field.",
          entitySnapshotRecordSchema.getName()));
      return null;
    }

    // 2. Validate Aspect Array
    if (entitySnapshotRecordSchema.getField(ASPECTS_FIELD_NAME) == null
        || entitySnapshotRecordSchema.getField(ASPECTS_FIELD_NAME).getType().getDereferencedType() != DataSchema.Type.ARRAY) {

      failValidation(String.format("Failed to validate entity snapshot schema with name %s. Invalid aspects field found. "
              + "'aspects' should be an array of union type.",
          entitySnapshotRecordSchema.getName()));
      return null;
    }

    // 3. Validate Aspect Union
    final ArrayDataSchema aspectArray = (ArrayDataSchema) entitySnapshotRecordSchema.getField(ASPECTS_FIELD_NAME)
        .getType()
        .getDereferencedDataSchema();
    if (aspectArray.getItems().getType() != DataSchema.Type.TYPEREF
       || aspectArray.getItems().getDereferencedType() != DataSchema.Type.UNION) {

      failValidation(String.format("Failed to validate entity snapshot schema with name %s. Invalid aspects field field. "
              + "'aspects' should be an array of union type.",
          entitySnapshotRecordSchema.getName()));
      return null;
    }

    return entitySnapshotRecordSchema;
  }

  private RecordDataSchema validateAspect(@Nonnull final DataSchema aspectSchema) {
    // Validate that schema is a Record
    if (aspectSchema.getType() != DataSchema.Type.RECORD) {
      failValidation(String.format("Failed to validate aspect schema of type %s. Schema must be of record type.",
          aspectSchema.getType().toString()));
      return null;
    }
    return (RecordDataSchema) aspectSchema;
  }

  private void validateKeyAspect(@Nonnull final AspectSpec keyAspect) {
    // Validate that schema is a Record
    RecordDataSchema schema = keyAspect.getPegasusSchema();
    // Validate that each field is a string or enum.
    for (RecordDataSchema.Field field : schema.getFields()) {
      if (!DataSchema.Type.STRING.equals(field.getType().getDereferencedType())
          || !DataSchema.Type.ENUM.equals(field.getType().getDereferencedType())
      ) {
        failValidation(
            "Failed to validate key aspect. Key aspects must only contain fields of STRING or ENUM type.");
      }
    }
  }

  private void failValidation(@Nonnull final String message) {
    throw new ModelValidationException(message);
  }
}
