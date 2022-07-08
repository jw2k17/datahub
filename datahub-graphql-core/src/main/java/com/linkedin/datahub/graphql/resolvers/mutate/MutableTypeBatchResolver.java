package com.linkedin.datahub.graphql.resolvers.mutate;

import com.codahale.metrics.Timer;
import com.linkedin.datahub.graphql.exception.AuthorizationException;
import com.linkedin.datahub.graphql.types.MutableType;
import com.linkedin.metadata.utils.metrics.MetricUtils;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.linkedin.datahub.graphql.resolvers.ResolverUtils.*;


/**
 * Generic GraphQL resolver responsible for performing updates against particular types.
 *
 * @param <I> the generated GraphQL POJO corresponding to the input type.
 * @param <T> the generated GraphQL POJO corresponding to the return type.
 */
public class MutableTypeBatchResolver<I, T> implements DataFetcher<CompletableFuture<List<T>>> {

  private static final Logger _logger = LoggerFactory.getLogger(MutableTypeBatchResolver.class.getName());

  private final MutableType<I, T> _mutableType;

  public MutableTypeBatchResolver(final MutableType<I, T> mutableType) {
    _mutableType = mutableType;
  }

  @Override
  public CompletableFuture<List<T>> get(DataFetchingEnvironment environment) throws Exception {
    final String[] urns = bindArgument(environment.getArgument("urns"), String[].class);
    final I[] inputs = bindArgument(environment.getArgument("inputs"), _mutableType.arrayInputClass());

    if (urns.length != inputs.length) {
      throw new IllegalArgumentException("Batch updates must contain as many URNs as inputs.");
    }

    return CompletableFuture.supplyAsync(() -> {
      Timer.Context timer = MetricUtils.timer(this.getClass(), "batchMutate").time();

      try {
        return _mutableType.batchUpdate(urns, inputs, environment.getContext());
      } catch (AuthorizationException e) {
        throw e;
      } catch (Exception e) {
        _logger.error("Failed to perform batchUpdate", e);
        throw new IllegalArgumentException(e);
      } finally {
        timer.stop();
      }
    });
  }
}
