package com.linkedin.metadata.entity.validation;

import com.linkedin.common.urn.Urn;
import com.linkedin.common.urn.UrnUtils;
import com.linkedin.data.schema.validation.ValidationResult;
import com.linkedin.data.template.RecordTemplate;
import com.linkedin.metadata.Constants;
import com.linkedin.metadata.aspect.AspectRetriever;
import com.linkedin.metadata.entity.EntityApiUtils;
import com.linkedin.metadata.models.AspectSpec;
import com.linkedin.metadata.models.EntitySpec;
import com.linkedin.metadata.models.registry.EntityRegistry;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ValidationApiUtils {
  public static final int URN_NUM_BYTES_LIMIT = 512;
  // Related to BrowsePathv2
  public static final String URN_DELIMITER_SEPARATOR = "␟";
  // https://datahubproject.io/docs/what/urn/#restrictions
  public static final Set<String> ILLEGAL_URN_COMPONENT_CHARACTERS = Set.of(":", "(", ")", ",");

  /**
   * Validates a {@link RecordTemplate} and throws {@link ValidationException} if validation fails.
   *
   * @param record record to be validated.
   */
  public static void validateOrThrow(RecordTemplate record) {
    RecordTemplateValidator.validate(
        record,
        validationResult -> {
          throw new ValidationException(
              String.format(
                  "Failed to validate record with class %s: %s",
                  record.getClass().getName(), validationResult.getMessages().toString()));
        });
  }

  public static void validateUrn(@Nonnull EntityRegistry entityRegistry, @Nonnull final Urn urn) {
    EntityRegistryUrnValidator validator = new EntityRegistryUrnValidator(entityRegistry);
    validator.setCurrentEntitySpec(entityRegistry.getEntitySpec(urn.getEntityType()));
    RecordTemplateValidator.validate(
        EntityApiUtils.buildKeyAspect(entityRegistry, urn),
        validationResult -> {
          throw new IllegalArgumentException(
              "Invalid urn: " + urn + "\n Cause: " + validationResult.getMessages());
        },
        validator);

    if (urn.toString().trim().length() != urn.toString().length()) {
      throw new IllegalArgumentException(
          "Error: cannot provide an URN with leading or trailing whitespace");
    }
    if (!Constants.SCHEMA_FIELD_ENTITY_NAME.equals(urn.getEntityType())
        && URLEncoder.encode(urn.toString()).length() > URN_NUM_BYTES_LIMIT) {
      throw new IllegalArgumentException(
          "Error: cannot provide an URN longer than "
              + Integer.toString(URN_NUM_BYTES_LIMIT)
              + " bytes (when URL encoded)");
    }

    if (urn.toString().contains(URN_DELIMITER_SEPARATOR)) {
      throw new IllegalArgumentException(
          "Error: URN cannot contain " + URN_DELIMITER_SEPARATOR + " character");
    }

    List<String> illegalComponents =
        urn.getEntityKey().getParts().stream()
            .flatMap(ValidationApiUtils::processUrnPartRecursively)
            .filter(
                urnPart -> ILLEGAL_URN_COMPONENT_CHARACTERS.stream().anyMatch(urnPart::contains))
            .collect(Collectors.toList());

    if (!illegalComponents.isEmpty()) {
      throw new IllegalArgumentException(
          String.format(
              "Illegal `%s` characters detected in URN %s component(s): %s",
              ILLEGAL_URN_COMPONENT_CHARACTERS, urn, illegalComponents));
    }

    try {
      Urn.createFromString(urn.toString());
    } catch (URISyntaxException e) {
      throw new IllegalArgumentException(e);
    }
  }

  /** Recursively process URN parts with URL decoding */
  private static Stream<String> processUrnPartRecursively(String urnPart) {
    String decodedPart = URLDecoder.decode(urnPart, StandardCharsets.UTF_8);
    if (decodedPart.startsWith("urn:li:")) {
      // Recursively process nested URN after decoding
      return UrnUtils.getUrn(decodedPart).getEntityKey().getParts().stream()
          .flatMap(ValidationApiUtils::processUrnPartRecursively);
    }
    return Stream.of(decodedPart);
  }

  /**
   * Validates a {@link RecordTemplate} and logs a warning if validation fails.
   *
   * @param record record to be validated.ailure.
   */
  public static void validateOrWarn(RecordTemplate record) {
    RecordTemplateValidator.validate(
        record,
        validationResult -> {
          log.warn(String.format("Failed to validate record %s against its schema.", record));
        });
  }

  public static AspectSpec validate(EntitySpec entitySpec, String aspectName) {
    if (aspectName == null || aspectName.isEmpty()) {
      throw new UnsupportedOperationException(
          "Aspect name is required for create and update operations");
    }

    AspectSpec aspectSpec = entitySpec.getAspectSpec(aspectName);

    if (aspectSpec == null) {
      throw new RuntimeException(
          String.format("Unknown aspect %s for entity %s", aspectName, entitySpec.getName()));
    }

    return aspectSpec;
  }

  public static void validateRecordTemplate(
      EntitySpec entitySpec,
      Urn urn,
      @Nullable RecordTemplate aspect,
      @Nonnull AspectRetriever aspectRetriever) {
    EntityRegistry entityRegistry = aspectRetriever.getEntityRegistry();
    EntityRegistryUrnValidator validator = new EntityRegistryUrnValidator(entityRegistry);
    validator.setCurrentEntitySpec(entitySpec);
    Consumer<ValidationResult> resultFunction =
        validationResult -> {
          throw new IllegalArgumentException(
              "Invalid format for aspect: "
                  + entitySpec.getName()
                  + "\n Cause: "
                  + validationResult.getMessages());
        };

    RecordTemplateValidator.validate(
        EntityApiUtils.buildKeyAspect(entityRegistry, urn), resultFunction, validator);

    if (aspect != null) {
      RecordTemplateValidator.validate(aspect, resultFunction, validator);
    }
  }
}
