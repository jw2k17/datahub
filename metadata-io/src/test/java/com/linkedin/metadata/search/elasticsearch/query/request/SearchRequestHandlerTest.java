package com.linkedin.metadata.search.elasticsearch.query.request;

import com.google.common.collect.ImmutableList;
import com.linkedin.metadata.TestEntitySpecBuilder;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.linkedin.metadata.query.filter.Condition;
import com.linkedin.metadata.query.filter.ConjunctiveCriterion;
import com.linkedin.metadata.query.filter.ConjunctiveCriterionArray;
import com.linkedin.metadata.query.filter.Criterion;
import com.linkedin.metadata.query.filter.CriterionArray;
import com.linkedin.metadata.query.filter.Filter;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.testng.annotations.Test;

import static org.testng.Assert.*;


public class SearchRequestHandlerTest {
  @Test
  public void testSearchRequestHandler() {
    SearchRequestHandler requestHandler = SearchRequestHandler.getBuilder(TestEntitySpecBuilder.getSpec());
    SearchRequest searchRequest = requestHandler.getSearchRequest("testQuery", null, null, 0,
            10, false);
    SearchSourceBuilder sourceBuilder = searchRequest.source();
    assertEquals(sourceBuilder.from(), 0);
    assertEquals(sourceBuilder.size(), 10);
    // Filters
    Optional<AggregationBuilder> aggregationBuilder =
        sourceBuilder.aggregations().getAggregatorFactories().stream().findFirst();
    assertTrue(aggregationBuilder.isPresent());
    TermsAggregationBuilder filterPanelBuilder = (TermsAggregationBuilder) aggregationBuilder.get();
    assertEquals(filterPanelBuilder.field(), "textFieldOverride.keyword");
    // Highlights
    HighlightBuilder highlightBuilder = sourceBuilder.highlighter();
    List<String> fields =
        highlightBuilder.fields().stream().map(HighlightBuilder.Field::name).collect(Collectors.toList());
    assertEquals(fields.size(), 27);
    List<String> highlightableFields =
        ImmutableList.of("keyPart1", "textArrayField", "textFieldOverride", "foreignKey", "nestedForeignKey",
                "nestedArrayStringField", "nestedArrayArrayField", "customProperties", "esObjectField", "keyPart2",
                "nestedArrayForeignKey", "foreignKeyArray");
    highlightableFields.forEach(field -> {
      assertTrue(fields.contains(field));
      assertTrue(fields.contains(field + ".*"));
    });
  }

  @Test
  public void testFilteredSearch() {

    final SearchRequestHandler requestHandler = SearchRequestHandler.getBuilder(TestEntitySpecBuilder.getSpec());

    final BoolQueryBuilder testQuery = constructFilterQuery(requestHandler,false);

    testFilterQuery(testQuery);

    final BoolQueryBuilder queryWithRemoved = constructRemovedQuery(requestHandler, false);

    testRemovedQuery(queryWithRemoved);


    final BoolQueryBuilder testQueryScroll = constructFilterQuery(requestHandler,true);

    testFilterQuery(testQueryScroll);

    final BoolQueryBuilder queryWithRemovedScroll = constructRemovedQuery(requestHandler, true);

    testRemovedQuery(queryWithRemovedScroll);
  }

  private BoolQueryBuilder constructFilterQuery(SearchRequestHandler requestHandler, boolean scroll) {
    final Criterion filterCriterion =  new Criterion()
        .setField("keyword")
        .setCondition(Condition.EQUAL)
        .setValue("some value");

    final Filter filterWithoutRemovedCondition = new Filter().setOr(
        new ConjunctiveCriterionArray(
            new ConjunctiveCriterion().setAnd(
                new CriterionArray(ImmutableList.of(filterCriterion)))
        ));

    final BoolQueryBuilder testQuery;
    if (scroll) {
      testQuery = (BoolQueryBuilder) requestHandler
          .getSearchRequest("testQuery", filterWithoutRemovedCondition, null, null, null,
              "5m", 10, false)
          .source()
          .query();
    } else {
      testQuery =
          (BoolQueryBuilder) requestHandler.getSearchRequest("testQuery", filterWithoutRemovedCondition, null,
              0, 10, false).source().query();
    }
    return testQuery;
  }

  private void testFilterQuery(BoolQueryBuilder testQuery) {
    Optional<MatchQueryBuilder> mustNotHaveRemovedCondition = testQuery.must()
        .stream()
        .filter(or -> or instanceof BoolQueryBuilder)
        .map(or -> (BoolQueryBuilder) or)
        .flatMap(or -> {
          System.out.println("processing: " + or.mustNot());
          return or.mustNot().stream();
        })
        .filter(and -> and instanceof MatchQueryBuilder)
        .map(and -> (MatchQueryBuilder) and)
        .filter(match -> match.fieldName().equals("removed"))
        .findAny();

    assertTrue(mustNotHaveRemovedCondition.isPresent(), "Expected must not have removed condition to exist"
        + " if filter does not have it");
  }

  private BoolQueryBuilder constructRemovedQuery(SearchRequestHandler requestHandler, boolean scroll) {
    final Criterion filterCriterion =  new Criterion()
        .setField("keyword")
        .setCondition(Condition.EQUAL)
        .setValue("some value");

    final Criterion removedCriterion =  new Criterion()
        .setField("removed")
        .setCondition(Condition.EQUAL)
        .setValue(String.valueOf(false));

    final Filter filterWithRemovedCondition = new Filter().setOr(
        new ConjunctiveCriterionArray(
            new ConjunctiveCriterion().setAnd(
                new CriterionArray(ImmutableList.of(filterCriterion, removedCriterion)))
        ));

    final BoolQueryBuilder queryWithRemoved;
    if (scroll) {
      queryWithRemoved = (BoolQueryBuilder) requestHandler.getSearchRequest("testQuery", filterWithRemovedCondition,
          null, null, null, "5m", 10, false).source().query();
    } else {
      queryWithRemoved =
          (BoolQueryBuilder) requestHandler.getSearchRequest("testQuery", filterWithRemovedCondition,
              null, 0, 10, false).source().query();
    }
    return queryWithRemoved;
  }

  private void testRemovedQuery(BoolQueryBuilder queryWithRemoved) {
    Optional<MatchQueryBuilder> mustNotHaveRemovedCondition = queryWithRemoved.must()
        .stream()
        .filter(or -> or instanceof BoolQueryBuilder)
        .map(or -> (BoolQueryBuilder) or)
        .flatMap(or -> {
          System.out.println("processing: " + or.mustNot());
          return or.mustNot().stream();
        })
        .filter(and -> and instanceof MatchQueryBuilder)
        .map(and -> (MatchQueryBuilder) and)
        .filter(match -> match.fieldName().equals("removed"))
        .findAny();

    assertFalse(mustNotHaveRemovedCondition.isPresent(), "Expect `must not have removed` condition to not"
        + " exist because filter already has it a condition for the removed property");
  }
}
