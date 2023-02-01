package com.linkedin.gms.factory.kafka;

import com.linkedin.gms.factory.kafka.schemaregistry.AwsGlueSchemaRegistryFactory;
import com.linkedin.gms.factory.kafka.schemaregistry.KafkaSchemaRegistryFactory;
import com.linkedin.gms.factory.kafka.schemaregistry.SchemaRegistryConfig;
import com.linkedin.gms.factory.spring.YamlPropertySourceFactory;
import java.time.Duration;
import java.util.Arrays;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.apache.avro.generic.GenericRecord;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.PropertySource;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerContainerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;


@Slf4j
@Configuration
@PropertySource(value = "classpath:/application.yml", factory = YamlPropertySourceFactory.class)
@EnableConfigurationProperties(KafkaProperties.class)
@Import({KafkaSchemaRegistryFactory.class, AwsGlueSchemaRegistryFactory.class})
public class KafkaEventConsumerFactory {

  @Value("${kafka.bootstrapServers}")
  private String kafkaBootstrapServers;

  @Value("${kafka.schemaRegistry.type}")
  private String schemaRegistryType;

  @Value("${kafka.listener.concurrency:1}")
  private Integer kafkaListenerConcurrency;

  @Autowired
  @Lazy
  @Qualifier("kafkaSchemaRegistry")
  private SchemaRegistryConfig kafkaSchemaRegistryConfig;

  @Autowired
  @Lazy
  @Qualifier("awsGlueSchemaRegistry")
  private SchemaRegistryConfig awsGlueSchemaRegistryConfig;

  @Bean(name = "kafkaEventConsumerConcurrency")
  protected int kafkaEventConsumerConcurrency() {
    return kafkaListenerConcurrency;
  }

  @Bean(name = "kafkaConsumerFactory")
  public DefaultKafkaConsumerFactory<String, GenericRecord> defaultKafkaConsumerFactory(KafkaProperties properties) {
    KafkaProperties.Consumer consumerProps = properties.getConsumer();

    // Specify (de)serializers for record keys and for record values.
    consumerProps.setKeyDeserializer(StringDeserializer.class);
    // Records will be flushed every 10 seconds.
    consumerProps.setEnableAutoCommit(true);
    consumerProps.setAutoCommitInterval(Duration.ofSeconds(10));

    // KAFKA_BOOTSTRAP_SERVER has precedence over SPRING_KAFKA_BOOTSTRAP_SERVERS
    if (kafkaBootstrapServers != null && kafkaBootstrapServers.length() > 0) {
      consumerProps.setBootstrapServers(Arrays.asList(kafkaBootstrapServers.split(",")));
    } // else we rely on KafkaProperties which defaults to localhost:9092

    SchemaRegistryConfig schemaRegistryConfig;
    if (schemaRegistryType.equals(KafkaSchemaRegistryFactory.TYPE)) {
      schemaRegistryConfig = kafkaSchemaRegistryConfig;
    } else {
      schemaRegistryConfig = awsGlueSchemaRegistryConfig;
    }

    consumerProps.setValueDeserializer(schemaRegistryConfig.getDeserializer());
    Map<String, Object> props = properties.buildConsumerProperties();

    // Override KafkaProperties with SchemaRegistryConfig only for non-empty values
    schemaRegistryConfig.getProperties().entrySet()
        .stream()
        .filter(entry -> entry.getValue() != null && !entry.getValue().toString().isEmpty())
        .forEach(entry -> props.put(entry.getKey(), entry.getValue()));

    return new DefaultKafkaConsumerFactory<>(props);
  }

  @Bean(name = "kafkaEventConsumer")
  protected KafkaListenerContainerFactory<?> createInstance(
          @Qualifier("kafkaConsumerFactory") DefaultKafkaConsumerFactory<String, GenericRecord> defaultKafkaConsumerFactory,
          @Qualifier("kafkaEventConsumerConcurrency") int concurrency) {

    ConcurrentKafkaListenerContainerFactory<String, GenericRecord> factory =
            new ConcurrentKafkaListenerContainerFactory<>();
    factory.setConsumerFactory(defaultKafkaConsumerFactory);
    factory.setContainerCustomizer(new ThreadPoolContainerCustomizer());
    factory.setConcurrency(concurrency);

    log.info(String.format("Event-based KafkaListenerContainerFactory built successfully. Consumers = %s",
            concurrency));

    return factory;
  }
}
