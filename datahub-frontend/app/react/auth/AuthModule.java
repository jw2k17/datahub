package react.auth;

import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;
import org.pac4j.core.client.Client;
import org.pac4j.core.client.Clients;
import org.pac4j.core.config.Config;
import org.pac4j.core.context.session.SessionStore;
import org.pac4j.play.http.PlayHttpActionAdapter;
import org.pac4j.play.store.PlayCookieSessionStore;
import org.pac4j.play.store.PlaySessionStore;
import play.Environment;

import java.util.ArrayList;
import java.util.List;

import static react.auth.OidcConfigs.*;


/**
 * Responsible for configuring, validating, and providing authentication related components.
 */
public class AuthModule extends AbstractModule {

    private final com.typesafe.config.Config _configs;

    public AuthModule(final Environment environment, final com.typesafe.config.Config configs) {
        _configs = configs;
        initSsoManager(configs);
    }

    private void initSsoManager(com.typesafe.config.Config configs) {
        if (isSsoEnabled(configs)) {
            SsoConfigs ssoConfigs = new SsoConfigs(configs);
            if (ssoConfigs.isOidcEnabled()) {
                // Register OIDC Provider, add to list of managers.
                OidcConfigs oidcConfigs = new OidcConfigs(configs);
                OidcProvider oidcProvider = new OidcProvider(oidcConfigs);
                // Set the default SSO provider to this OIDC client.
                SsoManager.instance().setSsoProvider(oidcProvider);
            }
        }
    }

    @Override
    protected void configure() {
        final PlayCookieSessionStore playCacheCookieStore = new PlayCookieSessionStore();
        bind(SessionStore.class).toInstance(playCacheCookieStore);
        bind(PlaySessionStore.class).toInstance(playCacheCookieStore);

        // Configure Oidc Callback Controller
        final OidcCallbackController oidcController = new OidcCallbackController(SsoManager.instance());
        bind(OidcCallbackController.class).toInstance(oidcController);
    }

    @Provides @Singleton
    protected Config provideConfig() {
        if (SsoManager.instance().isSsoEnabled()) {
            final Clients clients = new Clients();
            final List<Client> clientList = new ArrayList<>();
            clientList.add(SsoManager.instance().getSsoProvider().getClient());
            clients.setClients(clientList);
            final Config config = new Config(clients);
            config.setHttpActionAdapter(new PlayHttpActionAdapter());
            return config;
        }
        return new Config();
    }

    @Provides @Singleton
    protected SsoManager provideSsoManager() {
        return SsoManager.instance();
    }

    protected boolean isSsoEnabled(com.typesafe.config.Config configs) {
        // If OIDC is enabled, we infer SSO to be enabled.
        return configs.hasPath(OIDC_ENABLED_CONFIG_PATH)
            && Boolean.TRUE.equals(
            Boolean.parseBoolean(configs.getString(OIDC_ENABLED_CONFIG_PATH)));
    }
}

