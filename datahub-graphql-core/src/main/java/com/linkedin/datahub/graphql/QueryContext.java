package com.linkedin.datahub.graphql;

import com.datahub.authentication.Actor;
import com.datahub.authentication.Authentication;
import com.datahub.authorization.Authorizer;


/**
 * Provided as input to GraphQL resolvers; used to carry information about GQL request context.
 */
public interface QueryContext {

    /**
     * Returns true if the current actor is authenticated, false otherwise.
     */
    boolean isAuthenticated();

    /**
     * Returns the {@link com.datahub.authentication.Authentication} associated with the current query context.
     */
    Authentication getAuthentication();

    /**
     * Returns the current authenticated actor, null if there is none.
     */
    default Actor getActor() {
        return getAuthentication().getActor();
    }

    /**
     * Returns the current authenticated actor, null if there is none.
     */
    default String getActorUrn() {
        return getActor().toUrnStr();
    }

    /**
     * Returns the authorizer used to authorize specific actions.
     */
    Authorizer getAuthorizer();
}
