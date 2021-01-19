
package graphql.resolvers.mutation;

import com.linkedin.common.urn.CorpuserUrn;
import com.linkedin.datahub.graphql.generated.CorpUser;
import com.linkedin.datahub.graphql.loaders.CorpUserLoader;
import com.linkedin.datahub.graphql.mappers.CorpUserMapper;
import graphql.PlayQueryContext;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import org.apache.commons.lang3.StringUtils;
import org.dataloader.DataLoader;
import play.Logger;
import security.AuthUtil;
import security.AuthenticationManager;

import javax.naming.AuthenticationException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.CompletableFuture;

/**
 * Resolver responsible for authenticating a user
 */
public class LogInResolver implements DataFetcher<CompletableFuture<CorpUser>> {

    @Override
    public CompletableFuture<CorpUser> get(DataFetchingEnvironment environment) throws Exception {
        /*
            Extract arguments
         */
        final String username = environment.getArgument("username");
        final String password = environment.getArgument("password");

        if (StringUtils.isBlank(username)) {
            throw new RuntimeException("username must not be empty");
        }

        PlayQueryContext context = environment.getContext();
        context.getSession().clear();

        // Create a uuid string for this session if one doesn't already exist
        String uuid = context.getSession().get("uuid");
        if (uuid == null) {
            uuid = java.util.UUID.randomUUID().toString();
            context.getSession().put("uuid", uuid);
        }

        try {
            AuthenticationManager.authenticateUser(username, password);
        } catch (AuthenticationException e) {
            Logger.warn("Failed to authenticate user " + username, e);
            throw new RuntimeException("Invalid username or password provided.");
        }

        context.getSession().put("user", username);

        String secretKey = context.getAppConfig().getString("play.http.secret.key");
        try {
            // store hashed username within PLAY_SESSION cookie
            String hashedUserName = AuthUtil.generateHash(username, secretKey.getBytes());
            context.getSession().put("auth_token", hashedUserName);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            Logger.error("Failed to hash username", e);
        }

        /*
            Fetch the latest version of the logged in user. (via CorpUser entity)
         */
        final DataLoader<String, com.linkedin.identity.CorpUser> userLoader = environment.getDataLoader(CorpUserLoader.NAME);
        return userLoader.load(new CorpuserUrn(username).toString())
                .thenApply(CorpUserMapper::map);
    }
}