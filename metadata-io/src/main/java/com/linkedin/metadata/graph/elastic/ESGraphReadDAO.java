package com.linkedin.metadata.graph.elastic;

import com.linkedin.metadata.query.Condition;
import com.linkedin.metadata.query.CriterionArray;
import com.linkedin.metadata.query.Filter;
import com.linkedin.metadata.query.RelationshipDirection;
import com.linkedin.metadata.query.RelationshipFilter;
import com.linkedin.metadata.utils.elasticsearch.IndexConvention;
import java.io.IOException;
import java.util.List;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import static com.linkedin.metadata.graph.elastic.ElasticSearchGraphService.*;


/**
 * A search DAO for Elasticsearch backend.
 */
@Slf4j
@RequiredArgsConstructor
public class ESGraphReadDAO {

  private final RestHighLevelClient client;
  private final IndexConvention indexConvention;

  /**
   * Converts {@link CriterionArray} to neo4j query string.
   *
   * @param criterionArray CriterionArray in a Filter
   * @return Neo4j criteria string
   */
  @Nonnull
  public static void addCriterionToQueryBuilder(@Nonnull CriterionArray criterionArray, String node, BoolQueryBuilder finalQuery) {
    if (!criterionArray.stream().allMatch(criterion -> Condition.EQUAL.equals(criterion.getCondition()))) {
      throw new RuntimeException("Currently Elastic query filter only supports EQUAL condition " + criterionArray);
    }

    criterionArray.forEach(
        criterion -> finalQuery.must(
            QueryBuilders.termQuery(node + "." + criterion.getField(), criterion.getValue())
        )
    );
  }

  public SearchResponse getSearchResponse(
      @Nullable final String sourceType,
      @Nonnull  final Filter sourceEntityFilter,
      @Nullable final String destinationType,
      @Nonnull final Filter destinationEntityFilter,
      @Nonnull final List<String> relationshipTypes,
      @Nonnull final RelationshipFilter relationshipFilter,
      final int offset,
      final int count) {
    // also delete any relationship going to or from it
    final RelationshipDirection relationshipDirection = relationshipFilter.getDirection();

    SearchRequest searchRequest = new SearchRequest();

    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

    searchSourceBuilder.from(offset);
    searchSourceBuilder.size(count);

    BoolQueryBuilder finalQuery = QueryBuilders.boolQuery();

    // set source filter
    String sourceNode = relationshipDirection == RelationshipDirection.OUTGOING ? "source" : "destination";
    if (sourceType != null && sourceType.length() > 0) {
      finalQuery.must(QueryBuilders.termQuery(sourceNode + ".entityType", sourceType));
    }
    addCriterionToQueryBuilder(sourceEntityFilter.getCriteria(), sourceNode, finalQuery);

    // set destination filter
    String destinationNode = relationshipDirection == RelationshipDirection.OUTGOING ? "destination" : "source";
    if (destinationType != null && destinationType.length() > 0) {
      finalQuery.must(QueryBuilders.termQuery(destinationNode + ".entityType", destinationType));
    }
    addCriterionToQueryBuilder(destinationEntityFilter.getCriteria(), destinationNode, finalQuery);

    // set relationship filter
    if (relationshipTypes.size() > 0) {
      BoolQueryBuilder relationshipQuery = QueryBuilders.boolQuery();
      relationshipTypes.forEach(relationshipType
          -> relationshipQuery.should(QueryBuilders.termQuery("relationshipType", relationshipType)));
      finalQuery.must(relationshipQuery);
    }

    searchSourceBuilder.query(finalQuery);

    searchRequest.source(searchSourceBuilder);

    searchRequest.indices(indexConvention.getIndexName(INDEX_NAME));

    try {
      final SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
      return searchResponse;
    } catch (IOException e) {
      e.printStackTrace();
    }
    return null;
  }
}
