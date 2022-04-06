package com.linkedin.metadata.search.ranker;

import com.google.common.collect.ImmutableList;
import com.linkedin.metadata.search.SearchEntity;
import com.linkedin.metadata.search.features.FeatureExtractor;
import com.linkedin.metadata.search.features.Features;
import java.util.List;
import java.util.Optional;
import org.apache.commons.lang3.tuple.Pair;


/**
 * Simple ranker that diversifies the results between different entities. For the same entity, returns the same order from elasticsearch
 */
public class SimpleRanker extends SearchRanker<Pair<Double, Double>> {

  private final List<FeatureExtractor> featureExtractors;

  public SimpleRanker() {
    featureExtractors = ImmutableList.of();
  }

  @Override
  public List<FeatureExtractor> getFeatureExtractors() {
    return featureExtractors;
  }

  @Override
  public Pair<Double, Double> score(SearchEntity searchEntity) {
    Features features = Features.from(searchEntity.getFeatures());
    return Pair.of(Optional.ofNullable(searchEntity.getScore()).orElse(0.0),
        -features.getNumericFeature(Features.Name.RANK_WITHIN_TYPE, 0.0));
  }
}
