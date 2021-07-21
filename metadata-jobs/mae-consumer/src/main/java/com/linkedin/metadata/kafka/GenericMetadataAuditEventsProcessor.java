package com.linkedin.metadata.kafka;

import com.linkedin.common.urn.Urn;
import com.linkedin.data.template.RecordTemplate;
import com.linkedin.events.metadata.ChangeType;
import com.linkedin.gms.factory.entityregistry.ConfigEntityRegistryFactory;
import com.linkedin.gms.factory.temporal.TemporalAspectServiceFactory;
import com.linkedin.metadata.EventUtils;
import com.linkedin.metadata.kafka.config.MetadataAuditEventsProcessorCondition;
import com.linkedin.metadata.models.AspectSpec;
import com.linkedin.metadata.models.EntitySpec;
import com.linkedin.metadata.models.registry.ConfigEntityRegistry;
import com.linkedin.metadata.temporal.TemporalAspectService;
import com.linkedin.metadata.util.AspectDeserializationUtil;
import com.linkedin.mxe.GenericMetadataAuditEvent;
import com.linkedin.mxe.Topics;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.apache.avro.generic.GenericRecord;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Import;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;


@Slf4j
@Component
@Conditional(MetadataAuditEventsProcessorCondition.class)
@Import({TemporalAspectServiceFactory.class, ConfigEntityRegistryFactory.class})
@EnableKafka
public class GenericMetadataAuditEventsProcessor {

  private final TemporalAspectService _temporalAspectService;
  private final ConfigEntityRegistry _configEntityRegistry;

  @Autowired
  public GenericMetadataAuditEventsProcessor(TemporalAspectService temporalAspectService,
      ConfigEntityRegistry configEntityRegistry) {
    _temporalAspectService = temporalAspectService;
    _configEntityRegistry = configEntityRegistry;

    _temporalAspectService.configure();
  }

  @KafkaListener(id = "${GENERIC_METADATA_AUDIT_EVENT_KAFKA_CONSUMER_GROUP_ID:generic-mae-consumer-job-client}", topics =
      "${GENERIC_METADATA_AUDIT_EVENT_NAME:" + Topics.GENERIC_METADATA_AUDIT_EVENT
          + "}", containerFactory = "avroSerializedKafkaListener")
  public void consume(final ConsumerRecord<String, GenericRecord> consumerRecord) {
    final GenericRecord record = consumerRecord.value();
    log.debug("Got Generic MAE");

    GenericMetadataAuditEvent event;
    try {
      event = EventUtils.avroToPegasusGenericMAE(record);
    } catch (Exception e) {
      log.error("Error deserializing message: {}", e.toString());
      log.error("Message: {}", record.toString());
      return;
    }

    if (event.getChangeType() == ChangeType.CREATE || event.getChangeType() == ChangeType.UPDATE) {
      EntitySpec entitySpec;
      try {
        entitySpec = _configEntityRegistry.getEntitySpec(event.getEntityType());
      } catch (IllegalArgumentException e) {
        log.error("Error while processing entity type {}: {}", event.getEntityType(), e.toString());
        return;
      }

      if (event.getEntityKey().isGenericAspect()) {
        log.error("Key as struct is not yet supported");
        return;
      }

      Urn urn = event.getEntityKey().getUrn();

      if (!event.hasAspectName() || !event.hasAspect()) {
        log.error("Aspect or aspect name is missing");
        return;
      }

      AspectSpec aspectSpec = entitySpec.getAspectSpec(event.getAspectName());
      if (aspectSpec == null) {
        log.error("Unrecognized aspect name {} for entity {}", event.getAspectName(), event.getEntityType());
        return;
      }

      RecordTemplate aspect =
          AspectDeserializationUtil.deserializeAspect(event.getAspect().getValue(), event.getAspect().getContentType(),
              aspectSpec);
      updateTemporalStats(event.getEntityType(), event.getAspectName(), aspectSpec, urn, aspect);
    }
  }

  private void updateTemporalStats(String entityType, String aspectName, AspectSpec aspectSpec, Urn urn,
      RecordTemplate aspect) {
//    List<String> documents = TemporalStatsTransformer.transform(urn, aspect, aspectSpec);
//    documents.forEach(document -> _temporalAspectService.upsertDocument(entityType, aspectName, document));
  }
}
