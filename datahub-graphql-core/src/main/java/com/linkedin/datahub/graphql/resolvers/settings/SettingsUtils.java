package com.linkedin.datahub.graphql.resolvers.settings;

import com.datahub.authentication.Authentication;
import com.google.common.collect.ImmutableSet;
import com.linkedin.datahub.graphql.QueryContext;
import com.linkedin.datahub.graphql.generated.GlobalIntegrationSettings;
import com.linkedin.datahub.graphql.generated.GlobalNotificationSettings;
import com.linkedin.datahub.graphql.generated.GlobalSettings;
import com.linkedin.datahub.graphql.generated.NotificationScenarioType;
import com.linkedin.datahub.graphql.generated.NotificationSetting;
import com.linkedin.datahub.graphql.generated.NotificationSettingValue;
import com.linkedin.datahub.graphql.generated.SlackIntegrationSettings;
import com.linkedin.datahub.graphql.types.common.mappers.StringMapMapper;
import com.linkedin.entity.EntityResponse;
import com.linkedin.entity.client.EntityClient;
import com.linkedin.metadata.Constants;
import com.linkedin.metadata.authorization.PoliciesConfig;
import com.linkedin.settings.NotificationSettingMap;
import com.linkedin.settings.global.GlobalSettingsInfo;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import javax.annotation.Nonnull;

import static com.linkedin.datahub.graphql.authorization.AuthorizationUtils.*;


/**
 * Utility functions useful for Settings resolvers.
 */
public class SettingsUtils {

  /**
   * Returns true if the authenticated user is able to manage global settings.
   */
  public static boolean canManageGlobalSettings(@Nonnull QueryContext context) {
    return isAuthorized(context, Optional.empty(), PoliciesConfig.MANAGE_GLOBAL_SETTINGS);
  }

  public static GlobalSettingsInfo getGlobalSettings(final EntityClient entityClient, final Authentication authentication) {
    try {
      final EntityResponse entityResponse =
          entityClient.getV2(Constants.GLOBAL_SETTINGS_ENTITY_NAME, Constants.GLOBAL_SETTINGS_URN, ImmutableSet.of(Constants.GLOBAL_SETTINGS_INFO_ASPECT_NAME),
              authentication);

      if (entityResponse == null || !entityResponse.getAspects().containsKey(Constants.GLOBAL_SETTINGS_INFO_ASPECT_NAME)) {
        throw new RuntimeException("Failed to retrieve global settings! Global settings not found, but are required.");
      }

      return new GlobalSettingsInfo(entityResponse.getAspects()
          .get(Constants.GLOBAL_SETTINGS_INFO_ASPECT_NAME)
          .getValue()
          .data());
    } catch (Exception e) {
        throw new RuntimeException("Failed to retrieve global settings!", e);
    }
  }

  /**
   * Maps GMS settings into GraphQL global settings.
   */
  public static GlobalSettings mapGlobalSettings(@Nonnull GlobalSettingsInfo input) {
    final GlobalSettings result = new GlobalSettings();
    result.setIntegrationSettings(mapGlobalIntegrationSettings(input.getIntegrations()));
    result.setNotificationSettings(mapGlobalNotificationSettings(input.getNotifications()));
    return result;
  }

  private static GlobalIntegrationSettings mapGlobalIntegrationSettings(@Nonnull com.linkedin.settings.global.GlobalIntegrationSettings input) {
    final GlobalIntegrationSettings result = new GlobalIntegrationSettings();
    if (input.hasSlackSettings()) {
      result.setSlackSettings(mapSlackIntegrationSettings(input.getSlackSettings()));
    }
    return result;
  }

  private static SlackIntegrationSettings mapSlackIntegrationSettings(@Nonnull com.linkedin.settings.global.SlackIntegrationSettings input) {
    final SlackIntegrationSettings result = new SlackIntegrationSettings();
    result.setEnabled(input.isEnabled());
    if (input.hasDefaultChannelName()) {
      result.setDefaultChannelName(input.getDefaultChannelName());
    }
    return result;
  }

  private static GlobalNotificationSettings mapGlobalNotificationSettings(@Nonnull com.linkedin.settings.global.GlobalNotificationSettings input) {
    final GlobalNotificationSettings result = new GlobalNotificationSettings();
    if (input.hasSettings()) {
      result.setSettings(mapNotificationSettings(input.getSettings()));
    } else {
      result.setSettings(Collections.emptyList());
    }
    return result;
  }

  private static List<NotificationSetting> mapNotificationSettings(NotificationSettingMap settings) {
    final List<NotificationSetting> result = new ArrayList<>();
    settings.forEach((key, value) -> result.add(mapNotificationSetting(key, value)));
    return result;
  }

  private static NotificationSetting mapNotificationSetting(String typeStr, com.linkedin.settings.NotificationSetting setting) {
    final NotificationSetting result = new NotificationSetting();
    result.setType(NotificationScenarioType.valueOf(typeStr));
    result.setValue(NotificationSettingValue.valueOf(setting.getValue().name()));
    if (setting.hasParams()) {
      result.setParams(StringMapMapper.map(setting.getParams()));
    }
    return result;
  }

  private SettingsUtils() { }
}

