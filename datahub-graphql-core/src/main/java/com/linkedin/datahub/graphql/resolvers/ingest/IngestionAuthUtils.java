package com.linkedin.datahub.graphql.resolvers.ingest;

import com.datahub.authorization.AuthorizationRequest;
import com.datahub.authorization.AuthorizationResult;
import com.datahub.authorization.Authorizer;
import com.google.common.collect.ImmutableList;
import com.linkedin.datahub.graphql.QueryContext;
import com.linkedin.metadata.authorization.PoliciesConfig;
import java.util.List;
import java.util.Optional;
import javax.annotation.Nonnull;


public class IngestionAuthUtils {

  public static boolean canManageIngestion(@Nonnull QueryContext context) {
    final Authorizer authorizer = context.getAuthorizer();
    final String principal = context.getActorUrn();
    return isAuthorized(principal, ImmutableList.of(PoliciesConfig.MANAGE_INGESTION_PRIVILEGE.getType()), authorizer);
  }

  public static boolean canManageSecrets(@Nonnull QueryContext context) {
    final Authorizer authorizer = context.getAuthorizer();
    final String principal = context.getActorUrn();
    return isAuthorized(principal, ImmutableList.of(PoliciesConfig.MANAGE_SECRETS_PRIVILEGE.getType()), authorizer);
  }

  private static boolean isAuthorized(
      String principal,
      List<String> privilegeGroup,
      Authorizer authorizer) {
    for (final String privilege : privilegeGroup) {
      final AuthorizationRequest request = new AuthorizationRequest(principal, privilege, Optional.empty());
      final AuthorizationResult result = authorizer.authorize(request);
      if (AuthorizationResult.Type.DENY.equals(result.getType())) {
        return false;
      }
    }
    return true;
  }

  private IngestionAuthUtils() { }
}
