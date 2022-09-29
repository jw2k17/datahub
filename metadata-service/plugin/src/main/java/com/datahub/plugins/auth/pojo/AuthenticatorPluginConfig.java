package com.datahub.plugins.auth.pojo;

import com.datahub.plugins.common.PluginType;
import java.nio.file.Path;
import java.util.Map;
import java.util.Optional;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class AuthenticatorPluginConfig extends AuthPluginConfig {
  public AuthenticatorPluginConfig(String name, Boolean enabled, String className, Path pluginDirectory,
      Path pluginJar, Optional<Map<String, Object>> configs) {
    super(PluginType.AUTHENTICATOR, name, enabled, className, pluginDirectory, pluginJar, configs);
  }
} // currently this class doesn't have any special attributes
