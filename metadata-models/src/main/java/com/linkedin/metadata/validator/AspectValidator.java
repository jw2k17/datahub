package com.linkedin.metadata.validator;

import com.linkedin.data.schema.DataSchema;
import com.linkedin.data.schema.RecordDataSchema;
import com.linkedin.data.schema.UnionDataSchema;
import com.linkedin.data.template.UnionTemplate;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import javax.annotation.Nonnull;


public class AspectValidator {

  // A cache of validated classes
  private static final Set<Class<? extends UnionTemplate>> VALIDATED = ConcurrentHashMap.newKeySet();

  private AspectValidator() {
    // Util class
  }

  /**
   * Validates an aspect model defined in com.linkedin.metadata.aspect.
   *
   * @param schema schema for the model
   */
  public static void validateSchema(@Nonnull UnionDataSchema schema, @Nonnull String aspectClassName) {

    if (!ValidationUtils.isUnionWithOnlyComplexMembers(schema)) {
      ValidationUtils.invalidSchema("Aspect '%s' must be a union containing only record type members", aspectClassName);
    }
  }

  /**
   * Similar to {@link #validateSchema(UnionDataSchema, String)} but take a {@link Class} instead and caches results.
   */
  public static void validateSchema(@Nonnull Class<? extends UnionTemplate> clazz) {
    if (VALIDATED.contains(clazz)) {
      return;
    }

    validateSchema(ValidationUtils.getUnionSchema(clazz), clazz.getCanonicalName());
    VALIDATED.add(clazz);
  }

  private static boolean isValidMetadataField(RecordDataSchema.Field field) {
    return field.getName().equals("metadata") && !field.getOptional()
        && field.getType().getType() == DataSchema.Type.UNION && ValidationUtils.isUnionWithOnlyComplexMembers(
        (UnionDataSchema) field.getType());
  }
}
