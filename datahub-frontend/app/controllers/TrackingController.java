package controllers;

import auth.Authenticator;
import client.AuthServiceClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.typesafe.config.Config;
import javax.annotation.Nonnull;
import javax.inject.Inject;
import javax.inject.Singleton;


import org.apache.kafka.clients.producer.ProducerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Security;
import client.KafkaTrackingProducer;

import static auth.AuthUtils.ACTOR;


// TODO: Migrate this to metadata-service.
@Singleton
public class TrackingController extends Controller {

    private final Logger _logger = LoggerFactory.getLogger(TrackingController.class.getName());

    private final String _topic;

    @Inject
    KafkaTrackingProducer _producer;

    @Inject
    AuthServiceClient _authClient;

    @Inject
    public TrackingController(@Nonnull Config config) {
        _topic = config.getString("analytics.tracking.topic");
    }

    @Security.Authenticated(Authenticator.class)
    @Nonnull
    public Result track(Http.Request request) throws Exception {
        if (!_producer.isEnabled()) {
            // If tracking is disabled, simply return a 200.
            return status(200);
        }

        JsonNode event;
        try {
            event = request.body().asJson();
        } catch (Exception e) {
            return badRequest();
        }
        final String actor = request.session().data().get(ACTOR);
        try {
            _logger.debug(String.format("Emitting product analytics event. actor: %s, event: %s", actor, event));
            final ProducerRecord<String, String> record = new ProducerRecord<>(
                _topic,
                actor,
                event.toString());
            _producer.send(record);
            _authClient.track(event.toString());
            return ok();
        } catch (Exception e) {
            _logger.error(String.format("Failed to emit product analytics event. actor: %s, event: %s", actor, event));
            return internalServerError(e.getMessage());
        }
    }
}
