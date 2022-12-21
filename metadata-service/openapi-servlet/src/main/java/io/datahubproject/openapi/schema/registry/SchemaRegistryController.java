package io.datahubproject.openapi.schema.registry;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedin.gms.factory.kafka.schemaregistry.InternalSchemaRegistryFactory;
import com.linkedin.metadata.schema.registry.SchemaRegistryService;
import io.datahubproject.schema_registry.openapi.generated.CompatibilityCheckResponse;
import io.datahubproject.schema_registry.openapi.generated.Config;
import io.datahubproject.schema_registry.openapi.generated.ConfigUpdateRequest;
import io.datahubproject.schema_registry.openapi.generated.Mode;
import io.datahubproject.schema_registry.openapi.generated.ModeUpdateRequest;
import io.datahubproject.schema_registry.openapi.generated.RegisterSchemaRequest;
import io.datahubproject.schema_registry.openapi.generated.RegisterSchemaResponse;
import io.datahubproject.schema_registry.openapi.generated.Schema;
import io.datahubproject.schema_registry.openapi.generated.SchemaString;
import io.datahubproject.schema_registry.openapi.generated.SubjectVersion;
import io.swagger.api.CompatibilityApi;
import io.swagger.api.ConfigApi;
import io.swagger.api.ContextsApi;
import io.swagger.api.DefaultApi;
import io.swagger.api.ModeApi;
import io.swagger.api.SchemasApi;
import io.swagger.api.SubjectsApi;
import io.swagger.api.V1Api;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * DataHub Rest Controller implementation for Confluent's Schema Registry OpenAPI spec.
 */
@Slf4j
@RestController
@RequestMapping("/schema-registry")
@RequiredArgsConstructor
@ConditionalOnProperty(name = "kafka.schemaRegistry.type", havingValue = InternalSchemaRegistryFactory.TYPE)
public class SchemaRegistryController
    implements CompatibilityApi, ConfigApi, ContextsApi, DefaultApi, ModeApi, SchemasApi, SubjectsApi, V1Api {

  private final ObjectMapper objectMapper;

  private final HttpServletRequest request;

  @Qualifier("schemaRegistryService")
  private final SchemaRegistryService _schemaRegistryService;

  @Override
  public Optional<ObjectMapper> getObjectMapper() {
    return Optional.ofNullable(objectMapper);
  }

  @Override
  public Optional<HttpServletRequest> getRequest() {
    return Optional.ofNullable(request);
  }

  @Override
  public ResponseEntity<RegisterSchemaResponse> register(String subject, RegisterSchemaRequest body,
      Boolean normalize) {
    final String topicName = subject.replaceFirst("-value", "");
    return _schemaRegistryService.getSchemaIdForTopic(topicName).map(id -> {
      final RegisterSchemaResponse response = new RegisterSchemaResponse();
      return new ResponseEntity<>(response.id(id), HttpStatus.OK);
    }).orElseGet(() -> {
      log.error("Couldn't find topic with name {}.", topicName);
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    });
  }

  @Override
  public Optional<String> getAcceptHeader() {
    return CompatibilityApi.super.getAcceptHeader();
  }

  @Override
  public ResponseEntity<Void> getClusterId() {
    return V1Api.super.getClusterId();
  }

  @Override
  public ResponseEntity<Void> getSchemaRegistryVersion() {
    return V1Api.super.getSchemaRegistryVersion();
  }

  @Override
  public ResponseEntity<Integer> deleteSchemaVersion(String subject, String version, Boolean permanent) {
    return SubjectsApi.super.deleteSchemaVersion(subject, version, permanent);
  }

  @Override
  public ResponseEntity<List<Integer>> deleteSubject(String subject, Boolean permanent) {
    return SubjectsApi.super.deleteSubject(subject, permanent);
  }

  @Override
  public ResponseEntity<List<Integer>> getReferencedBy(String subject, String version) {
    return SubjectsApi.super.getReferencedBy(subject, version);
  }

  @Override
  public ResponseEntity<Schema> getSchemaByVersion(String subject, String version, Boolean deleted) {
    return SubjectsApi.super.getSchemaByVersion(subject, version, deleted);
  }

  @Override
  public ResponseEntity<String> getSchemaOnly2(String subject, String version, Boolean deleted) {
    return SubjectsApi.super.getSchemaOnly2(subject, version, deleted);
  }

  @Override
  public ResponseEntity<List<String>> list(String subjectPrefix, Boolean deleted, Boolean deletedOnly) {
    return SubjectsApi.super.list(subjectPrefix, deleted, deletedOnly);
  }

  @Override
  public ResponseEntity<List<Integer>> listVersions(String subject, Boolean deleted, Boolean deletedOnly) {
    return SubjectsApi.super.listVersions(subject, deleted, deletedOnly);
  }

  @Override
  public ResponseEntity<Schema> lookUpSchemaUnderSubject(String subject, RegisterSchemaRequest body, Boolean normalize,
      Boolean deleted) {
    return SubjectsApi.super.lookUpSchemaUnderSubject(subject, body, normalize, deleted);
  }

  @Override
  public ResponseEntity<SchemaString> getSchema(Integer id, String subject, String format, Boolean fetchMaxId) {
    return _schemaRegistryService.getSchemaForId(id).map(schema -> {
      SchemaString result = new SchemaString();
      result.setMaxId(id);
      result.setSchemaType("AVRO");
      result.setSchema(schema.toString());
      return new ResponseEntity<>(result, HttpStatus.OK);
    }).orElseGet(() -> {
      log.error("Couldn't find topic with id {}.", id);
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    });
  }

  @Override
  public ResponseEntity<String> getSchemaOnly(Integer id, String subject, String format) {
    return SchemasApi.super.getSchemaOnly(id, subject, format);
  }

  @Override
  public ResponseEntity<List<String>> getSchemaTypes() {
    return SchemasApi.super.getSchemaTypes();
  }

  @Override
  public ResponseEntity<List<Schema>> getSchemas(String subjectPrefix, Boolean deleted, Boolean latestOnly,
      Integer offset, Integer limit) {
    return SchemasApi.super.getSchemas(subjectPrefix, deleted, latestOnly, offset, limit);
  }

  @Override
  public ResponseEntity<List<String>> getSubjects(Integer id, String subject, Boolean deleted) {
    return SchemasApi.super.getSubjects(id, subject, deleted);
  }

  @Override
  public ResponseEntity<List<SubjectVersion>> getVersions(Integer id, String subject, Boolean deleted) {
    return SchemasApi.super.getVersions(id, subject, deleted);
  }

  @Override
  public ResponseEntity<Mode> deleteSubjectMode(String subject) {
    return ModeApi.super.deleteSubjectMode(subject);
  }

  @Override
  public ResponseEntity<Mode> getMode(String subject, Boolean defaultToGlobal) {
    return ModeApi.super.getMode(subject, defaultToGlobal);
  }

  @Override
  public ResponseEntity<Mode> getTopLevelMode() {
    return ModeApi.super.getTopLevelMode();
  }

  @Override
  public ResponseEntity<ModeUpdateRequest> updateMode(String subject, ModeUpdateRequest body, Boolean force) {
    return ModeApi.super.updateMode(subject, body, force);
  }

  @Override
  public ResponseEntity<ModeUpdateRequest> updateTopLevelMode(ModeUpdateRequest body, Boolean force) {
    return ModeApi.super.updateTopLevelMode(body, force);
  }

  @Override
  public ResponseEntity<String> get() {
    return DefaultApi.super.get();
  }

  @Override
  public ResponseEntity<Map<String, String>> post(Map<String, String> body) {
    return DefaultApi.super.post(body);
  }

  @Override
  public ResponseEntity<List<String>> listContexts() {
    return ContextsApi.super.listContexts();
  }

  @Override
  public ResponseEntity<String> deleteSubjectConfig(String subject) {
    return ConfigApi.super.deleteSubjectConfig(subject);
  }

  @Override
  public ResponseEntity<String> deleteTopLevelConfig() {
    return ConfigApi.super.deleteTopLevelConfig();
  }

  @Override
  public ResponseEntity<Config> getSubjectLevelConfig(String subject, Boolean defaultToGlobal) {
    return ConfigApi.super.getSubjectLevelConfig(subject, defaultToGlobal);
  }

  @Override
  public ResponseEntity<Config> getTopLevelConfig() {
    return ConfigApi.super.getTopLevelConfig();
  }

  @Override
  public ResponseEntity<ConfigUpdateRequest> updateSubjectLevelConfig(String subject, ConfigUpdateRequest body) {
    return ConfigApi.super.updateSubjectLevelConfig(subject, body);
  }

  @Override
  public ResponseEntity<ConfigUpdateRequest> updateTopLevelConfig(ConfigUpdateRequest body) {
    return ConfigApi.super.updateTopLevelConfig(body);
  }

  @Override
  public ResponseEntity<CompatibilityCheckResponse> testCompatibilityBySubjectName(String subject, String version,
      RegisterSchemaRequest body, Boolean verbose) {
    return CompatibilityApi.super.testCompatibilityBySubjectName(subject, version, body, verbose);
  }

  @Override
  public ResponseEntity<CompatibilityCheckResponse> testCompatibilityForSubject(String subject,
      RegisterSchemaRequest body, Boolean verbose) {
    return CompatibilityApi.super.testCompatibilityForSubject(subject, body, verbose);
  }
}
