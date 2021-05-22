package com.linkedin.metadata.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.linkedin.common.urn.Urn;
import com.linkedin.data.template.RecordTemplate;
import com.linkedin.events.metadata.ChangeType;
import com.linkedin.metadata.ModelUtils;
import com.linkedin.metadata.EventUtils;
import com.linkedin.metadata.builders.search.BaseIndexBuilder;
import com.linkedin.metadata.builders.search.SnapshotProcessor;
import com.linkedin.metadata.dao.utils.RecordUtils;
import com.linkedin.metadata.extractor.FieldExtractor;
import com.linkedin.metadata.graph.Edge;
import com.linkedin.metadata.graph.GraphClient;
import com.linkedin.metadata.kafka.elasticsearch.ElasticsearchConnector;
import com.linkedin.metadata.kafka.elasticsearch.JsonElasticEvent;
import com.linkedin.metadata.models.EntitySpec;
import com.linkedin.metadata.models.RelationshipFieldSpec;
import com.linkedin.metadata.models.registry.SnapshotEntityRegistry;
import com.linkedin.metadata.query.CriterionArray;
import com.linkedin.metadata.query.Filter;
import com.linkedin.metadata.query.RelationshipDirection;
import com.linkedin.metadata.search.indexbuilder.IndexBuilder;
import com.linkedin.metadata.search.transformer.SearchDocumentTransformer;
import com.linkedin.metadata.utils.elasticsearch.IndexConvention;
import com.linkedin.mxe.MetadataAuditEvent;
import com.linkedin.mxe.Topics;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.apache.avro.generic.GenericRecord;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import static com.linkedin.metadata.dao.Neo4jUtil.createRelationshipFilter;


@Slf4j
@Component
@EnableKafka
public class MetadataAuditEventsProcessor {

  private RestHighLevelClient elasticSearchClient;
  private ElasticsearchConnector elasticSearchConnector;
  private SnapshotProcessor snapshotProcessor;

  private GraphClient _graphClient;

  private Set<BaseIndexBuilder<? extends RecordTemplate>> indexBuilders;
  private IndexConvention indexConvention;

  public MetadataAuditEventsProcessor(RestHighLevelClient elasticSearchClient,
      ElasticsearchConnector elasticSearchConnector, SnapshotProcessor snapshotProcessor, GraphClient graphClient,
      Set<BaseIndexBuilder<? extends RecordTemplate>> indexBuilders, IndexConvention indexConvention) {
    this.elasticSearchClient = elasticSearchClient;
    this.elasticSearchConnector = elasticSearchConnector;
    this.snapshotProcessor = snapshotProcessor;
    this._graphClient = graphClient;
    this.indexBuilders = indexBuilders;
    this.indexConvention = indexConvention;
    log.info("registered index builders {}", indexBuilders);
    for (EntitySpec entitySpec : SnapshotEntityRegistry.getInstance().getEntitySpecs()) {
      if (entitySpec.isSearchable() || entitySpec.isBrowsable()) {
        try {
          new IndexBuilder(elasticSearchClient, entitySpec, indexConvention.getIndexName(entitySpec)).buildIndex();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
  }

  @KafkaListener(id = "${KAFKA_CONSUMER_GROUP_ID:mae-consumer-job-client}", topics = "${KAFKA_TOPIC_NAME:"
      + Topics.METADATA_AUDIT_EVENT + "}", containerFactory = "avroSerializedKafkaListener")
  public void consume(final ConsumerRecord<String, GenericRecord> consumerRecord) {
    final GenericRecord record = consumerRecord.value();
    log.debug("Got MAE");

    try {
      final MetadataAuditEvent event = EventUtils.avroToPegasusMAE(record);
      if (event.hasNewSnapshot()) {
        final RecordTemplate snapshot = RecordUtils.getSelectedRecordTemplateFromUnion(event.getNewSnapshot());

        log.info(snapshot.toString());

        final EntitySpec entitySpec = SnapshotEntityRegistry.getInstance()
            .getEntitySpec(ModelUtils.getEntityNameFromSchema(snapshot.schema()));
        updateElasticsearch(snapshot, entitySpec);
        updateNeo4j(snapshot, entitySpec);
      }
    } catch (Exception e) {
      log.error("Error deserializing message: {}", e.toString());
      log.error("Message: {}", record.toString());
    }
  }

  /**
   * Process snapshot and update Neo4j
   *
   * @param snapshot Snapshot
   */
  private void updateNeo4j(final RecordTemplate snapshot, final EntitySpec entitySpec) {
    final Set<String> relationshipTypesBeingAdded = new HashSet<>();
    final List<Edge> edgesToAdd = new ArrayList<>();
    final String sourceUrnStr = snapshot.data().get("urn").toString();
    Urn sourceUrn;
    try {
      sourceUrn = Urn.createFromString(sourceUrnStr);
    } catch (URISyntaxException e) {
      log.info("Invalid source urn: {}", e.getLocalizedMessage());
      return;
    }

    Map<String, List<RelationshipFieldSpec>> relationshipFieldSpecsPerAspect = entitySpec.getAspectSpecMap()
        .entrySet()
        .stream()
        .collect(Collectors.toMap(Map.Entry::getKey, entry -> entry.getValue().getRelationshipFieldSpecs()));
    Map<RelationshipFieldSpec, List<Object>> extractedFields =
        FieldExtractor.extractFields(snapshot, relationshipFieldSpecsPerAspect);

    for (Map.Entry<RelationshipFieldSpec, List<Object>> entry : extractedFields.entrySet()) {
      relationshipTypesBeingAdded.add(entry.getKey().getRelationshipName());
      for (Object fieldValue : entry.getValue()) {
        try {
          edgesToAdd.add(new Edge(sourceUrn, Urn.createFromString(fieldValue.toString()),
              entry.getKey().getRelationshipName()));
        } catch (URISyntaxException e) {
          log.info("Invalid destination urn: {}", e.getLocalizedMessage());
        }
      }
    }
    if (edgesToAdd.size() > 0) {
      _graphClient.removeEdgeTypesFromNode(sourceUrn, new ArrayList<>(relationshipTypesBeingAdded),
          createRelationshipFilter(new Filter().setCriteria(new CriterionArray()), RelationshipDirection.OUTGOING));
      edgesToAdd.forEach(edge -> _graphClient.addEdge(edge));
    }
  }

  /**
   * Process snapshot and update Elasticsearch
   *
   * @param snapshot Snapshot
   */
  private void updateElasticsearch(final RecordTemplate snapshot, final EntitySpec entitySpec) {
    // If entity is not searchable nor browsable do not update ES
    if (!entitySpec.isSearchable() && !entitySpec.isBrowsable()) {
      return;
    }
    Optional<JsonNode> searchDocument;
    try {
      searchDocument = SearchDocumentTransformer.transform(snapshot, entitySpec);
    } catch (Exception e) {
      log.error("Error in getting documents from snapshot: {} for snapshot {}", e, snapshot);
      return;
    }

    if (!searchDocument.isPresent()) {
      return;
    }
    JsonElasticEvent elasticEvent = new JsonElasticEvent(searchDocument.get().toString());
    try {
      elasticEvent.setId(URLEncoder.encode(searchDocument.get().get("urn").asText(), "UTF-8"));
    } catch (UnsupportedEncodingException e) {
      log.error("Failed to encode the urn with error: {}", e.toString());
      return;
    }
    elasticEvent.setIndex(indexConvention.getIndexName(entitySpec));
    elasticEvent.setActionType(ChangeType.UPDATE);
    elasticSearchConnector.feedElasticEvent(elasticEvent);
  }
}
