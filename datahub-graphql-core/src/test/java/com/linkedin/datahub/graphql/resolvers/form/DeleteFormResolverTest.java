package com.linkedin.datahub.graphql.resolvers.form;

import static com.linkedin.datahub.graphql.TestUtils.getMockAllowContext;
import static com.linkedin.datahub.graphql.TestUtils.getMockDenyContext;
import static org.mockito.ArgumentMatchers.any;
import static org.testng.Assert.assertThrows;
import static org.testng.Assert.assertTrue;

import com.linkedin.common.urn.UrnUtils;
import com.linkedin.datahub.graphql.QueryContext;
import com.linkedin.datahub.graphql.generated.DeleteFormInput;
import com.linkedin.entity.client.EntityClient;
import com.linkedin.r2.RemoteInvocationException;
import graphql.schema.DataFetchingEnvironment;
import java.util.concurrent.CompletionException;
import org.mockito.Mockito;
import org.testng.annotations.Test;

public class DeleteFormResolverTest {
  private static final String TEST_FORM_URN = "urn:li:form:1";

  private static final DeleteFormInput TEST_INPUT = new DeleteFormInput(TEST_FORM_URN);

  @Test
  public void testGetSuccess() throws Exception {
    EntityClient mockEntityClient = initMockEntityClient(true);
    DeleteFormResolver resolver = new DeleteFormResolver(mockEntityClient);

    // Execute resolver
    QueryContext mockContext = getMockAllowContext();
    DataFetchingEnvironment mockEnv = Mockito.mock(DataFetchingEnvironment.class);
    Mockito.when(mockEnv.getArgument(Mockito.eq("input"))).thenReturn(TEST_INPUT);
    Mockito.when(mockEnv.getContext()).thenReturn(mockContext);

    Boolean success = resolver.get(mockEnv).get();
    assertTrue(success);

    // Validate that we called delete
    Mockito.verify(mockEntityClient, Mockito.times(1))
        .deleteEntity(any(), Mockito.eq(UrnUtils.getUrn(TEST_FORM_URN)));
  }

  @Test
  public void testGetUnauthorized() throws Exception {
    EntityClient mockEntityClient = initMockEntityClient(true);
    DeleteFormResolver resolver = new DeleteFormResolver(mockEntityClient);

    // Execute resolver
    QueryContext mockContext = getMockDenyContext();
    DataFetchingEnvironment mockEnv = Mockito.mock(DataFetchingEnvironment.class);
    Mockito.when(mockEnv.getArgument(Mockito.eq("input"))).thenReturn(TEST_INPUT);
    Mockito.when(mockEnv.getContext()).thenReturn(mockContext);

    assertThrows(CompletionException.class, () -> resolver.get(mockEnv).join());

    // Validate that we did NOT call delete and delete references
    Mockito.verify(mockEntityClient, Mockito.times(0))
        .deleteEntity(any(), Mockito.eq(UrnUtils.getUrn(TEST_FORM_URN)));
    Mockito.verify(mockEntityClient, Mockito.times(0))
        .deleteEntityReferences(any(), Mockito.eq(UrnUtils.getUrn(TEST_FORM_URN)));
  }

  @Test
  public void testGetFailure() throws Exception {
    EntityClient mockEntityClient = initMockEntityClient(false);
    DeleteFormResolver resolver = new DeleteFormResolver(mockEntityClient);

    // Execute resolver
    QueryContext mockContext = getMockAllowContext();
    DataFetchingEnvironment mockEnv = Mockito.mock(DataFetchingEnvironment.class);
    Mockito.when(mockEnv.getArgument(Mockito.eq("input"))).thenReturn(TEST_INPUT);
    Mockito.when(mockEnv.getContext()).thenReturn(mockContext);

    assertThrows(CompletionException.class, () -> resolver.get(mockEnv).join());

    // Validate that deleteEntity was called, but since it failed, delete references was not called
    Mockito.verify(mockEntityClient, Mockito.times(1))
        .deleteEntity(any(), Mockito.eq(UrnUtils.getUrn(TEST_FORM_URN)));
    Mockito.verify(mockEntityClient, Mockito.times(0))
        .deleteEntityReferences(any(), Mockito.eq(UrnUtils.getUrn(TEST_FORM_URN)));
  }

  private EntityClient initMockEntityClient(boolean shouldSucceed) throws Exception {
    EntityClient client = Mockito.mock(EntityClient.class);
    if (!shouldSucceed) {
      Mockito.doThrow(new RemoteInvocationException()).when(client).deleteEntity(any(), any());
    }
    return client;
  }
}
