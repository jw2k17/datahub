package com.linkedin.metadata.timeseries.elastic;

import static com.linkedin.metadata.Constants.*;

import com.codahale.metrics.Timer;
import com.datahub.util.RecordUtils;
import com.datahub.util.exception.ESQueryException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.StreamReadConstraints;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedin.common.urn.Urn;
import com.linkedin.data.ByteString;
import com.linkedin.metadata.aspect.EnvelopedAspect;
import com.linkedin.metadata.models.AspectSpec;
import com.linkedin.metadata.models.EntitySpec;
import com.linkedin.metadata.models.registry.EntityRegistry;
import com.linkedin.metadata.query.filter.Condition;
import com.linkedin.metadata.query.filter.Criterion;
import com.linkedin.metadata.query.filter.Filter;
import com.linkedin.metadata.query.filter.SortCriterion;
import com.linkedin.metadata.search.elasticsearch.indexbuilder.ReindexConfig;
import com.linkedin.metadata.search.elasticsearch.query.request.SearchAfterWrapper;
import com.linkedin.metadata.search.elasticsearch.update.ESBulkProcessor;
import com.linkedin.metadata.search.utils.ESUtils;
import com.linkedin.metadata.search.utils.QueryUtils;
import com.linkedin.metadata.shared.ElasticSearchIndexed;
import com.linkedin.metadata.timeseries.BatchWriteOperationsOptions;
import com.linkedin.metadata.timeseries.GenericTimeseriesDocument;
import com.linkedin.metadata.timeseries.TimeseriesAspectService;
import com.linkedin.metadata.timeseries.TimeseriesScrollResult;
import com.linkedin.metadata.timeseries.elastic.indexbuilder.MappingsBuilder;
import com.linkedin.metadata.timeseries.elastic.indexbuilder.TimeseriesAspectIndexBuilders;
import com.linkedin.metadata.timeseries.elastic.query.ESAggregatedStatsDAO;
import com.linkedin.metadata.utils.elasticsearch.IndexConvention;
import com.linkedin.metadata.utils.metrics.MetricUtils;
import com.linkedin.mxe.GenericAspect;
import com.linkedin.mxe.SystemMetadata;
import com.linkedin.structured.StructuredPropertyDefinition;
import com.linkedin.timeseries.AggregationSpec;
import com.linkedin.timeseries.DeleteAspectValuesResult;
import com.linkedin.timeseries.GenericTable;
import com.linkedin.timeseries.GroupingBucket;
import com.linkedin.timeseries.TimeseriesIndexSizeResult;
import com.linkedin.util.Pair;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import lombok.extern.slf4j.Slf4j;
import org.opensearch.action.search.SearchRequest;
import org.opensearch.action.search.SearchResponse;
import org.opensearch.action.update.UpdateRequest;
import org.opensearch.client.Request;
import org.opensearch.client.RequestOptions;
import org.opensearch.client.Response;
import org.opensearch.client.RestHighLevelClient;
import org.opensearch.client.core.CountRequest;
import org.opensearch.client.core.CountResponse;
import org.opensearch.client.tasks.TaskSubmissionResponse;
import org.opensearch.common.unit.TimeValue;
import org.opensearch.common.xcontent.XContentType;
import org.opensearch.index.query.BoolQueryBuilder;
import org.opensearch.index.query.QueryBuilder;
import org.opensearch.index.query.QueryBuilders;
import org.opensearch.search.SearchHit;
import org.opensearch.search.SearchHits;
import org.opensearch.search.builder.SearchSourceBuilder;
import org.opensearch.search.sort.SortBuilders;
import org.opensearch.search.sort.SortOrder;

@Slf4j
public class ElasticSearchTimeseriesAspectService
    implements TimeseriesAspectService, ElasticSearchIndexed {
  private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

  static {
    int maxSize =
        Integer.parseInt(
            System.getenv()
                .getOrDefault(INGESTION_MAX_SERIALIZED_STRING_LENGTH, MAX_JACKSON_STRING_SIZE));
    OBJECT_MAPPER
        .getFactory()
        .setStreamReadConstraints(StreamReadConstraints.builder().maxStringLength(maxSize).build());
  }

  private static final Integer DEFAULT_LIMIT = 10000;

  private final IndexConvention _indexConvention;
  private final ESBulkProcessor _bulkProcessor;
  private final int _numRetries;
  private final TimeseriesAspectIndexBuilders _indexBuilders;
  private final RestHighLevelClient _searchClient;
  private final ESAggregatedStatsDAO _esAggregatedStatsDAO;
  private final EntityRegistry _entityRegistry;

  public ElasticSearchTimeseriesAspectService(
      @Nonnull RestHighLevelClient searchClient,
      @Nonnull IndexConvention indexConvention,
      @Nonnull TimeseriesAspectIndexBuilders indexBuilders,
      @Nonnull EntityRegistry entityRegistry,
      @Nonnull ESBulkProcessor bulkProcessor,
      int numRetries) {
    _indexConvention = indexConvention;
    _indexBuilders = indexBuilders;
    _searchClient = searchClient;
    _bulkProcessor = bulkProcessor;
    _entityRegistry = entityRegistry;
    _numRetries = numRetries;

    _esAggregatedStatsDAO = new ESAggregatedStatsDAO(indexConvention, searchClient, entityRegistry);
  }

  private static EnvelopedAspect parseDocument(@Nonnull SearchHit doc) {
    Map<String, Object> docFields = doc.getSourceAsMap();
    EnvelopedAspect envelopedAspect = new EnvelopedAspect();
    Object event = docFields.get(MappingsBuilder.EVENT_FIELD);
    GenericAspect genericAspect;
    try {
      genericAspect =
          new GenericAspect()
              .setValue(
                  ByteString.unsafeWrap(
                      OBJECT_MAPPER.writeValueAsString(event).getBytes(StandardCharsets.UTF_8)));
    } catch (JsonProcessingException e) {
      throw new RuntimeException(
          "Failed to deserialize event from the timeseries aspect index: " + e);
    }
    genericAspect.setContentType("application/json");
    envelopedAspect.setAspect(genericAspect);
    Object systemMetadata = docFields.get("systemMetadata");
    if (systemMetadata != null) {
      try {
        envelopedAspect.setSystemMetadata(
            RecordUtils.toRecordTemplate(
                SystemMetadata.class, OBJECT_MAPPER.writeValueAsString(systemMetadata)));
      } catch (JsonProcessingException e) {
        throw new RuntimeException(
            "Failed to deserialize system metadata from the timeseries aspect index: " + e);
      }
    }

    return envelopedAspect;
  }

  private static Set<String> commonFields =
      Set.of(
          MappingsBuilder.URN_FIELD,
          MappingsBuilder.RUN_ID_FIELD,
          MappingsBuilder.EVENT_GRANULARITY,
          MappingsBuilder.IS_EXPLODED_FIELD,
          MappingsBuilder.MESSAGE_ID_FIELD,
          MappingsBuilder.PARTITION_SPEC_PARTITION,
          MappingsBuilder.PARTITION_SPEC,
          MappingsBuilder.SYSTEM_METADATA_FIELD,
          MappingsBuilder.TIMESTAMP_MILLIS_FIELD,
          MappingsBuilder.TIMESTAMP_FIELD,
          MappingsBuilder.EVENT_FIELD);

  private static Pair<EnvelopedAspect, GenericTimeseriesDocument> toEnvAspectGenericDocument(
      @Nonnull SearchHit doc) {
    EnvelopedAspect envelopedAspect = null;

    Map<String, Object> documentFieldMap = doc.getSourceAsMap();

    GenericTimeseriesDocument.GenericTimeseriesDocumentBuilder builder =
        GenericTimeseriesDocument.builder()
            .urn((String) documentFieldMap.get(MappingsBuilder.URN_FIELD))
            .timestampMillis((Long) documentFieldMap.get(MappingsBuilder.TIMESTAMP_MILLIS_FIELD))
            .timestamp((Long) documentFieldMap.get(MappingsBuilder.TIMESTAMP_FIELD));

    Optional.ofNullable(documentFieldMap.get(MappingsBuilder.RUN_ID_FIELD))
        .ifPresent(d -> builder.runId((String) d));
    Optional.ofNullable(documentFieldMap.get(MappingsBuilder.EVENT_GRANULARITY))
        .ifPresent(d -> builder.eventGranularity((String) d));
    Optional.ofNullable(documentFieldMap.get(MappingsBuilder.IS_EXPLODED_FIELD))
        .ifPresent(d -> builder.isExploded((Boolean) d));
    Optional.ofNullable(documentFieldMap.get(MappingsBuilder.MESSAGE_ID_FIELD))
        .ifPresent(d -> builder.messageId((String) d));
    Optional.ofNullable(documentFieldMap.get(MappingsBuilder.PARTITION_SPEC_PARTITION))
        .ifPresent(d -> builder.partition((String) d));
    Optional.ofNullable(documentFieldMap.get(MappingsBuilder.PARTITION_SPEC))
        .ifPresent(d -> builder.partitionSpec(d));
    Optional.ofNullable(documentFieldMap.get(MappingsBuilder.SYSTEM_METADATA_FIELD))
        .ifPresent(d -> builder.systemMetadata(d));

    if (documentFieldMap.get(MappingsBuilder.EVENT_FIELD) != null) {
      envelopedAspect = parseDocument(doc);
      builder.event(documentFieldMap.get(MappingsBuilder.EVENT_FIELD));
    } else {
      // If no event, the event is any non-common field
      builder.event(
          documentFieldMap.entrySet().stream()
              .filter(entry -> !commonFields.contains(entry.getKey()))
              .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)));
    }

    return Pair.of(envelopedAspect, builder.build());
  }

  @Override
  public void configure() {
    _indexBuilders.reindexAll();
  }

  @Override
  public List<ReindexConfig> buildReindexConfigs() {
    return _indexBuilders.buildReindexConfigs();
  }

  @Override
  public List<ReindexConfig> buildReindexConfigsWithAllStructProps(
      Collection<StructuredPropertyDefinition> properties) throws IOException {
    return _indexBuilders.buildReindexConfigsWithAllStructProps(properties);
  }

  public String reindexAsync(
      String index, @Nullable QueryBuilder filterQuery, BatchWriteOperationsOptions options)
      throws Exception {
    return _indexBuilders.reindexAsync(index, filterQuery, options);
  }

  @Override
  public void reindexAll() {
    configure();
  }

  @Override
  public void upsertDocument(
      @Nonnull String entityName,
      @Nonnull String aspectName,
      @Nonnull String docId,
      @Nonnull JsonNode document) {
    String indexName = _indexConvention.getTimeseriesAspectIndexName(entityName, aspectName);
    final UpdateRequest updateRequest =
        new UpdateRequest(indexName, docId)
            .detectNoop(false)
            .docAsUpsert(true)
            .doc(document.toString(), XContentType.JSON)
            .retryOnConflict(_numRetries);
    _bulkProcessor.add(updateRequest);
  }

  @Override
  public List<TimeseriesIndexSizeResult> getIndexSizes() {
    List<TimeseriesIndexSizeResult> res = new ArrayList<>();
    try {
      String indicesPattern = _indexConvention.getAllTimeseriesAspectIndicesPattern();
      Response r =
          _searchClient
              .getLowLevelClient()
              .performRequest(new Request("GET", "/" + indicesPattern + "/_stats"));
      JsonNode body = new ObjectMapper().readTree(r.getEntity().getContent());
      body.get("indices")
          .fields()
          .forEachRemaining(
              entry -> {
                TimeseriesIndexSizeResult elemResult = new TimeseriesIndexSizeResult();
                elemResult.setIndexName(entry.getKey());
                Optional<Pair<String, String>> indexEntityAndAspect =
                    _indexConvention.getEntityAndAspectName(entry.getKey());
                if (indexEntityAndAspect.isPresent()) {
                  elemResult.setEntityName(indexEntityAndAspect.get().getFirst());
                  elemResult.setAspectName(indexEntityAndAspect.get().getSecond());
                }
                long sizeBytes =
                    entry.getValue().get("primaries").get("store").get("size_in_bytes").asLong();
                double sizeMb = (double) sizeBytes / 1000000;
                elemResult.setSizeInMb(sizeMb);
                res.add(elemResult);
              });
      return res;
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public long countByFilter(
      @Nonnull final String entityName,
      @Nonnull final String aspectName,
      @Nullable final Filter filter) {
    final String indexName = _indexConvention.getTimeseriesAspectIndexName(entityName, aspectName);
    final BoolQueryBuilder filterQueryBuilder =
        QueryBuilders.boolQuery().must(ESUtils.buildFilterQuery(filter, true));
    CountRequest countRequest = new CountRequest();
    countRequest.query(filterQueryBuilder);
    countRequest.indices(indexName);
    try {
      CountResponse resp = _searchClient.count(countRequest, RequestOptions.DEFAULT);
      return resp.getCount();
    } catch (IOException e) {
      log.error("Count query failed:", e);
      throw new ESQueryException("Count query failed:", e);
    }
  }

  @Override
  public List<EnvelopedAspect> getAspectValues(
      @Nonnull final Urn urn,
      @Nonnull final String entityName,
      @Nonnull final String aspectName,
      @Nullable final Long startTimeMillis,
      @Nullable final Long endTimeMillis,
      @Nullable final Integer limit,
      @Nullable final Filter filter,
      @Nullable final SortCriterion sort) {
    final BoolQueryBuilder filterQueryBuilder =
        QueryBuilders.boolQuery().must(ESUtils.buildFilterQuery(filter, true));
    filterQueryBuilder.must(QueryBuilders.matchQuery("urn", urn.toString()));
    // NOTE: We are interested only in the un-exploded rows as only they carry the `event` payload.
    filterQueryBuilder.mustNot(QueryBuilders.termQuery(MappingsBuilder.IS_EXPLODED_FIELD, true));
    if (startTimeMillis != null) {
      Criterion startTimeCriterion =
          new Criterion()
              .setField(MappingsBuilder.TIMESTAMP_MILLIS_FIELD)
              .setCondition(Condition.GREATER_THAN_OR_EQUAL_TO)
              .setValue(startTimeMillis.toString());
      filterQueryBuilder.must(ESUtils.getQueryBuilderFromCriterion(startTimeCriterion, true));
    }
    if (endTimeMillis != null) {
      Criterion endTimeCriterion =
          new Criterion()
              .setField(MappingsBuilder.TIMESTAMP_MILLIS_FIELD)
              .setCondition(Condition.LESS_THAN_OR_EQUAL_TO)
              .setValue(endTimeMillis.toString());
      filterQueryBuilder.must(ESUtils.getQueryBuilderFromCriterion(endTimeCriterion, true));
    }
    final SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
    searchSourceBuilder.query(filterQueryBuilder);
    searchSourceBuilder.size(limit != null ? limit : DEFAULT_LIMIT);

    if (sort != null) {
      final SortOrder esSortOrder =
          (sort.getOrder() == com.linkedin.metadata.query.filter.SortOrder.ASCENDING)
              ? SortOrder.ASC
              : SortOrder.DESC;
      searchSourceBuilder.sort(SortBuilders.fieldSort(sort.getField()).order(esSortOrder));
    } else {
      // By default, sort by the timestampMillis descending.
      searchSourceBuilder.sort(SortBuilders.fieldSort("@timestamp").order(SortOrder.DESC));
    }

    final SearchRequest searchRequest = new SearchRequest();
    searchRequest.source(searchSourceBuilder);

    String indexName = _indexConvention.getTimeseriesAspectIndexName(entityName, aspectName);
    searchRequest.indices(indexName);

    log.debug("Search request is: " + searchRequest);
    SearchHits hits;
    try (Timer.Context ignored =
        MetricUtils.timer(this.getClass(), "searchAspectValues_search").time()) {
      final SearchResponse searchResponse =
          _searchClient.search(searchRequest, RequestOptions.DEFAULT);
      hits = searchResponse.getHits();
    } catch (Exception e) {
      log.error("Search query failed:", e);
      throw new ESQueryException("Search query failed:", e);
    }
    return Arrays.stream(hits.getHits())
        .map(ElasticSearchTimeseriesAspectService::parseDocument)
        .collect(Collectors.toList());
  }

  @Override
  @Nonnull
  public GenericTable getAggregatedStats(
      @Nonnull String entityName,
      @Nonnull String aspectName,
      @Nonnull AggregationSpec[] aggregationSpecs,
      @Nullable Filter filter,
      @Nullable GroupingBucket[] groupingBuckets) {
    return _esAggregatedStatsDAO.getAggregatedStats(
        entityName, aspectName, aggregationSpecs, filter, groupingBuckets);
  }

  /**
   * A generic delete by filter API which uses elasticsearch's deleteByQuery. NOTE: There is no need
   * for the client to explicitly walk each scroll page with this approach. Elastic will
   * synchronously delete all of the documents matching the query that is specified by the filter,
   * and internally handles the batching logic by the scroll page size specified(i.e. the
   * DEFAULT_LIMIT value of 10,000).
   *
   * @param entityName the name of the entity.
   * @param aspectName the name of the aspect.
   * @param filter the filter to be used for deletion of the documents on the index.
   * @return the number of documents returned.
   */
  @Nonnull
  @Override
  public DeleteAspectValuesResult deleteAspectValues(
      @Nonnull String entityName, @Nonnull String aspectName, @Nonnull Filter filter) {
    final String indexName = _indexConvention.getTimeseriesAspectIndexName(entityName, aspectName);
    final BoolQueryBuilder filterQueryBuilder = ESUtils.buildFilterQuery(filter, true);

    final Optional<DeleteAspectValuesResult> result =
        _bulkProcessor
            .deleteByQuery(
                filterQueryBuilder, false, DEFAULT_LIMIT, TimeValue.timeValueMinutes(10), indexName)
            .map(
                response ->
                    new DeleteAspectValuesResult().setNumDocsDeleted(response.getDeleted()));

    if (result.isPresent()) {
      return result.get();
    } else {
      log.error("Delete query failed");
      throw new ESQueryException("Delete query failed");
    }
  }

  @Nonnull
  @Override
  public String deleteAspectValuesAsync(
      @Nonnull String entityName,
      @Nonnull String aspectName,
      @Nonnull Filter filter,
      @Nonnull BatchWriteOperationsOptions options) {
    final String indexName = _indexConvention.getTimeseriesAspectIndexName(entityName, aspectName);
    final BoolQueryBuilder filterQueryBuilder = ESUtils.buildFilterQuery(filter, true);
    final int batchSize = options.getBatchSize() > 0 ? options.getBatchSize() : DEFAULT_LIMIT;
    TimeValue timeout =
        options.getTimeoutSeconds() > 0
            ? TimeValue.timeValueSeconds(options.getTimeoutSeconds())
            : null;
    final Optional<TaskSubmissionResponse> result =
        _bulkProcessor.deleteByQueryAsync(filterQueryBuilder, false, batchSize, timeout, indexName);

    if (result.isPresent()) {
      return result.get().getTask();
    } else {
      log.error("Async delete query failed");
      throw new ESQueryException("Async delete query failed");
    }
  }

  @Override
  public String reindexAsync(
      @Nonnull String entityName,
      @Nonnull String aspectName,
      @Nonnull Filter filter,
      @Nonnull BatchWriteOperationsOptions options) {
    final String indexName = _indexConvention.getTimeseriesAspectIndexName(entityName, aspectName);
    final BoolQueryBuilder filterQueryBuilder = ESUtils.buildFilterQuery(filter, true);
    try {
      return this.reindexAsync(indexName, filterQueryBuilder, options);
    } catch (Exception e) {
      log.error("Async reindex failed");
      throw new ESQueryException("Async reindex failed", e);
    }
  }

  @Nonnull
  @Override
  public DeleteAspectValuesResult rollbackTimeseriesAspects(@Nonnull String runId) {
    DeleteAspectValuesResult rollbackResult = new DeleteAspectValuesResult();
    // Construct the runId filter for deletion.
    Filter filter = QueryUtils.newFilter("runId", runId);

    // Delete the timeseries aspects across all entities with the runId.
    for (Map.Entry<String, EntitySpec> entry : _entityRegistry.getEntitySpecs().entrySet()) {
      for (AspectSpec aspectSpec : entry.getValue().getAspectSpecs()) {
        if (aspectSpec.isTimeseries()) {
          DeleteAspectValuesResult result =
              this.deleteAspectValues(entry.getKey(), aspectSpec.getName(), filter);
          rollbackResult.setNumDocsDeleted(
              rollbackResult.getNumDocsDeleted() + result.getNumDocsDeleted());
          log.info(
              "Number of timeseries docs deleted for entity:{}, aspect:{}, runId:{}={}",
              entry.getKey(),
              aspectSpec.getName(),
              runId,
              result.getNumDocsDeleted());
        }
      }
    }

    return rollbackResult;
  }

  @Nonnull
  @Override
  public TimeseriesScrollResult scrollAspects(
      @Nonnull String entityName,
      @Nonnull String aspectName,
      @Nullable Filter filter,
      @Nonnull List<SortCriterion> sortCriterion,
      @Nullable String scrollId,
      int count,
      @Nullable Long startTimeMillis,
      @Nullable Long endTimeMillis) {
    final BoolQueryBuilder filterQueryBuilder =
        QueryBuilders.boolQuery().filter(ESUtils.buildFilterQuery(filter, true));

    if (startTimeMillis != null) {
      Criterion startTimeCriterion =
          new Criterion()
              .setField(MappingsBuilder.TIMESTAMP_MILLIS_FIELD)
              .setCondition(Condition.GREATER_THAN_OR_EQUAL_TO)
              .setValue(startTimeMillis.toString());
      filterQueryBuilder.filter(ESUtils.getQueryBuilderFromCriterion(startTimeCriterion, true));
    }
    if (endTimeMillis != null) {
      Criterion endTimeCriterion =
          new Criterion()
              .setField(MappingsBuilder.TIMESTAMP_MILLIS_FIELD)
              .setCondition(Condition.LESS_THAN_OR_EQUAL_TO)
              .setValue(endTimeMillis.toString());
      filterQueryBuilder.filter(ESUtils.getQueryBuilderFromCriterion(endTimeCriterion, true));
    }

    SearchResponse response =
        executeScrollSearchQuery(
            entityName, aspectName, filterQueryBuilder, sortCriterion, scrollId, count);
    int totalCount = (int) response.getHits().getTotalHits().value;

    List<Pair<EnvelopedAspect, GenericTimeseriesDocument>> resultPairs =
        Arrays.stream(response.getHits().getHits())
            .map(ElasticSearchTimeseriesAspectService::toEnvAspectGenericDocument)
            .collect(Collectors.toList());

    return TimeseriesScrollResult.builder()
        .numResults(totalCount)
        .pageSize(response.getHits().getHits().length)
        .events(resultPairs.stream().map(Pair::getFirst).collect(Collectors.toList()))
        .documents(resultPairs.stream().map(Pair::getSecond).collect(Collectors.toList()))
        .build();
  }

  private SearchResponse executeScrollSearchQuery(
      @Nonnull final String entityNname,
      @Nonnull final String aspectName,
      @Nonnull final QueryBuilder query,
      @Nonnull List<SortCriterion> sortCriterion,
      @Nullable String scrollId,
      final int count) {

    Object[] sort = null;
    if (scrollId != null) {
      SearchAfterWrapper searchAfterWrapper = SearchAfterWrapper.fromScrollId(scrollId);
      sort = searchAfterWrapper.getSort();
    }

    SearchRequest searchRequest = new SearchRequest();

    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

    searchSourceBuilder.size(count);
    searchSourceBuilder.query(query);
    ESUtils.buildSortOrder(searchSourceBuilder, sortCriterion, List.of(), false);
    searchRequest.source(searchSourceBuilder);
    ESUtils.setSearchAfter(searchSourceBuilder, sort, null, null);

    searchRequest.indices(_indexConvention.getTimeseriesAspectIndexName(entityNname, aspectName));

    try (Timer.Context ignored =
        MetricUtils.timer(this.getClass(), "scrollAspects_search").time()) {
      return _searchClient.search(searchRequest, RequestOptions.DEFAULT);
    } catch (Exception e) {
      log.error("Search query failed", e);
      throw new ESQueryException("Search query failed:", e);
    }
  }
}
