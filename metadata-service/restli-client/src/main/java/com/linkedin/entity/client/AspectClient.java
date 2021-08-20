package com.linkedin.entity.client;

import com.linkedin.common.client.BaseClient;
import com.linkedin.entity.AspectsDoGetTimeseriesAspectValuesRequestBuilder;
import com.linkedin.entity.AspectsDoIngestProposalRequestBuilder;
import com.linkedin.entity.AspectsGetRequestBuilder;
import com.linkedin.entity.AspectsRequestBuilders;
import com.linkedin.metadata.aspect.EnvelopedAspect;
import com.linkedin.metadata.aspect.VersionedAspect;
import com.linkedin.mxe.MetadataChangeProposal;
import com.linkedin.r2.RemoteInvocationException;
import com.linkedin.restli.client.Client;
import com.linkedin.restli.client.Response;
import java.util.List;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;


public class AspectClient extends BaseClient {

  private static final AspectsRequestBuilders ASPECTS_REQUEST_BUILDERS = new AspectsRequestBuilders();

  public AspectClient(@Nonnull final Client restliClient) {
    super(restliClient);
  }

  /**
   * Gets aspect at veresion for an entity
   *
   * @param urn urn for the entity
   * @return list of paths given urn
   * @throws RemoteInvocationException on remote request error.
   */
  @Nonnull
  public VersionedAspect getAspect(@Nonnull String urn, @Nonnull String aspect, @Nonnull Long version)
      throws RemoteInvocationException {

    AspectsGetRequestBuilder requestBuilder =
        ASPECTS_REQUEST_BUILDERS.get().id(urn).aspectParam(aspect).versionParam(version);

    return sendClientRequest(requestBuilder.build()).getEntity();
  }

  /**
   * Retrieve instances of a particular aspect.
   *
   * @param urn urn for the entity.
   * @param entity the name of the entity.
   * @param aspect the name of the aspect.
   * @param startTimeMillis the earliest desired event time of the aspect value in milliseconds.
   * @param endTimeMillis the latest desired event time of the aspect value in milliseconds.
   * @param limit the maximum number of desired aspect values.
   * @return  the list of EnvelopedAspect values satisfying the input parameters.
   * @throws RemoteInvocationException on remote request error.
   */
  @Nonnull
  public List<EnvelopedAspect> getTimeseriesAspectValues(@Nonnull String urn, @Nonnull String entity,
      @Nonnull String aspect, @Nullable Long startTimeMillis, @Nullable Long endTimeMillis, @Nullable Integer limit)
      throws RemoteInvocationException {

    AspectsDoGetTimeseriesAspectValuesRequestBuilder requestBuilder =
        ASPECTS_REQUEST_BUILDERS.actionGetTimeseriesAspectValues()
            .urnParam(urn)
            .entityParam(entity)
            .aspectParam(aspect);

    if (startTimeMillis != null) {
      requestBuilder.startTimeMillisParam(startTimeMillis);
    }

    if (endTimeMillis != null) {
      requestBuilder.endTimeMillisParam(endTimeMillis);
    }

    if (limit != null) {
      requestBuilder.limitParam(limit);
    }

    return sendClientRequest(requestBuilder.build()).getEntity().getValues();
  }

  /**
   * Ingest a MetadataChangeProposal event.
   */
  public Response<Void> ingestProposal(@Nonnull final MetadataChangeProposal metadataChangeProposal)
      throws RemoteInvocationException {
    final AspectsDoIngestProposalRequestBuilder requestBuilder =
        ASPECTS_REQUEST_BUILDERS.actionIngestProposal().proposalParam(metadataChangeProposal);

    return sendClientRequest(requestBuilder.build());
  }
}
