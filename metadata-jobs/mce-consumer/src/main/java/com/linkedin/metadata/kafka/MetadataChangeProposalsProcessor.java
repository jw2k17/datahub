package com.linkedin.metadata.kafka;

import com.linkedin.entity.client.EntityClient;
import com.linkedin.metadata.EventUtils;
import com.linkedin.metadata.kafka.config.MetadataChangeProposalProcessorCondition;
import com.linkedin.mxe.FailedMetadataChangeProposal;
import com.linkedin.mxe.MetadataChangeProposal;
import com.linkedin.mxe.Topics;
import java.io.IOException;
import javax.annotation.Nonnull;
import lombok.extern.slf4j.Slf4j;
import org.apache.avro.generic.GenericRecord;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Conditional;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;


@Slf4j
@Component
@Conditional(MetadataChangeProposalProcessorCondition.class)
@EnableKafka
public class MetadataChangeProposalsProcessor {

  private EntityClient entityClient;
  private KafkaTemplate<String, GenericRecord> kafkaTemplate;

  @Value("${FAILED_METADATA_CHANGE_PROPOSAL_NAME:" + Topics.FAILED_METADATA_CHANGE_PROPOSAL + "}")
  private String fmcpTopicName;

  public MetadataChangeProposalsProcessor(@Nonnull final EntityClient entityClient,
      @Nonnull final KafkaTemplate<String, GenericRecord> kafkaTemplate) {
    this.entityClient = entityClient;
    this.kafkaTemplate = kafkaTemplate;
  }

  @KafkaListener(id = "${METADATA_CHANGE_PROPOSAL_KAFKA_CONSUMER_GROUP_ID:generic-mce-consumer-job-client}", topics =
      "${METADATA_CHANGE_PROPOSAL_NAME:" + Topics.METADATA_CHANGE_PROPOSAL
          + "}", containerFactory = "mceKafkaContainerFactory")
  public void consume(final ConsumerRecord<String, GenericRecord> consumerRecord) {
    final GenericRecord record = consumerRecord.value();
    log.debug("Record {}", record);

    MetadataChangeProposal event = new MetadataChangeProposal();
    try {
      event = EventUtils.avroToPegasusMCP(record);
      log.debug("MetadataChangeProposal {}", event);
      entityClient.ingestProposal(event);
    } catch (Throwable throwable) {
      log.error("MCP Processor Error", throwable);
      log.error("Message: {}", record);
      sendFailedMCP(event, throwable);
    }
  }

  private void sendFailedMCP(@Nonnull MetadataChangeProposal event, @Nonnull Throwable throwable) {
    final FailedMetadataChangeProposal failedMetadataChangeProposal = createFailedMCPEvent(event, throwable);
    try {
      final GenericRecord genericFailedMCERecord = EventUtils.pegasusToAvroFailedMCP(failedMetadataChangeProposal);
      log.debug("Sending FailedMessages to topic - {}", fmcpTopicName);
      log.info("Error while processing FMCP: FailedMetadataChangeProposal - {}", failedMetadataChangeProposal);
      this.kafkaTemplate.send(fmcpTopicName, genericFailedMCERecord);
    } catch (IOException e) {
      log.error("Error while sending FailedMetadataChangeProposal: Exception  - {}, FailedMetadataChangeProposal - {}",
          e.getStackTrace(), failedMetadataChangeProposal);
    }
  }

  @Nonnull
  private FailedMetadataChangeProposal createFailedMCPEvent(@Nonnull MetadataChangeProposal event,
      @Nonnull Throwable throwable) {
    final FailedMetadataChangeProposal fmcp = new FailedMetadataChangeProposal();
    fmcp.setError(ExceptionUtils.getStackTrace(throwable));
    fmcp.setMetadataChangeProposal(event);
    return fmcp;
  }
}
