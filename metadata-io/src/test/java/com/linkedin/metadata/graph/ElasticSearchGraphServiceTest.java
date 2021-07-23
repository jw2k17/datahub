package com.linkedin.metadata.graph;

import com.linkedin.common.urn.Urn;
import com.linkedin.metadata.graph.elastic.ESGraphQueryDAO;
import com.linkedin.metadata.graph.elastic.ESGraphWriteDAO;
import com.linkedin.metadata.graph.elastic.ElasticSearchGraphService;
import com.linkedin.metadata.query.Filter;
import com.linkedin.metadata.query.RelationshipFilter;
import com.linkedin.metadata.utils.elasticsearch.IndexConvention;
import com.linkedin.metadata.utils.elasticsearch.IndexConventionImpl;
import org.apache.http.HttpHost;
import org.apache.http.impl.nio.reactor.IOReactorConfig;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.testcontainers.elasticsearch.ElasticsearchContainer;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeTest;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.net.URISyntaxException;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class ElasticSearchGraphServiceTest extends GraphServiceTestBase {

  private ElasticsearchContainer _elasticsearchContainer;
  private RestHighLevelClient _searchClient;
  private IndexConvention _indexConvention;
  private ElasticSearchGraphService _client;

  private static final String IMAGE_NAME = "docker.elastic.co/elasticsearch/elasticsearch:7.9.3";
  private static final int HTTP_PORT = 9200;

  @BeforeMethod
  public void wipe() throws URISyntaxException {
    _client.removeNode(Urn.createFromString("urn:li:dataset:(urn:li:dataPlatform:kafka,SampleKafkaDataset,PROD)"));
    _client.removeNode(Urn.createFromString("urn:li:dataset:(urn:li:dataPlatform:hive,SampleHiveDataset,PROD)"));
  }

  @BeforeTest
  public void setup() {
    _indexConvention = new IndexConventionImpl(null);
    _elasticsearchContainer = new ElasticsearchContainer(IMAGE_NAME);
    _elasticsearchContainer.start();
    _searchClient = buildRestClient();
    _client = buildService();
    _client.configure();
  }

  @Nonnull
  private RestHighLevelClient buildRestClient() {
    final RestClientBuilder builder =
        RestClient.builder(new HttpHost("localhost", _elasticsearchContainer.getMappedPort(HTTP_PORT), "http"))
            .setHttpClientConfigCallback(httpAsyncClientBuilder -> httpAsyncClientBuilder.setDefaultIOReactorConfig(
                IOReactorConfig.custom().setIoThreadCount(1).build()));

    builder.setRequestConfigCallback(requestConfigBuilder -> requestConfigBuilder.
        setConnectionRequestTimeout(3000));

    return new RestHighLevelClient(builder);
  }

  @Nonnull
  private ElasticSearchGraphService buildService() {
    ESGraphQueryDAO readDAO = new ESGraphQueryDAO(_searchClient, _indexConvention);
    ESGraphWriteDAO writeDAO = new ESGraphWriteDAO(_searchClient, _indexConvention, 1, 1, 1, 1);
    return new ElasticSearchGraphService(_searchClient, _indexConvention, writeDAO, readDAO);
  }

  @AfterTest
  public void tearDown() {
    _elasticsearchContainer.stop();
  }

  @Override
  protected GraphService getGraphService() {
    return new WaitOnWriteGraphService(_client, Duration.ofSeconds(5));
  }
}

class WaitOnWriteGraphService implements GraphService {

  private final GraphService _service;
  private final Duration _duration;

  public WaitOnWriteGraphService(GraphService service, Duration duration) {
    _service = service;
    _duration = duration;
  }

  private void wait_duration() {
    try {
      TimeUnit.SECONDS.sleep(_duration.getSeconds());
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public void addEdge(Edge edge) {
    _service.addEdge(edge);
    wait_duration();
  }

  @Nonnull
  @Override
  public List<String> findRelatedUrns(@Nullable String sourceType, @Nonnull Filter sourceEntityFilter, @Nullable String destinationType, @Nonnull Filter destinationEntityFilter, @Nonnull List<String> relationshipTypes, @Nonnull RelationshipFilter relationshipFilter, int offset, int count) {
    return _service.findRelatedUrns(sourceType, sourceEntityFilter, destinationType, destinationEntityFilter, relationshipTypes, relationshipFilter, offset, count);
  }

  @Override
  public void removeNode(@Nonnull Urn urn) {
    _service.removeNode(urn);
    wait_duration();
  }

  @Override
  public void removeEdgesFromNode(@Nonnull Urn urn, @Nonnull List<String> relationshipTypes, @Nonnull RelationshipFilter relationshipFilter) {
    _service.removeEdgesFromNode(urn, relationshipTypes, relationshipFilter);
    wait_duration();
  }

  @Override
  public void configure() {
    _service.configure();
    wait_duration();
  }

  @Override
  public void clear() {
    _service.clear();
    wait_duration();
  }
}
