package com.linkedin.datahub.graphql.resolvers.ingest.source;

import com.datahub.authentication.Authentication;
import com.datahub.authorization.AuthorizationResult;
import com.datahub.authorization.Authorizer;
import com.linkedin.common.urn.Urn;
import com.linkedin.datahub.graphql.QueryContext;
import com.linkedin.datahub.graphql.generated.IngestionSource;
import com.linkedin.datahub.graphql.generated.Secret;
import com.linkedin.ingestion.DataHubIngestionSourceConfig;
import com.linkedin.ingestion.DataHubIngestionSourceInfo;
import com.linkedin.ingestion.DataHubIngestionSourceSchedule;
import com.linkedin.metadata.Constants;
import com.linkedin.secret.DataHubSecretValue;
import org.mockito.Mockito;

import static org.testng.Assert.*;


public class TestUtils {

  public static final Urn TEST_INGESTION_SOURCE_URN = Urn.createFromTuple(Constants.INGESTION_SOURCE_ENTITY_NAME, "test");
  public static final Urn TEST_SECRET_URN = Urn.createFromTuple(Constants.SECRETS_ENTITY_NAME, "TEST_SECRET");

  public static QueryContext getMockAllowContext() {
    QueryContext mockContext = Mockito.mock(QueryContext.class);
    Mockito.when(mockContext.getActorUrn()).thenReturn("urn:li:corpuser:test");

    Authorizer mockAuthorizer = Mockito.mock(Authorizer.class);
    AuthorizationResult result = Mockito.mock(AuthorizationResult.class);
    Mockito.when(result.getType()).thenReturn(AuthorizationResult.Type.ALLOW);
    Mockito.when(mockAuthorizer.authorize(Mockito.any())).thenReturn(result);

    Mockito.when(mockContext.getAuthorizer()).thenReturn(mockAuthorizer);
    Mockito.when(mockContext.getAuthentication()).thenReturn(Mockito.mock(Authentication.class));
    return mockContext;
  }

  public static QueryContext getMockDenyContext() {
    QueryContext mockContext = Mockito.mock(QueryContext.class);
    Mockito.when(mockContext.getActorUrn()).thenReturn("urn:li:corpuser:test");

    Authorizer mockAuthorizer = Mockito.mock(Authorizer.class);
    AuthorizationResult result = Mockito.mock(AuthorizationResult.class);
    Mockito.when(result.getType()).thenReturn(AuthorizationResult.Type.DENY);
    Mockito.when(mockAuthorizer.authorize(Mockito.any())).thenReturn(result);

    Mockito.when(mockContext.getAuthorizer()).thenReturn(mockAuthorizer);
    Mockito.when(mockContext.getAuthentication()).thenReturn(Mockito.mock(Authentication.class));
    return mockContext;
  }

  public static DataHubIngestionSourceInfo getTestIngestionSourceInfo() {
    DataHubIngestionSourceInfo info = new DataHubIngestionSourceInfo();
    info.setName("My Test Source");
    info.setType("mysql");
    info.setSchedule(new DataHubIngestionSourceSchedule().setTimezone("UTC").setInterval("* * * * *"));
    info.setConfig(new DataHubIngestionSourceConfig().setVersion("0.8.18").setRecipe("my recipe").setExecutorId("executor id"));
    return info;
  }

  public static DataHubSecretValue getTestSecretValue() {
    DataHubSecretValue value = new DataHubSecretValue();
    value.setValue("encryptedvalue");
    value.setName(TEST_SECRET_URN.getId());
    return value;
  }

  public static void verifyTestIngestionSourceGraphQL(IngestionSource ingestionSource, DataHubIngestionSourceInfo info) {
    assertEquals(ingestionSource.getUrn(), TEST_INGESTION_SOURCE_URN.toString());
    assertEquals(ingestionSource.getName(), info.getName());
    assertEquals(ingestionSource.getType(), info.getType());
    assertEquals(ingestionSource.getConfig().getRecipe(), info.getConfig().getRecipe());
    assertEquals(ingestionSource.getConfig().getExecutorId(), info.getConfig().getExecutorId());
    assertEquals(ingestionSource.getConfig().getVersion(), info.getConfig().getVersion());
    assertEquals(ingestionSource.getSchedule().getInterval(), info.getSchedule().getInterval());
    assertEquals(ingestionSource.getSchedule().getTimezone(), info.getSchedule().getTimezone());
  }

  public static void verifyTestSecretGraphQL(Secret secret, DataHubSecretValue value) {
    assertEquals(secret.getUrn(), TEST_SECRET_URN.toString());
    assertEquals(secret.getName(), value.getName());
    // Currently we do not return any secret value field.
  }

  private TestUtils() { }
}
