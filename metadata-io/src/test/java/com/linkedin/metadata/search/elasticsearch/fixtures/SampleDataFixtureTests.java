package com.linkedin.metadata.search.elasticsearch.fixtures;

import com.google.common.collect.ImmutableMap;
import com.linkedin.common.urn.Urn;
import com.linkedin.datahub.graphql.generated.AutoCompleteResults;
import com.linkedin.datahub.graphql.types.chart.ChartType;
import com.linkedin.entity.client.EntityClient;
import com.linkedin.metadata.ESSampleDataFixture;
import com.linkedin.metadata.search.SearchEntity;
import com.linkedin.metadata.search.SearchResult;
import com.linkedin.metadata.search.SearchService;
import java.util.HashMap;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.AnalyzeRequest;
import org.elasticsearch.client.indices.AnalyzeResponse;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.annotations.Test;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.linkedin.metadata.ESTestUtils.autocomplete;
import static com.linkedin.metadata.ESTestUtils.search;
import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;
import static org.testng.Assert.assertNotNull;


@Import(ESSampleDataFixture.class)
public class SampleDataFixtureTests extends AbstractTestNGSpringContextTests {

    @Autowired
    private RestHighLevelClient _searchClient;

    @Autowired
    @Qualifier("sampleDataSearchService")
    protected SearchService searchService;

    @Autowired
    @Qualifier("sampleDataEntityClient")
    protected EntityClient entityClient;

    @Test
    public void testFixtureInitialization() {
        assertNotNull(searchService);
        SearchResult noResult = search(searchService, "no results");
        assertEquals(0, noResult.getEntities().size());

        final SearchResult result = search(searchService, "test");

        // TODO: Add tags fields to query
        Map<String, Integer> expectedTypes = Map.of(
                "dataset", 8,
                "chart", 0,
                "container", 0,
                "dashboard", 0,
                "tag", 0,
                "mlmodel", 0
        );

        Map<String, List<Urn>> actualTypes = new HashMap<>();
        for (String key : expectedTypes.keySet()) {
            actualTypes.put(key, result.getEntities().stream()
                .map(SearchEntity::getEntity).filter(entity -> key.equals(entity.getEntityType())).collect(Collectors.toList()));
        }

        expectedTypes.forEach((key, value) ->
                assertEquals(actualTypes.get(key).size(), value.intValue(),
                        String.format("Expected entity `%s` matches for %s. Found %s", value, key,
                                result.getEntities().stream()
                                        .filter(e -> e.getEntity().getEntityType().equals(key))
                                        .map(e -> e.getEntity().getEntityKey())
                                        .collect(Collectors.toList()))));
    }

    @Test
    public void testDataPlatform() {
        Map<String, Integer> expected = ImmutableMap.<String, Integer>builder()
                .put("urn:li:dataPlatform:BigQuery", 8)
                .put("urn:li:dataPlatform:hive", 3)
                .put("urn:li:dataPlatform:mysql", 5)
                .put("urn:li:dataPlatform:s3", 1)
                .put("urn:li:dataPlatform:hdfs", 1)
                .put("urn:li:dataPlatform:graph", 1)
                .put("urn:li:dataPlatform:dbt", 9)
                .put("urn:li:dataplatform:BigQuery", 8)
                .put("urn:li:dataplatform:hive", 3)
                .put("urn:li:dataplatform:mysql", 5)
                .put("urn:li:dataplatform:s3", 1)
                .put("urn:li:dataplatform:hdfs", 1)
                .put("urn:li:dataplatform:graph", 1)
                .put("urn:li:dataplatform:dbt", 9)
                .build();

        expected.forEach((key, value) -> {
            SearchResult result = search(searchService, key);
            assertEquals(result.getEntities().size(), value.intValue(),
                    String.format("Unexpected data platform `%s` hits.", key)); // max is 100 without pagination
        });
    }

    @Test
    public void testUrn() {
        List.of(
                "urn:li:dataset:(urn:li:dataPlatform:bigquery,harshal-playground-306419.test_schema.austin311_derived,PROD)",
                "urn:li:dataset:(urn:li:dataPlatform:graph,graph-test,PROD)",
                "urn:li:chart:(looker,baz1)",
                "urn:li:dashboard:(looker,baz)",
                "urn:li:mlFeature:(test_feature_table_all_feature_dtypes,test_BOOL_LIST_feature)",
                "urn:li:mlModel:(urn:li:dataPlatform:science,scienceModel,PROD)"
        ).forEach(query ->
            assertEquals(search(searchService, query).getEntities().size(), 1,
                    String.format("Unexpected single urn result for `%s`", query))
        );
    }

    @Test
    public void testExactTable() {
        SearchResult results = search(searchService, "stg_customers");
        assertEquals(results.getEntities().size(), 1, "Unexpected single urn result for `stg_customers`");
        assertEquals(results.getEntities().get(0).getEntity().toString(),
                "urn:li:dataset:(urn:li:dataPlatform:dbt,cypress_project.jaffle_shop.stg_customers,PROD)");
    }

    @Test
    public void testStemming() {
        List<Set<String>> testSets = List.of(
                Set.of("log", "logs", "logging"),
                Set.of("border", "borders", "bordered", "bordering"),
                Set.of("indicates", "indicate", "indicated")
        );

        testSets.forEach(testSet -> {
            Set<SearchResult> results = testSet.stream()
                    .map(test -> search(searchService, test))
                    .collect(Collectors.toSet());

            results.forEach(r -> assertTrue(r.hasEntities(), "Expected search results"));
            assertEquals(results.stream().map(r -> r.getEntities().size()).distinct().count(), 1,
                    String.format("Expected all result counts to match after stemming. %s", testSet));
        });
    }

    @Test
    public void testStemmingOverride() throws IOException {
        Set<String> testSet = Set.of("customer", "customers");

        Set<SearchResult> results = testSet.stream()
                .map(test -> search(searchService, test))
                .collect(Collectors.toSet());

        results.forEach(r -> assertTrue(r.hasEntities(), "Expected search results"));
        assertEquals(results.stream().map(r -> r.getEntities().size()).distinct().count(), 1,
                String.format("Expected all result counts to match after stemming. %s", testSet));

        // Additional inspect token
        AnalyzeRequest request = AnalyzeRequest.withIndexAnalyzer(
                "smpldat_datasetindex_v2",
                "word_delimited",
                "customers"
        );

        List<String> tokens = getTokens(request).map(AnalyzeResponse.AnalyzeToken::getTerm).collect(Collectors.toList());
        assertEquals(tokens, List.of("customer"), "Expected `customer` and not `custom`");
    }

    @Test
    public void testDelimitedSynonym() throws IOException {
        List<String> expectedTokens = List.of("cac", "customer", "acquisit", "cost");

        AnalyzeRequest request = AnalyzeRequest.withIndexAnalyzer(
                "smpldat_datasetindex_v2",
                "word_delimited",
                "mydatabase.myschema.cac_table"
        );
        List<String> indexTokens = getTokens(request).map(AnalyzeResponse.AnalyzeToken::getTerm).collect(Collectors.toList());
        // synonyms expected at query time
        expectedTokens.forEach(expected -> assertTrue(indexTokens.contains(expected),
                        String.format("Expected token `%s` in %s", expected, indexTokens)));

        request = AnalyzeRequest.withIndexAnalyzer(
                "smpldat_datasetindex_v2",
                "query_word_delimited",
                "customer acquisition cost"
        );
        List<String> searchTokens = getTokens(request).map(AnalyzeResponse.AnalyzeToken::getTerm).collect(Collectors.toList());
        expectedTokens.forEach(expected -> assertTrue(searchTokens.contains(expected),
                String.format("Expected token `%s` in %s", expected, searchTokens)));

        // {"urn":"urn:li:dataset:(urn:li:dataPlatform:test_synonym,cac_table,TEST)","id":"cac_table",...
        List<String> testSet = List.of(
                "cac",
                "customer acquisition cost"
        );
        List<SearchResult> results = testSet.stream()
                .map(test -> search(searchService, test))
                .collect(Collectors.toList());

        results.forEach(r -> assertTrue(r.hasEntities(), "Expected search results"));

        List<Integer> resultCounts = results.stream().map(r -> r.getEntities().size()).collect(Collectors.toList());
        assertEquals(resultCounts.stream().distinct().count(), 1,
                String.format("Expected all result counts (%s) to match after synonyms. %s", resultCounts, testSet));
    }

    @Test
    public void testUrnSynonym() throws IOException {
        List<String> expectedTokens = List.of("bigqueri", "big", "queri");

        AnalyzeRequest request = AnalyzeRequest.withIndexAnalyzer(
                "smpldat_datasetindex_v2",
                "urn_component",
                "urn:li:dataset:(urn:li:dataPlatform:bigquery,harshal-playground-306419.bq_audit.cloudaudit_googleapis_com_activity,PROD)"
        );
        List<String> indexTokens = getTokens(request).map(AnalyzeResponse.AnalyzeToken::getTerm).collect(Collectors.toList());
        expectedTokens.forEach(expected -> assertTrue(indexTokens.contains(expected),
                String.format("Expected token `%s` in %s", expected, indexTokens)));

        request = AnalyzeRequest.withIndexAnalyzer(
                "smpldat_datasetindex_v2",
                "query_urn_component",
                "big query"
        );
        List<String> searchTokens = getTokens(request).map(AnalyzeResponse.AnalyzeToken::getTerm).collect(Collectors.toList());
        expectedTokens.forEach(expected -> assertTrue(searchTokens.contains(expected),
                String.format("Expected token `%s` in %s", expected, searchTokens)));

        List<String> testSet = List.of(
                "big query",
                "bigquery"
        );
        List<SearchResult> results = testSet.stream()
                .map(test -> search(searchService, test))
                .collect(Collectors.toList());

        results.forEach(r -> assertTrue(r.hasEntities(), "Expected search results"));

        Assert.assertArrayEquals(results.get(0).getEntities().stream().map(e -> e.getEntity().toString()).sorted().toArray(String[]::new),
                results.get(1).getEntities().stream().map(e -> e.getEntity().toString()).sorted().toArray(String[]::new));

        List<Integer> resultCounts = results.stream().map(r -> r.getEntities().size()).collect(Collectors.toList());
        assertEquals(resultCounts.stream().distinct().count(), 1,
                String.format("Expected all result counts (%s) to match after synonyms. %s", resultCounts, testSet));
    }

    @Test
    public void testTokenization() throws IOException {
        AnalyzeRequest request = AnalyzeRequest.withIndexAnalyzer(
                "smpldat_datasetindex_v2",
                "word_delimited",
                "my_table"
        );
        List<String> tokens = getTokens(request).map(AnalyzeResponse.AnalyzeToken::getTerm).collect(Collectors.toList());
        assertEquals(tokens, List.of("my_tabl", "my", "tabl"),
                String.format("Unexpected tokens. Found %s", tokens));

        request = AnalyzeRequest.withIndexAnalyzer(
                "smpldat_datasetindex_v2",
                "urn_component",
                "my_table"
        );
        tokens = getTokens(request).map(AnalyzeResponse.AnalyzeToken::getTerm).collect(Collectors.toList());
        assertEquals(tokens, List.of("my_tabl", "my", "tabl"),
                String.format("Unexpected tokens. Found %s", tokens));
    }

    @Test
    public void testTokenizationWithNumber() throws IOException {
        AnalyzeRequest request = AnalyzeRequest.withIndexAnalyzer(
                "smpldat_datasetindex_v2",
                "word_delimited",
                "harshal-playground-306419.test_schema.austin311_derived"
        );
        List<String> tokens = getTokens(request).map(AnalyzeResponse.AnalyzeToken::getTerm).collect(Collectors.toList());
        assertEquals(tokens, List.of(
                "harshal-playground-306419", "harshal", "playground", "306419",
                 "test_schema", "test", "schema",
                 "austin311_deriv", "austin311", "deriv"),
                String.format("Unexpected tokens. Found %s", tokens));

        request = AnalyzeRequest.withIndexAnalyzer(
                "smpldat_datasetindex_v2",
                "urn_component",
                "harshal-playground-306419.test_schema.austin311_derived"
        );
        tokens = getTokens(request).map(AnalyzeResponse.AnalyzeToken::getTerm).collect(Collectors.toList());
        assertEquals(tokens, List.of(
                        "harshal-playground-306419", "harshal", "playground", "306419",
                        "test_schema", "test", "schema",
                        "austin311_deriv", "austin311", "deriv"),
                String.format("Unexpected tokens. Found %s", tokens));
    }

    @Test
    public void testTokenizationDataPlatform() throws IOException {
        AnalyzeRequest request = AnalyzeRequest.withIndexAnalyzer(
                "smpldat_datasetindex_v2",
                "urn_component",
                "urn:li:dataset:(urn:li:dataPlatform:bigquery,harshal-playground-306419.test_schema.excess_deaths_derived,PROD)"
        );
        List<String> tokens = getTokens(request).map(AnalyzeResponse.AnalyzeToken::getTerm).collect(Collectors.toList());
        assertEquals(tokens, List.of(
                        "urn:li:dataset", "dataset",
                        "urn:li:dataplatform:bigqueri", "data", "platform", "big",  "bigqueri", "queri", "dataplatform",
                        "harshal-playground-306419", "harshal", "playground", "306419",
                        "test_schema", "test", "schema",
                        "excess_deaths_deriv", "excess", "death", "deriv",
                        "prod", "production"),
                String.format("Unexpected tokens. Found %s", tokens));

        request = AnalyzeRequest.withIndexAnalyzer(
                "smpldat_datasetindex_v2",
                "urn_component",
                "urn:li:dataset:(urn:li:dataPlatform:hive,SampleHiveDataset-ac611929-c3ac-4b92-aafb-f4603ddb408a,PROD)"
        );
        tokens = getTokens(request).map(AnalyzeResponse.AnalyzeToken::getTerm).collect(Collectors.toList());
        assertEquals(tokens, List.of(
                        "urn:li:dataset", "dataset",
                        "urn:li:dataplatform:hive", "data", "dataplatform", "platform", "hive",
                        "samplehivedataset-ac611929-c3ac-4b92-aafb-f4603ddb408a",
                        "samplehivedataset", "ac611929", "c3ac", "4b92", "aafb", "f4603ddb408a", "sampl",
                        "prod", "production"),
                String.format("Unexpected tokens. Found %s", tokens));

        request = AnalyzeRequest.withIndexAnalyzer(
                "smpldat_datasetindex_v2",
                "urn_component",
                "urn:li:dataset:(urn:li:dataPlatform:test_rollback,rollback_test_dataset,TEST)"
        );
        tokens = getTokens(request).map(AnalyzeResponse.AnalyzeToken::getTerm).collect(Collectors.toList());
        assertEquals(tokens, List.of(
                        "urn:li:dataset", "dataset",
                        "urn:li:dataplatform:test_rollback",  "data", "dataplatform", "platform",
                        "test", "rollback", "rollback_test_dataset"),
                String.format("Unexpected tokens. Found %s", tokens));
    }

    @Test
    public void testChartAutoComplete() throws InterruptedException {
        // Two charts exist Baz Chart 1 & Baz Chart 2
        List.of("B", "Ba", "Baz", "Baz ", "Baz C", "Baz Ch", "Baz Cha", "Baz Char", "Baz Chart", "Baz Chart ")
                .forEach(query -> {
                    try {
                        AutoCompleteResults result = autocomplete(new ChartType(entityClient), query);
                        assertTrue(result.getEntities().size() == 2,
                                String.format("Expected 2 results for `%s` found %s", query, result.getEntities().size()));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    private Stream<AnalyzeResponse.AnalyzeToken> getTokens(AnalyzeRequest request) throws IOException {
        return _searchClient.indices().analyze(request, RequestOptions.DEFAULT).getTokens().stream();
    }
}
