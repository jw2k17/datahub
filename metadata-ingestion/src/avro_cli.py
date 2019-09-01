import argparse
from confluent_kafka import avro

record_schema = avro.load("../../metadata-events/mxe-schemas/src/original/avro/com/linkedin/mxe/MetadataChangeEvent.avsc")

class MetadataChangeEvent(object):

    def __init__(self, avro_event=None):
        self.value = avro_event

def produce(topic, conf):
    """
        Produce MetadataChangeEvent records
    """
    from confluent_kafka.avro import AvroProducer
    import ast

    producer = AvroProducer(conf, default_value_schema=record_schema)

    print("Producing MetadataChangeEvent records to topic {}. ^c to exit.".format(topic))

    sample_MCE = 'resources/sample_MCE.dat'
    with open(sample_MCE) as fp:
        while True:
            sample = fp.readline()
            if not sample:
                break
            try:
                content = ast.literal_eval(sample.strip())
                producer.produce(topic=topic, value=content)
                producer.poll(0)
            except KeyboardInterrupt:
                break
            except ValueError as e:
                print ("Message serialization failed {}".format(e))
                continue

    print("\nFlushing records...")
    producer.flush()


def consume(topic, conf):
    """
        Consume MetadataChangeEvent records
    """
    from confluent_kafka.avro import AvroConsumer
    from confluent_kafka.avro.serializer import SerializerError

    print("Consuming MetadataChangeEvent records from topic {} with group {}. ^c to exit.".format(topic, conf["group.id"]))

    c = AvroConsumer(conf, reader_value_schema=record_schema)
    c.subscribe([topic])

    while True:
        try:
            msg = c.poll(1)

            # There were no messages on the queue, continue polling
            if msg is None:
                continue

            if msg.error():
                print("Consumer error: {}".format(msg.error()))
                continue

            record = MetadataChangeEvent(msg.value())
            print("avro_event: {}\n\t".format(record.value))
        except SerializerError as e:
            # Report malformed record, discard results, continue polling
            print("Message deserialization failed {}".format(e))
            continue
        except KeyboardInterrupt:
            break

    print("Shutting down consumer..")
    c.close()


def main(args):
    # Handle common configs
    conf = {'bootstrap.servers': args.bootstrap_servers,
            'schema.registry.url': args.schema_registry}

    if args.mode == "produce":
        produce(args.topic, conf)
    else:
        # Fallback to earliest to ensure all messages are consumed
        conf['group.id'] = args.group
        conf['auto.offset.reset'] = "earliest"
        consume(args.topic, conf)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Client for handling Avro MetadataChangeEvent_v4")
    parser.add_argument('-b', dest="bootstrap_servers",
                        default="localhost:9092", help="Bootstrap broker(s) (localhost[:port])")
    parser.add_argument('-s', dest="schema_registry",
                        default="http://localhost:8081", help="Schema Registry (http(s)://localhost[:port]")
    parser.add_argument('-t', dest="topic", default="MetadataChangeEvent_v4",
                        help="Topic name")
    parser.add_argument('mode', choices=['produce', 'consume'],
                        help="Execution mode (produce | consume)")
    parser.add_argument('-g', dest="group", default="MetadataChangeEvent_v4",
                        help="Consumer group; required if running 'consumer' mode")
    main(parser.parse_args())