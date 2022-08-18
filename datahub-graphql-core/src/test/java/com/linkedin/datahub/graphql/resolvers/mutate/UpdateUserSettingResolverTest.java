package com.linkedin.datahub.graphql.resolvers.mutate;

import com.datahub.authentication.Authentication;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import com.linkedin.common.AuditStamp;
import com.linkedin.common.urn.Urn;
import com.linkedin.datahub.graphql.QueryContext;
import com.linkedin.datahub.graphql.generated.UpdateUserSettingsInput;
import com.linkedin.datahub.graphql.generated.UserSetting;
import com.linkedin.entity.Aspect;
import com.linkedin.entity.EntityResponse;
import com.linkedin.entity.EnvelopedAspect;
import com.linkedin.entity.EnvelopedAspectMap;
import com.linkedin.entity.client.EntityClient;
import com.linkedin.events.metadata.ChangeType;
import com.linkedin.identity.CorpUserSettings;
import com.linkedin.metadata.Constants;
import com.linkedin.metadata.entity.EntityService;
import com.linkedin.metadata.utils.GenericRecordUtils;
import com.linkedin.mxe.MetadataChangeProposal;
import graphql.schema.DataFetchingEnvironment;
import java.util.HashSet;
import org.mockito.Mockito;
import org.testng.annotations.Test;

import static com.linkedin.datahub.graphql.TestUtils.*;


public class UpdateUserSettingResolverTest {

  private static final String TEST_USER_URN = "urn:li:corpuser:test";
  @Test
  public void testGetSuccessExistingDomains() throws Exception {
    EntityService mockService = Mockito.mock(EntityService.class);
    Mockito.when(mockService.exists(Urn.createFromString(TEST_USER_URN))).thenReturn(true);

    UpdateUserSettingResolver resolver = new UpdateUserSettingResolver(mockService);

    // Execute resolver
    QueryContext mockContext = getMockAllowContext();
    DataFetchingEnvironment mockEnv = Mockito.mock(DataFetchingEnvironment.class);
    UpdateUserSettingsInput input = new UpdateUserSettingsInput();
    input.setName(UserSetting.SHOW_SIMPLIFIED_HOMEPAGE);
    input.setValue(true);
    Mockito.when(mockEnv.getArgument(Mockito.eq("input"))).thenReturn(input);
    Mockito.when(mockEnv.getContext()).thenReturn(mockContext);
    resolver.get(mockEnv).get();

    CorpUserSettings newSettings = new CorpUserSettings().setShowSimplifiedHomepage(true);
    final MetadataChangeProposal proposal = new MetadataChangeProposal();
    proposal.setEntityUrn(Urn.createFromString(TEST_USER_URN));
    proposal.setEntityType(Constants.CORP_USER_ENTITY_NAME);
    proposal.setAspectName(Constants.CORP_USER_SETTINGS_ASPECT_NAME);
    proposal.setAspect(GenericRecordUtils.serializeAspect(newSettings));
    proposal.setChangeType(ChangeType.UPSERT);

    Mockito.verify(mockService, Mockito.times(1)).ingestProposal(
        Mockito.eq(proposal),
        Mockito.any(AuditStamp.class)
    );
  }
}
