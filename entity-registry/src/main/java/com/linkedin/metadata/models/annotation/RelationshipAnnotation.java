package com.linkedin.metadata.models.annotation;

import com.linkedin.metadata.models.ModelValidationException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.annotation.Nonnull;
import lombok.Value;


/**
 * Simple object representation of the @Relationship annotation metadata.
 */
@Value
public class RelationshipAnnotation {

  public static final String ANNOTATION_NAME = "Relationship";
  private static final String NAME_FIELD = "name";
  private static final String ENTITY_TYPES_FIELD = "entityTypes";

  String name;
  List<String> validDestinationTypes;

  @Nonnull
  public static RelationshipAnnotation fromPegasusAnnotationObject(
      @Nonnull final Object annotationObj,
      @Nonnull final String context
  ) {
    if (!Map.class.isAssignableFrom(annotationObj.getClass())) {
      throw new ModelValidationException(String.format(
          "Failed to validate @%s annotation declared at %s: Invalid value type provided (Expected Map)",
          ANNOTATION_NAME,
          context
      ));
    }

    Map map = (Map) annotationObj;
    final Optional<String> name = AnnotationUtils.getField(map, NAME_FIELD, String.class);
    if (!name.isPresent()) {
      throw new ModelValidationException(
          String.format(
              "Failed to validate @%s annotation at %s: Invalid field '%s'. Expected type String",
              ANNOTATION_NAME,
              context,
              NAME_FIELD
          ));
    }

    final Optional<List> entityTypesList = AnnotationUtils.getField(map, ENTITY_TYPES_FIELD, List.class);
    if (!entityTypesList.isPresent() || entityTypesList.get().isEmpty()) {
      throw new ModelValidationException(
          String.format(
              "Failed to validate @%s annotation at %s: Invalid field '%s'. Expected type List<String>",
              ANNOTATION_NAME,
              context,
              ENTITY_TYPES_FIELD
          ));
    }
    final List<String> entityTypes = new ArrayList<>(entityTypesList.get().size());
    for (Object entityTypeObj : entityTypesList.get()) {
      if (!String.class.isAssignableFrom(entityTypeObj.getClass())) {
        throw new ModelValidationException(
          String.format(
            "Failed to validate @%s annotation at %s: Invalid field '%s'. Expected type List<String>",
            ANNOTATION_NAME,
              context,
            ENTITY_TYPES_FIELD
          ));
      }
      entityTypes.add((String) entityTypeObj);
    }

    return new RelationshipAnnotation(name.get(), entityTypes);
  }
}