package com.linkedin.datahub.graphql.featureflags;

import com.linkedin.metadata.config.PreProcessHooks;
import lombok.Data;


@Data
public class FeatureFlags {
  private boolean showSimplifiedHomepageByDefault = false;
  private boolean lineageSearchCacheEnabled = false;
  private boolean pointInTimeCreationEnabled = false;
  private boolean alwaysEmitChangeLog = false;
  private boolean readOnlyModeEnabled = false;
  private PreProcessHooks preProcessHooks;
}
