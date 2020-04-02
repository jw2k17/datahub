package com.linkedin.metadata.kafka;

import java.io.IOException;
import java.net.URISyntaxException;

import javax.annotation.Nonnull;

import org.apache.avro.generic.GenericRecord;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.linkedin.common.urn.Urn;
import com.linkedin.data.template.RecordTemplate;
import com.linkedin.metadata.EventUtils;
import com.linkedin.metadata.dao.internal.BaseRemoteWriterDAO;
import com.linkedin.metadata.dao.utils.ModelUtils;
import com.linkedin.metadata.dao.utils.RecordUtils;
import com.linkedin.metadata.snapshot.Snapshot;
import com.linkedin.mxe.FailedMetadataChangeEvent;
import com.linkedin.mxe.MetadataChangeEvent;
import com.linkedin.mxe.Topics;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class MetadataChangeEventsProcessor {

    private BaseRemoteWriterDAO remoteWriterDAO;
    @Autowired
    private KafkaProducer<String, GenericRecord> kafkaProducer;
    @Value("${KAFKA_FMCE_TOPIC_NAME:" + Topics.FAILED_METADATA_CHANGE_EVENT + "}")
    private String fmceTopicName;

    public MetadataChangeEventsProcessor(BaseRemoteWriterDAO remoteWriterDAO) {
        this.remoteWriterDAO = remoteWriterDAO;
    }

    public void processSingleMCE(final GenericRecord record) {
        log.debug("Got MCE");
        log.debug("Record ", record);

        MetadataChangeEvent event = new MetadataChangeEvent();

        try {
            event = EventUtils.avroToPegasusMCE(record);
            log.debug("MetadataChangeEvent {}", event);
            if (event.hasProposedSnapshot()) {
                processProposedSnapshot(event);
            }
        } catch (Throwable throwable) {
            log.error("MCE Processor Error", throwable);
            log.error("Message: {}", record);
            sendFailedMCE(event, throwable);
        }
    }

    /**
     * Sending Failed MCE Event to Kafka Topic
     *
     * @param event
     * @param throwable
     */
    private void sendFailedMCE(@Nonnull MetadataChangeEvent event, @Nonnull Throwable throwable) {
        final FailedMetadataChangeEvent failedMetadataChangeEvent = createFailedMCEEvent(event, throwable);
        try {
            final GenericRecord genericFailedMCERecord = EventUtils.pegasusToAvroFailedMCE(failedMetadataChangeEvent);
            log.debug("Sending FailedMessages to topic - {}", fmceTopicName);
            log.info("Error while processing MCE: FailedMetadataChangeEvent - {}", failedMetadataChangeEvent);
            this.kafkaProducer.send(new ProducerRecord<>(fmceTopicName, genericFailedMCERecord));
        } catch (IOException e) {
            log.error("Error while sending FailedMetadataChangeEvent: Exception  - {}, FailedMetadataChangeEvent - {}", e.getStackTrace(), failedMetadataChangeEvent);
        }
    }

    /**
     * Populate a FailedMetadataChangeEvent from a MCE
     *
     * @param event
     * @param throwable
     * @return FailedMetadataChangeEvent
     */
    @Nonnull
    private FailedMetadataChangeEvent createFailedMCEEvent(@Nonnull MetadataChangeEvent event, @Nonnull Throwable throwable) {
        final FailedMetadataChangeEvent fmce = new FailedMetadataChangeEvent();
        fmce.setError(ExceptionUtils.getStackTrace(throwable));
        fmce.setMetadataChangeEvent(event);
        return fmce;
    }

    private void processProposedSnapshot(@Nonnull MetadataChangeEvent metadataChangeEvent) throws URISyntaxException {
        Snapshot snapshotUnion = metadataChangeEvent.getProposedSnapshot();
        final RecordTemplate snapshot = RecordUtils.getSelectedRecordTemplateFromUnion(snapshotUnion);
        final Urn urn = ModelUtils.getUrnFromSnapshotUnion(snapshotUnion);
        remoteWriterDAO.create(urn, snapshot);
    }

}
