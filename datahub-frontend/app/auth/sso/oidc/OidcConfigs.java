package auth.sso.oidc;

import auth.sso.SsoConfigs;
import java.util.Objects;
import java.util.Optional;
import lombok.Getter;

import static auth.AuthUtils.*;
import static auth.ConfigUtil.*;


/**
 * Class responsible for extracting and validating OIDC related configurations.
 */
@Getter
public class OidcConfigs extends SsoConfigs {

    /**
     * Required configs
     */
    public static final String OIDC_CLIENT_ID_CONFIG_PATH = "auth.oidc.clientId";
    public static final String OIDC_CLIENT_SECRET_CONFIG_PATH = "auth.oidc.clientSecret";
    public static final String OIDC_DISCOVERY_URI_CONFIG_PATH = "auth.oidc.discoveryUri";

    /**
     * Optional configs
     */
    public static final String OIDC_USERNAME_CLAIM_CONFIG_PATH = "auth.oidc.userNameClaim";
    public static final String OIDC_USERNAME_CLAIM_REGEX_CONFIG_PATH = "auth.oidc.userNameClaimRegex";
    public static final String OIDC_SCOPE_CONFIG_PATH = "auth.oidc.scope";
    public static final String OIDC_CLIENT_NAME_CONFIG_PATH = "auth.oidc.clientName";
    public static final String OIDC_CLIENT_AUTHENTICATION_METHOD_CONFIG_PATH = "auth.oidc.clientAuthenticationMethod";
    public static final String OIDC_JIT_PROVISIONING_ENABLED_CONFIG_PATH = "auth.oidc.jitProvisioningEnabled";
    public static final String OIDC_PRE_PROVISIONING_REQUIRED_CONFIG_PATH = "auth.oidc.preProvisioningRequired";
    public static final String OIDC_EXTRACT_GROUPS_ENABLED = "auth.oidc.extractGroupsEnabled";
    public static final String OIDC_GROUPS_CLAIM_CONFIG_PATH_CONFIG_PATH = "auth.oidc.groupsClaim"; // Claim expected to be an array of group names.
    public static final String OIDC_RESPONSE_TYPE = "auth.oidc.responseType";
    public static final String OIDC_RESPONSE_MODE = "auth.oidc.responseMode";
    public static final String OIDC_USE_NONCE = "auth.oidc.useNonce";
    public static final String OIDC_CUSTOM_PARAM_RESOURCE = "auth.oidc.customParam.resource";
    public static final String OIDC_READ_TIMEOUT = "auth.oidc.readTimeout";
    public static final String OIDC_EXTRACT_JWT_ACCESS_TOKEN_CLAIMS = "auth.oidc.extractJwtAccessTokenClaims";

    /**
     * Default values
     */
    private static final String DEFAULT_OIDC_USERNAME_CLAIM = "preferred_username";
    private static final String DEFAULT_OIDC_USERNAME_CLAIM_REGEX = "(.*)";
    private static final String DEFAULT_OIDC_SCOPE = "openid profile email";
        // Often "group" must be included for groups.
    private static final String DEFAULT_OIDC_CLIENT_NAME = "oidc";
    private static final String DEFAULT_OIDC_CLIENT_AUTHENTICATION_METHOD = "client_secret_basic";
    private static final String DEFAULT_OIDC_JIT_PROVISIONING_ENABLED = "true";
    private static final String DEFAULT_OIDC_PRE_PROVISIONING_REQUIRED = "false";
    private static final String DEFAULT_OIDC_EXTRACT_GROUPS_ENABLED = "false";
        // False since extraction of groups can overwrite existing group membership.
    private static final String DEFAULT_OIDC_GROUPS_CLAIM = "groups";
    private static final String DEFAULT_OIDC_READ_TIMEOUT = "5000";

    private String clientId;
    private String clientSecret;
    private String discoveryUri;
    private String userNameClaim;
    private String userNameClaimRegex;
    private String scope;
    private String clientName;
    private String clientAuthenticationMethod;
    private boolean jitProvisioningEnabled;
    private boolean preProvisioningRequired;
    private boolean extractGroupsEnabled;
    private String groupsClaimName;
    private Optional<String> responseType;
    private Optional<String> responseMode;
    private Optional<Boolean> useNonce;
    private Optional<String> customParamResource;
    private String readTimeout;
    private Optional<Boolean> extractJwtAccessTokenClaims;

    public OidcConfigs(Builder builder) {
        super(builder);
        this.clientId = builder.clientId;
        this.clientSecret = builder.clientSecret;
        this.discoveryUri = builder.discoveryUri;
        this.userNameClaim = builder.userNameClaim;
        this.userNameClaimRegex = builder.userNameClaimRegex;
        this.scope = builder.scope;
        this.clientName = builder.clientName;
        this.clientAuthenticationMethod = builder.clientAuthenticationMethod;
        this.jitProvisioningEnabled = builder.jitProvisioningEnabled;
        this.preProvisioningRequired = builder.preProvisioningRequired;
        this.extractGroupsEnabled = builder.extractGroupsEnabled;
        this.groupsClaimName = builder.groupsClaimName;
        this.responseType = builder.responseType;
        this.responseMode = builder.responseMode;
        this.useNonce = builder.useNonce;
        this.customParamResource = builder.customParamResource;
        this.readTimeout = builder.readTimeout;
        this.extractJwtAccessTokenClaims = builder.extractJwtAccessTokenClaims;
    }

    public static class Builder extends SsoConfigs.Builder<Builder> {
        private String clientId;
        private String clientSecret;
        private String discoveryUri;
        private String userNameClaim = DEFAULT_OIDC_USERNAME_CLAIM;
        private String userNameClaimRegex = DEFAULT_OIDC_USERNAME_CLAIM_REGEX;
        private String scope = DEFAULT_OIDC_SCOPE;
        private String clientName = DEFAULT_OIDC_CLIENT_NAME;
        private String clientAuthenticationMethod = DEFAULT_OIDC_CLIENT_AUTHENTICATION_METHOD;
        private boolean jitProvisioningEnabled = Boolean.parseBoolean(DEFAULT_OIDC_JIT_PROVISIONING_ENABLED);
        private boolean preProvisioningRequired = Boolean.parseBoolean(DEFAULT_OIDC_PRE_PROVISIONING_REQUIRED);
        private boolean extractGroupsEnabled = Boolean.parseBoolean(DEFAULT_OIDC_EXTRACT_GROUPS_ENABLED);
        private String groupsClaimName = DEFAULT_OIDC_GROUPS_CLAIM;
        private Optional<String> responseType = Optional.empty();
        private Optional<String> responseMode = Optional.empty();
        private Optional<Boolean> useNonce = Optional.empty();
        private Optional<String> customParamResource = Optional.empty();
        private String readTimeout = DEFAULT_OIDC_READ_TIMEOUT;
        private Optional<Boolean> extractJwtAccessTokenClaims = Optional.empty();

        public Builder from(final com.typesafe.config.Config configs) {
            super.from(configs);
            clientId = getRequired(configs, OIDC_CLIENT_ID_CONFIG_PATH);
            clientSecret = getRequired(configs, OIDC_CLIENT_SECRET_CONFIG_PATH);
            discoveryUri = getRequired(configs, OIDC_DISCOVERY_URI_CONFIG_PATH);
            userNameClaim = getOptional(configs, OIDC_USERNAME_CLAIM_CONFIG_PATH, DEFAULT_OIDC_USERNAME_CLAIM);
            userNameClaimRegex =
                getOptional(configs, OIDC_USERNAME_CLAIM_REGEX_CONFIG_PATH, DEFAULT_OIDC_USERNAME_CLAIM_REGEX);
            scope = getOptional(configs, OIDC_SCOPE_CONFIG_PATH, DEFAULT_OIDC_SCOPE);
            clientName = getOptional(configs, OIDC_CLIENT_NAME_CONFIG_PATH, DEFAULT_OIDC_CLIENT_NAME);
            clientAuthenticationMethod = getOptional(configs, OIDC_CLIENT_AUTHENTICATION_METHOD_CONFIG_PATH,
                DEFAULT_OIDC_CLIENT_AUTHENTICATION_METHOD);
            jitProvisioningEnabled = Boolean.parseBoolean(
                getOptional(configs, OIDC_JIT_PROVISIONING_ENABLED_CONFIG_PATH, DEFAULT_OIDC_JIT_PROVISIONING_ENABLED));
            preProvisioningRequired = Boolean.parseBoolean(
                getOptional(configs, OIDC_PRE_PROVISIONING_REQUIRED_CONFIG_PATH,
                    DEFAULT_OIDC_PRE_PROVISIONING_REQUIRED));
            extractGroupsEnabled = Boolean.parseBoolean(
                getOptional(configs, OIDC_EXTRACT_GROUPS_ENABLED, DEFAULT_OIDC_EXTRACT_GROUPS_ENABLED));
            groupsClaimName =
                getOptional(configs, OIDC_GROUPS_CLAIM_CONFIG_PATH_CONFIG_PATH, DEFAULT_OIDC_GROUPS_CLAIM);
            responseType = getOptional(configs, OIDC_RESPONSE_TYPE);
            responseMode = getOptional(configs, OIDC_RESPONSE_MODE);
            useNonce = getOptional(configs, OIDC_USE_NONCE).map(Boolean::parseBoolean);
            customParamResource = getOptional(configs, OIDC_CUSTOM_PARAM_RESOURCE);
            readTimeout = getOptional(configs, OIDC_READ_TIMEOUT, DEFAULT_OIDC_READ_TIMEOUT);
            extractJwtAccessTokenClaims =
                getOptional(configs, OIDC_EXTRACT_JWT_ACCESS_TOKEN_CLAIMS).map(Boolean::parseBoolean);
            return this;
        }

        public Builder from(final String ssoSettingsJsonStr) {
            super.from(ssoSettingsJsonStr);
            if (jsonNode.has(CLIENT_ID)) {
                clientId = jsonNode.get(CLIENT_ID).asText();
            }
            if (jsonNode.has(CLIENT_SECRET)) {
                clientSecret = jsonNode.get(CLIENT_SECRET).asText();
            }
            if (jsonNode.has(DISCOVERY_URI)) {
                discoveryUri = jsonNode.get(DISCOVERY_URI).asText();
            }
            if (jsonNode.has(USER_NAME_CLAIM)) {
                userNameClaim = jsonNode.get(USER_NAME_CLAIM).asText();
            }
            if (jsonNode.has(USER_NAME_CLAIM_REGEX)) {
                userNameClaimRegex = jsonNode.get(USER_NAME_CLAIM_REGEX).asText();
            }
            if (jsonNode.has(SCOPE)) {
                scope = jsonNode.get(SCOPE).asText();
            }
            if (jsonNode.has(CLIENT_NAME)) {
                clientName = jsonNode.get(CLIENT_NAME).asText();
            }
            if (jsonNode.has(CLIENT_AUTHENTICATION_METHOD)) {
                clientAuthenticationMethod = jsonNode.get(CLIENT_AUTHENTICATION_METHOD).asText();
            }
            if (jsonNode.has(JIT_PROVISIONING_ENABLED)) {
                jitProvisioningEnabled = jsonNode.get(JIT_PROVISIONING_ENABLED).asBoolean();
            }
            if (jsonNode.has(PRE_PROVISIONING_REQUIRED)) {
                preProvisioningRequired = jsonNode.get(PRE_PROVISIONING_REQUIRED).asBoolean();
            }
            if (jsonNode.has(EXTRACT_GROUPS_ENABLED)) {
                extractGroupsEnabled = jsonNode.get(EXTRACT_GROUPS_ENABLED).asBoolean();
            }
            if (jsonNode.has(GROUPS_CLAIM)) {
                groupsClaimName = jsonNode.get(GROUPS_CLAIM).asText();
            }
            if (jsonNode.has(RESPONSE_TYPE)) {
                responseType = Optional.of(jsonNode.get(RESPONSE_TYPE).asText());
            }
            if (jsonNode.has(RESPONSE_MODE)) {
                responseMode = Optional.of(jsonNode.get(RESPONSE_MODE).asText());
            }
            if (jsonNode.has(USE_NONCE)) {
                useNonce = Optional.of(jsonNode.get(USE_NONCE).asBoolean());
            }
            if (jsonNode.has(READ_TIMEOUT)) {
                readTimeout = jsonNode.get(READ_TIMEOUT).asText();
            }
            if (jsonNode.has(EXTRACT_JWT_ACCESS_TOKEN_CLAIMS)) {
                extractJwtAccessTokenClaims = Optional.of(jsonNode.get(EXTRACT_JWT_ACCESS_TOKEN_CLAIMS).asBoolean());
            }

            return this;
        }

        public OidcConfigs build() {
            Objects.requireNonNull(_oidcEnabled, "oidcEnabled is required");
            Objects.requireNonNull(clientId, "clientId is required");
            Objects.requireNonNull(clientSecret, "clientSecret is required");
            Objects.requireNonNull(discoveryUri, "discoveryUri is required");

            return new OidcConfigs(this);
        }
    }
}
