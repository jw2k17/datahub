package com.linkedin.metadata.timeseries;

import com.fasterxml.jackson.databind.JsonNode;
import com.linkedin.metadata.aspect.EnvelopedAspect;
import com.linkedin.metadata.query.Filter;
import java.util.List;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;


public interface TimeseriesAspectService {

  void configure();

  void upsertDocument(@Nonnull String entityName, @Nonnull String aspectName, @Nonnull JsonNode document);

  List<EnvelopedAspect> getAspect(@Nonnull String entityName, @Nonnull String aspectName, @Nullable Filter filter,
      @Nullable Long limit);
}
