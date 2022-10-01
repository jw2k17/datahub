package com.datahub.plugins.auth.authorization;

import com.datahub.plugins.auth.authentication.Authenticator;
import com.datahub.plugins.auth.authentication.AuthenticatorContext;
import java.util.Map;
import javax.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Data;


/**
 * Context provided to an Authorizer on initialization.
 * DataHub creates {@link AuthenticatorContext} instance and pass it as an argument to init method of {@link Authenticator}
 */
@Data
@AllArgsConstructor
public class AuthorizerContext {
  private final Map<String, Object> contextMap;

  /**
   * A utility for resolving a {@link ResourceSpec} to resolved resource field values.
   */
  private ResourceSpecResolver resourceSpecResolver;
  /**
   *
   * @return contextMap   The contextMap contains below key and value
   *                      PLUGIN_DIRECTORY: Directory path where plugin is installed i.e. PLUGIN_HOME
   */
  @Nonnull
  public Map<String, Object> data() {
    return contextMap;
  }
}
