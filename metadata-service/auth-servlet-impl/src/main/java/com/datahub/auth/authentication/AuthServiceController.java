package com.datahub.auth.authentication;

import static com.linkedin.metadata.Constants.*;

import com.datahub.authentication.Actor;
import com.datahub.authentication.ActorType;
import com.datahub.authentication.Authentication;
import com.datahub.authentication.AuthenticationContext;
import com.datahub.authentication.invite.InviteTokenService;
import com.datahub.authentication.token.StatelessTokenService;
import com.datahub.authentication.token.TokenType;
import com.datahub.authentication.user.NativeUserService;
import com.datahub.telemetry.TrackingService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.linkedin.common.urn.CorpuserUrn;
import com.linkedin.common.urn.Urn;
import com.linkedin.gms.factory.config.ConfigurationProvider;
import com.linkedin.metadata.entity.EntityService;
import com.linkedin.metadata.secret.SecretService;
import com.linkedin.settings.global.GlobalSettingsInfo;
import com.linkedin.settings.global.OidcSettings;
import com.linkedin.settings.global.SsoSettings;
import jakarta.inject.Inject;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import javax.annotation.Nullable;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

@Slf4j
@RestController
public class AuthServiceController {

  private static final String USER_ID_FIELD_NAME = "userId";
  private static final String ACCESS_TOKEN_FIELD_NAME = "accessToken";
  private static final String USER_URN_FIELD_NAME = "userUrn";
  private static final String FULL_NAME_FIELD_NAME = "fullName";
  private static final String EMAIL_FIELD_NAME = "email";
  private static final String TITLE_FIELD_NAME = "title";
  private static final String PASSWORD_FIELD_NAME = "password";
  private static final String INVITE_TOKEN_FIELD_NAME = "inviteToken";
  private static final String RESET_TOKEN_FIELD_NAME = "resetToken";
  private static final String IS_NATIVE_USER_CREATED_FIELD_NAME = "isNativeUserCreated";
  private static final String ARE_NATIVE_USER_CREDENTIALS_RESET_FIELD_NAME =
      "areNativeUserCredentialsReset";
  private static final String DOES_PASSWORD_MATCH_FIELD_NAME = "doesPasswordMatch";
  private static final String BASE_URL = "baseUrl";
  private static final String OIDC_ENABLED = "oidcEnabled";
  private static final String CLIENT_ID = "clientId";
  private static final String CLIENT_SECRET = "clientSecret";
  private static final String DISCOVERY_URI = "discoveryUri";
  private static final String USER_NAME_CLAIM = "userNameClaim";
  private static final String USER_NAME_CLAIM_REGEX = "userNameClaimRegex";
  private static final String SCOPE = "scope";
  private static final String CLIENT_AUTHENTICATION_METHOD = "clientAuthenticationMethod";
  private static final String JIT_PROVISIONING_ENABLED = "jitProvisioningEnabled";
  private static final String PRE_PROVISIONING_REQUIRED = "preProvisioningRequired";
  private static final String EXTRACT_GROUPS_ENABLED = "extractGroupsEnabled";
  private static final String GROUPS_CLAIM = "groupsClaim";
  private static final String RESPONSE_TYPE = "responseType";
  private static final String RESPONSE_MODE = "responseMode";
  private static final String USE_NONCE = "useNonce";
  private static final String READ_TIMEOUT = "readTimeout";
  private static final String EXTRACT_JWT_ACCESS_TOKEN_CLAIMS = "extractJwtAccessTokenClaims";
  private static final String PREFERRED_JWS_ALGORITHM = "preferredJwsAlgorithm";

  @Inject StatelessTokenService _statelessTokenService;

  @Inject Authentication _systemAuthentication;

  @Inject
  @Qualifier("configurationProvider")
  ConfigurationProvider _configProvider;

  @Inject NativeUserService _nativeUserService;

  @Inject EntityService _entityService;

  @Inject SecretService _secretService;

  @Inject InviteTokenService _inviteTokenService;

  @Inject @Nullable TrackingService _trackingService;

  /**
   * Generates a JWT access token for as user UI session, provided a unique "user id" to generate
   * the token for inside a JSON POST body.
   *
   * <p>Example Request:
   *
   * <p>POST /generateSessionTokenForUser -H "Authorization: Basic
   * <system-client-id>:<system-client-secret>" { "userId": "datahub" }
   *
   * <p>Example Response:
   *
   * <p>{ "accessToken": "<the access token>" }
   */
  @PostMapping(value = "/generateSessionTokenForUser", produces = "application/json;charset=utf-8")
  CompletableFuture<ResponseEntity<String>> generateSessionTokenForUser(
      final HttpEntity<String> httpEntity) {
    String jsonStr = httpEntity.getBody();
    ObjectMapper mapper = new ObjectMapper();
    JsonNode bodyJson = null;
    try {
      bodyJson = mapper.readTree(jsonStr);
    } catch (JsonProcessingException e) {
      log.error(
          String.format(
              "Failed to parse json while attempting to generate session token %s", jsonStr));
      return CompletableFuture.completedFuture(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }
    if (bodyJson == null) {
      return CompletableFuture.completedFuture(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }
    /*
     * Extract userId field
     */
    JsonNode userId = bodyJson.get(USER_ID_FIELD_NAME);
    if (userId == null) {
      return CompletableFuture.completedFuture(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }

    log.debug(String.format("Attempting to generate session token for user %s", userId.asText()));
    final String actorId = AuthenticationContext.getAuthentication().getActor().getId();
    return CompletableFuture.supplyAsync(
        () -> {
          // 1. Verify that only those authorized to generate a token (datahub system) are able to.
          if (isAuthorizedToGenerateSessionToken(actorId)) {
            try {
              // 2. Generate a new DataHub JWT
              final String token =
                  _statelessTokenService.generateAccessToken(
                      TokenType.SESSION,
                      new Actor(ActorType.USER, userId.asText()),
                      _configProvider.getAuthentication().getSessionTokenDurationMs());
              return new ResponseEntity<>(buildTokenResponse(token), HttpStatus.OK);
            } catch (Exception e) {
              log.error("Failed to generate session token for user", e);
              return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
          }
          throw HttpClientErrorException.create(
              HttpStatus.UNAUTHORIZED,
              "Unauthorized to perform this action.",
              new HttpHeaders(),
              null,
              null);
        });
  }

  /**
   * Creates a native DataHub user using the provided full name, email and password. The provided
   * invite token must be current otherwise a new user will not be created.
   *
   * <p>Example Request:
   *
   * <p>POST /signUp -H "Authorization: Basic <system-client-id>:<system-client-secret>" {
   * "fullName": "Full Name" "userUrn": "urn:li:corpuser:test" "email": "email@test.com" "title":
   * "Data Scientist" "password": "password123" "inviteToken": "abcd" }
   *
   * <p>Example Response:
   *
   * <p>{ "isNativeUserCreated": true }
   */
  @PostMapping(value = "/signUp", produces = "application/json;charset=utf-8")
  CompletableFuture<ResponseEntity<String>> signUp(final HttpEntity<String> httpEntity) {
    String jsonStr = httpEntity.getBody();
    ObjectMapper mapper = new ObjectMapper();
    JsonNode bodyJson;
    try {
      bodyJson = mapper.readTree(jsonStr);
    } catch (JsonProcessingException e) {
      log.error(
          String.format("Failed to parse json while attempting to create native user %s", jsonStr));
      return CompletableFuture.completedFuture(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }
    if (bodyJson == null) {
      return CompletableFuture.completedFuture(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }
    /*
     * Extract username and password field
     */
    JsonNode userUrn = bodyJson.get(USER_URN_FIELD_NAME);
    JsonNode fullName = bodyJson.get(FULL_NAME_FIELD_NAME);
    JsonNode email = bodyJson.get(EMAIL_FIELD_NAME);
    JsonNode title = bodyJson.get(TITLE_FIELD_NAME);
    JsonNode password = bodyJson.get(PASSWORD_FIELD_NAME);
    JsonNode inviteToken = bodyJson.get(INVITE_TOKEN_FIELD_NAME);
    if (fullName == null
        || userUrn == null
        || email == null
        || title == null
        || password == null
        || inviteToken == null) {
      return CompletableFuture.completedFuture(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }

    String userUrnString = userUrn.asText();
    String systemClientUser =
        new CorpuserUrn(_configProvider.getAuthentication().getSystemClientId()).toString();

    if (userUrnString.equals(systemClientUser)
        || userUrnString.equals(DATAHUB_ACTOR)
        || userUrnString.equals(UNKNOWN_ACTOR)) {
      return CompletableFuture.completedFuture(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }
    String fullNameString = fullName.asText();
    String emailString = email.asText();
    String titleString = title.asText();
    String passwordString = password.asText();
    String inviteTokenString = inviteToken.asText();
    Authentication auth = AuthenticationContext.getAuthentication();
    log.debug(String.format("Attempting to create native user %s", userUrnString));
    return CompletableFuture.supplyAsync(
        () -> {
          try {
            Urn inviteTokenUrn = _inviteTokenService.getInviteTokenUrn(inviteTokenString);
            if (!_inviteTokenService.isInviteTokenValid(inviteTokenUrn, auth)) {
              log.error(String.format("Invalid invite token %s", inviteTokenString));
              return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            _nativeUserService.createNativeUser(
                userUrnString, fullNameString, emailString, titleString, passwordString, auth);
            String response = buildSignUpResponse();
            return new ResponseEntity<>(response, HttpStatus.OK);
          } catch (Exception e) {
            log.error(
                String.format("Failed to create credentials for native user %s", userUrnString), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
          }
        });
  }

  /**
   * Resets the credentials for a native DataHub user using the provided email and new password. The
   * provided reset token must be current otherwise the credentials will not be updated
   *
   * <p>Example Request:
   *
   * <p>POST /resetNativeUserCredentials -H "Authorization: Basic
   * <system-client-id>:<system-client-secret>" { "userUrn": "urn:li:corpuser:test" "password":
   * "password123" "resetToken": "abcd" }
   *
   * <p>Example Response:
   *
   * <p>{ "areNativeUserCredentialsReset": true }
   */
  @PostMapping(value = "/resetNativeUserCredentials", produces = "application/json;charset=utf-8")
  CompletableFuture<ResponseEntity<String>> resetNativeUserCredentials(
      final HttpEntity<String> httpEntity) {
    String jsonStr = httpEntity.getBody();
    ObjectMapper mapper = new ObjectMapper();
    JsonNode bodyJson;
    try {
      bodyJson = mapper.readTree(jsonStr);
    } catch (JsonProcessingException e) {
      log.error(
          String.format("Failed to parse json while attempting to create native user %s", jsonStr));
      return CompletableFuture.completedFuture(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }
    if (bodyJson == null) {
      return CompletableFuture.completedFuture(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }
    /*
     * Extract username and password field
     */
    JsonNode userUrn = bodyJson.get(USER_URN_FIELD_NAME);
    JsonNode password = bodyJson.get(PASSWORD_FIELD_NAME);
    JsonNode resetToken = bodyJson.get(RESET_TOKEN_FIELD_NAME);
    if (userUrn == null || password == null || resetToken == null) {
      return CompletableFuture.completedFuture(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }

    String userUrnString = userUrn.asText();
    String passwordString = password.asText();
    String resetTokenString = resetToken.asText();
    Authentication auth = AuthenticationContext.getAuthentication();
    log.debug(String.format("Attempting to reset credentials for native user %s", userUrnString));
    return CompletableFuture.supplyAsync(
        () -> {
          try {
            _nativeUserService.resetCorpUserCredentials(
                userUrnString, passwordString, resetTokenString, auth);
            String response = buildResetNativeUserCredentialsResponse();
            return new ResponseEntity<>(response, HttpStatus.OK);
          } catch (Exception e) {
            log.error(
                String.format("Failed to reset credentials for native user %s", userUrnString), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
          }
        });
  }

  /**
   * Verifies the credentials for a native DataHub user.
   *
   * <p>Example Request:
   *
   * <p>POST /verifyNativeUserCredentials -H "Authorization: Basic
   * <system-client-id>:<system-client-secret>" { "userUrn": "urn:li:corpuser:test" "password":
   * "password123" }
   *
   * <p>Example Response:
   *
   * <p>{ "passwordMatches": true }
   */
  @PostMapping(value = "/verifyNativeUserCredentials", produces = "application/json;charset=utf-8")
  CompletableFuture<ResponseEntity<String>> verifyNativeUserCredentials(
      final HttpEntity<String> httpEntity) {
    String jsonStr = httpEntity.getBody();
    ObjectMapper mapper = new ObjectMapper();
    JsonNode bodyJson;
    try {
      bodyJson = mapper.readTree(jsonStr);
    } catch (JsonProcessingException e) {
      log.error(
          String.format(
              "Failed to parse json while attempting to verify native user password %s", jsonStr));
      return CompletableFuture.completedFuture(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }
    if (bodyJson == null) {
      return CompletableFuture.completedFuture(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }
    /*
     * Extract username and password field
     */
    JsonNode userUrn = bodyJson.get(USER_URN_FIELD_NAME);
    JsonNode password = bodyJson.get(PASSWORD_FIELD_NAME);
    if (userUrn == null || password == null) {
      return CompletableFuture.completedFuture(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }

    String userUrnString = userUrn.asText();
    String passwordString = password.asText();
    log.debug(String.format("Attempting to verify credentials for native user %s", userUrnString));
    return CompletableFuture.supplyAsync(
        () -> {
          try {
            boolean doesPasswordMatch =
                _nativeUserService.doesPasswordMatch(userUrnString, passwordString);
            String response = buildVerifyNativeUserPasswordResponse(doesPasswordMatch);
            return new ResponseEntity<>(response, HttpStatus.OK);
          } catch (Exception e) {
            log.error(
                String.format("Failed to verify credentials for native user %s", userUrnString), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
          }
        });
  }

  /** Tracking endpoint */
  @PostMapping(value = "/track", produces = "application/json;charset=utf-8")
  CompletableFuture<ResponseEntity<String>> track(final HttpEntity<String> httpEntity) {
    String jsonStr = httpEntity.getBody();
    ObjectMapper mapper = new ObjectMapper();
    JsonNode bodyJson;
    try {
      bodyJson = mapper.readTree(jsonStr);
    } catch (JsonProcessingException e) {
      log.error(
          String.format(
              "Failed to parse json while attempting to track analytics event %s", jsonStr));
      return CompletableFuture.completedFuture(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }
    if (bodyJson == null) {
      return CompletableFuture.completedFuture(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
    }
    return CompletableFuture.supplyAsync(
        () -> {
          try {
            if (_trackingService != null) {
              _trackingService.emitAnalyticsEvent(bodyJson);
            }
            return new ResponseEntity<>(HttpStatus.OK);
          } catch (Exception e) {
            log.error("Failed to track event", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
          }
        });
  }

  /**
   * Gets possible SSO settings.
   *
   * <p>Example Request:
   *
   * <p>POST /getSsoSettings -H "Authorization: Basic <system-client-id>:<system-client-secret>" {
   * "userUrn": "urn:li:corpuser:test" "password": "password123" }
   *
   * <p>Example Response:
   *
   * <p>{ "clientId": "clientId", "clientSecret": "secret", "discoveryUri = "discoveryUri" }
   */
  @PostMapping(value = "/getSsoSettings", produces = "application/json;charset=utf-8")
  CompletableFuture<ResponseEntity<String>> getSsoSettings(final HttpEntity<String> httpEntity) {
    return CompletableFuture.supplyAsync(
        () -> {
          try {
            GlobalSettingsInfo globalSettingsInfo =
                (GlobalSettingsInfo)
                    _entityService.getLatestAspect(
                        GLOBAL_SETTINGS_URN, GLOBAL_SETTINGS_INFO_ASPECT_NAME);
            if (globalSettingsInfo == null || !globalSettingsInfo.hasSso()) {
              log.debug("There are no SSO settings available");
              return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            SsoSettings ssoSettings =
                Objects.requireNonNull(globalSettingsInfo.getSso(), "ssoSettings cannot be null");
            String response = buildSsoSettingsResponse(ssoSettings);
            return new ResponseEntity<>(response, HttpStatus.OK);
          } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
          }
        });
  }

  // Currently, only internal system is authorized to generate a token on behalf of a user!
  private boolean isAuthorizedToGenerateSessionToken(final String actorId) {
    // Verify that the actor is an internal system caller.
    final String systemClientId = _systemAuthentication.getActor().getId();
    return systemClientId.equals(actorId);
  }

  private String buildTokenResponse(final String token) {
    JSONObject json = new JSONObject();
    json.put(ACCESS_TOKEN_FIELD_NAME, token);
    return json.toString();
  }

  private String buildSignUpResponse() {
    JSONObject json = new JSONObject();
    json.put(IS_NATIVE_USER_CREATED_FIELD_NAME, true);
    return json.toString();
  }

  private String buildResetNativeUserCredentialsResponse() {
    JSONObject json = new JSONObject();
    json.put(ARE_NATIVE_USER_CREDENTIALS_RESET_FIELD_NAME, true);
    return json.toString();
  }

  private String buildVerifyNativeUserPasswordResponse(final boolean doesPasswordMatch) {
    JSONObject json = new JSONObject();
    json.put(DOES_PASSWORD_MATCH_FIELD_NAME, doesPasswordMatch);
    return json.toString();
  }

  private String buildSsoSettingsResponse(final SsoSettings ssoSettings) {
    String baseUrl = Objects.requireNonNull(ssoSettings.getBaseUrl());
    JSONObject json = new JSONObject();
    json.put(BASE_URL, baseUrl);

    if (ssoSettings.hasOidcSettings()) {
      OidcSettings oidcSettings =
          Objects.requireNonNull(ssoSettings.getOidcSettings(), "oidcSettings cannot be null");
      buildOidcSettingsResponse(json, oidcSettings);
    }

    return json.toString();
  }

  private void buildOidcSettingsResponse(JSONObject json, final OidcSettings oidcSettings) {
    json.put(OIDC_ENABLED, oidcSettings.isEnabled());
    json.put(CLIENT_ID, oidcSettings.getClientId());
    json.put(CLIENT_SECRET, _secretService.decrypt(oidcSettings.getClientSecret()));
    json.put(DISCOVERY_URI, oidcSettings.getDiscoveryUri());
    if (oidcSettings.hasUserNameClaim()) {
      json.put(USER_NAME_CLAIM, oidcSettings.getUserNameClaim());
    }
    if (oidcSettings.hasUserNameClaimRegex()) {
      json.put(USER_NAME_CLAIM_REGEX, oidcSettings.getUserNameClaimRegex());
    }
    if (oidcSettings.hasScope()) {
      json.put(SCOPE, oidcSettings.getScope());
    }
    if (oidcSettings.hasClientAuthenticationMethod()) {
      json.put(CLIENT_AUTHENTICATION_METHOD, oidcSettings.getClientAuthenticationMethod());
    }
    if (oidcSettings.hasJitProvisioningEnabled()) {
      json.put(JIT_PROVISIONING_ENABLED, oidcSettings.isJitProvisioningEnabled());
    }
    if (oidcSettings.hasPreProvisioningRequired()) {
      json.put(PRE_PROVISIONING_REQUIRED, oidcSettings.isPreProvisioningRequired());
    }
    if (oidcSettings.hasExtractGroupsEnabled()) {
      json.put(EXTRACT_GROUPS_ENABLED, oidcSettings.isExtractGroupsEnabled());
    }
    if (oidcSettings.hasGroupsClaim()) {
      json.put(GROUPS_CLAIM, oidcSettings.getGroupsClaim());
    }
    if (oidcSettings.hasResponseType()) {
      json.put(RESPONSE_TYPE, oidcSettings.getResponseType());
    }
    if (oidcSettings.hasResponseMode()) {
      json.put(RESPONSE_MODE, oidcSettings.getResponseMode());
    }
    if (oidcSettings.hasUseNonce()) {
      json.put(USE_NONCE, oidcSettings.isUseNonce());
    }
    if (oidcSettings.hasReadTimeout()) {
      json.put(READ_TIMEOUT, oidcSettings.getReadTimeout());
    }
    if (oidcSettings.hasExtractJwtAccessTokenClaims()) {
      json.put(EXTRACT_JWT_ACCESS_TOKEN_CLAIMS, oidcSettings.isExtractJwtAccessTokenClaims());
    }
    if (oidcSettings.hasPreferredJwsAlgorithm()) {
      json.put(PREFERRED_JWS_ALGORITHM, oidcSettings.getPreferredJwsAlgorithm());
    }
  }
}
