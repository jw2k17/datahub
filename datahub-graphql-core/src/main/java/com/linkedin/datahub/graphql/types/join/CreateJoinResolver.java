package com.linkedin.datahub.graphql.types.join;

import com.datahub.authentication.Authentication;
import com.linkedin.common.urn.CorpuserUrn;
import com.linkedin.common.urn.JoinUrn;
import com.linkedin.common.urn.Urn;
import com.linkedin.datahub.graphql.QueryContext;
import com.linkedin.datahub.graphql.exception.AuthorizationException;
import com.linkedin.datahub.graphql.generated.JoinPropertiesInput;
import com.linkedin.datahub.graphql.generated.JoinUpdateInput;
import com.linkedin.datahub.graphql.types.join.mappers.JoinMapper;
import com.linkedin.datahub.graphql.types.join.mappers.JoinUpdateInputMapper;
import com.linkedin.entity.client.EntityClient;
import com.linkedin.metadata.service.JoinService;
import com.linkedin.mxe.MetadataChangeProposal;
import com.linkedin.r2.RemoteInvocationException;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.concurrent.CompletableFuture;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.linkedin.datahub.graphql.generated.Join;
import org.apache.commons.codec.digest.DigestUtils;

import static com.linkedin.datahub.graphql.resolvers.ResolverUtils.bindArgument;


@Slf4j
@RequiredArgsConstructor
public class CreateJoinResolver implements DataFetcher<CompletableFuture<Join>> {

    private final EntityClient _entityClient;
    private final JoinService _joinService;

    @Override
    public CompletableFuture<Join> get(DataFetchingEnvironment environment) throws Exception {
        final JoinUpdateInput input = bindArgument(environment.getArgument("input"), JoinUpdateInput.class);

        final JoinPropertiesInput joinPropertiesInput = input.getProperties();
        String joinName = joinPropertiesInput.getName();
        String datasetA = joinPropertiesInput.getDataSetA();
        String datasetB = joinPropertiesInput.getDatasetB();

        String lowDataset =  datasetA;
        String highDataset = datasetB;
        if (datasetA.compareTo(datasetB)  > 0) {
            lowDataset = datasetB;
            highDataset = datasetA;
        }
        // The following sequence mimics datahub.emitter.mce_builder.datahub_guid

        String joinKey =
            "{\"DatasetA\":\"" + lowDataset + "\",\"DatasetB\":\"" + highDataset + "\",\"JoinName\":\"" + joinName
                + "\"}";

        byte[] mybytes = joinKey.getBytes(StandardCharsets.UTF_8);

        String joinKeyEncoded = new String(mybytes, StandardCharsets.UTF_8);
        String joinGuid = DigestUtils.md5Hex(joinKeyEncoded);
        log.info("joinkey {}, joinGuid {}", joinKeyEncoded, joinGuid);

        JoinUrn inputUrn = new JoinUrn(joinGuid);
        QueryContext context = environment.getContext();
        final Authentication authentication = context.getAuthentication();
        final CorpuserUrn actor = CorpuserUrn.createFromString(context.getActorUrn());
        if (!JoinType.canCreateJoin(context, Urn.createFromString(input.getProperties().getDataSetA()),
                Urn.createFromString(input.getProperties().getDatasetB()))) {
            throw new AuthorizationException("Unauthorized to create join. Please contact your DataHub administrator.");
        }
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.debug("Create Join input: {}", input);
                final Collection<MetadataChangeProposal> proposals = JoinUpdateInputMapper.map(input, actor);
                proposals.forEach(proposal -> proposal.setEntityUrn(inputUrn));
                try {
                    _entityClient.batchIngestProposals(proposals, context.getAuthentication(), false);
                } catch (RemoteInvocationException e) {
                    throw new RuntimeException("Failed to create join entity", e);
                }
                return JoinMapper.map(_joinService.getJoinResponse(Urn.createFromString(inputUrn.toString()), authentication));
            } catch (Exception e) {
                log.error("Failed to create Join to resource with input {}, {}", input, e.getMessage());
                throw new RuntimeException(String.format("Failed to create join to resource with input %s", input), e);
            }
        });
    }
}
