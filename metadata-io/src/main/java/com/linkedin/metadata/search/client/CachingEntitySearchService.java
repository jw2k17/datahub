package com.linkedin.metadata.search.client;

import com.linkedin.metadata.browse.BrowseResult;
import com.linkedin.metadata.query.AutoCompleteResult;
import com.linkedin.metadata.query.SearchFlags;
import com.linkedin.metadata.query.filter.Filter;
import com.linkedin.metadata.query.filter.SortCriterion;
import com.linkedin.metadata.search.EntitySearchService;
import com.linkedin.metadata.search.SearchResult;
import com.linkedin.metadata.search.cache.CacheableSearcher;
import com.linkedin.metadata.utils.metrics.MetricUtils;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.javatuples.Quintet;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import java.util.UUID;


@RequiredArgsConstructor
public class CachingEntitySearchService {
  private static final String ENTITY_SEARCH_SERVICE_SEARCH_CACHE_NAME = "entitySearchServiceSearch";
  private static final String ENTITY_SEARCH_SERVICE_AUTOCOMPLETE_CACHE_NAME = "entitySearchServiceAutoComplete";
  private static final String ENTITY_SEARCH_SERVICE_BROWSE_CACHE_NAME = "entitySearchServiceBrowse";

  private final CacheManager cacheManager;
  private final EntitySearchService entitySearchService; // This is a shared component, also used in search aggregation
  private final int batchSize;
  private final boolean enableCache;

  /**
   * Retrieves cached search results. If the query has been cached, this will return quickly. If not, a full
   * search request will be made.
   *
   * @param entityName the name of the entity to search
   * @param query the search query
   * @param filters the filters to include
   * @param sortCriterion the sort criterion
   * @param from the start offset
   * @param size the count
   * @param flags additional search flags
   *
   * @return a {@link SearchResult} containing the requested batch of search results
   */
  public SearchResult search(
      @Nonnull String entityName,
      @Nonnull String query,
      @Nullable Filter filters,
      @Nullable SortCriterion sortCriterion,
      int from,
      int size,
      @Nullable SearchFlags flags) {
    return getCachedSearchResults(entityName, query, filters, sortCriterion, from, size, flags);
  }

  /**
   * Retrieves cached auto complete results
   *
   * @param entityName the name of the entity to search
   * @param input the input query
   * @param filters the filters to include
   * @param limit the max number of results to return
   * @param flags additional search flags
   *
   * @return a {@link SearchResult} containing the requested batch of search results
   */
  public AutoCompleteResult autoComplete(
      @Nonnull String entityName,
      @Nonnull String input,
      @Nullable String field,
      @Nullable Filter filters,
      int limit,
      @Nullable SearchFlags flags) {
    return getCachedAutoCompleteResults(entityName, input, field, filters, limit, flags);
  }

  /**
   * Retrieves cached auto complete results
   *
   * @param entityName type of entity to query
   * @param path the path to be browsed
   * @param filters the request map with fields and values as filters
   * @param from index of the first entity located in path
   * @param size the max number of entities contained in the response
   *
   * @return a {@link SearchResult} containing the requested batch of search results
   */
  public BrowseResult browse(
      @Nonnull String entityName,
      @Nonnull String path,
      @Nullable Filter filters,
      int from,
      int size,
      @Nullable SearchFlags flags) {
    return getCachedBrowseResults(entityName, path, filters, from, size, flags);
  }



  /**
   * Get search results corresponding to the input "from" and "size"
   * It goes through batches, starting from the beginning, until we get enough results to return
   * This let's us have batches that return a variable number of results (we have no idea which batch the "from" "size" page corresponds to)
   */
  public SearchResult getCachedSearchResults(
      @Nonnull String entityName,
      @Nonnull String query,
      @Nullable Filter filters,
      @Nullable SortCriterion sortCriterion,
      int from,
      int size,
      @Nullable SearchFlags flags) {
    return new CacheableSearcher<>(
        cacheManager.getCache(ENTITY_SEARCH_SERVICE_SEARCH_CACHE_NAME),
        batchSize,
        querySize -> getRawSearchResults(entityName, query, filters, sortCriterion, querySize.getFrom(), querySize.getSize()),
        querySize -> Quintet.with(entityName, query, filters, sortCriterion, querySize), flags, enableCache).getSearchResults(from, size);
  }


  /**
   * Returns cached auto-complete results.
   */
  public AutoCompleteResult getCachedAutoCompleteResults(
      @Nonnull String entityName,
      @Nonnull String input,
      @Nullable String field,
      @Nullable Filter filters,
      int limit,
      @Nullable SearchFlags flags) {
    UUID ignored = MetricUtils.timerStart(this.getClass().getName(), "getCachedAutoCompleteResults");
    try {
      Cache cache = cacheManager.getCache(ENTITY_SEARCH_SERVICE_AUTOCOMPLETE_CACHE_NAME);
      AutoCompleteResult result;
      if (enableCache(flags)) {
        UUID cacheAccess = MetricUtils.timerStart(this.getClass().getName(), "autocomplete_cache_access");
        Object cacheKey = Quintet.with(entityName, input, field, filters, limit);
        result = cache.get(cacheKey, AutoCompleteResult.class);
        MetricUtils.timerStop(cacheAccess, this.getClass().getName(), "autocomplete_cache_access");
        if (result == null) {
          UUID cacheMiss = MetricUtils.timerStart(this.getClass().getName(), "autocomplete_cache_miss");
          result = getRawAutoCompleteResults(entityName, input, field, filters, limit);
          cache.put(cacheKey, result);
          MetricUtils.timerStop(cacheMiss, this.getClass().getName(), "autocomplete_cache_miss");
          MetricUtils.counterInc(this.getClass().getName(), "autocomplete_cache_miss_count");
        }
      } else {
        result = getRawAutoCompleteResults(entityName, input, field, filters, limit);
      }
      return result;
    } finally {
      MetricUtils.timerStop(ignored, this.getClass().getName(), "getCachedAutoCompleteResults");
    }
  }

  /**
   * Returns cached browse results.
   */
  public BrowseResult getCachedBrowseResults(
      @Nonnull String entityName,
      @Nonnull String path,
      @Nullable Filter filters,
      int from,
      int size,
      @Nullable SearchFlags flags) {
    UUID ignored = MetricUtils.timerStart(this.getClass().getName(), "getCachedBrowseResults");
    try {
      Cache cache = cacheManager.getCache(ENTITY_SEARCH_SERVICE_BROWSE_CACHE_NAME);
      BrowseResult result;
      if (enableCache(flags)) {
        UUID cacheAccess = MetricUtils.timerStart(this.getClass().getName(), "browse_cache_access");
        Object cacheKey = Quintet.with(entityName, path, filters, from, size);
        result = cache.get(cacheKey, BrowseResult.class);
        MetricUtils.timerStop(cacheAccess, this.getClass().getName(), "browse_cache_access");
        if (result == null) {
          UUID cacheMiss = MetricUtils.timerStart(this.getClass().getName(), "browse_cache_miss");
          result = getRawBrowseResults(entityName, path, filters, from, size);
          cache.put(cacheKey, result);
          MetricUtils.timerStop(cacheMiss, this.getClass().getName(), "browse_cache_miss");
          MetricUtils.counterInc(this.getClass().getName(), "browse_cache_miss_count");
        }
      } else {
        result = getRawBrowseResults(entityName, path, filters, from, size);
      }
      return result;
    } finally {
      MetricUtils.timerStop(ignored, this.getClass().getName(), "getCachedBrowseResults");
    }
  }

  /**
   * Executes the expensive search query using the {@link EntitySearchService}
   */
  private SearchResult getRawSearchResults(
      final String entityName,
      final String input,
      final Filter filters,
      final SortCriterion sortCriterion,
      final int start,
      final int count) {
    return entitySearchService.search(
        entityName,
        input,
        filters,
        sortCriterion,
        start,
        count);
  }

  /**
   * Executes the expensive autocomplete query using the {@link EntitySearchService}
   */
  private AutoCompleteResult getRawAutoCompleteResults(
      final String entityName,
      final String input,
      final String field,
      final Filter filters,
      final int limit) {
    return entitySearchService.autoComplete(
        entityName,
        input,
        field,
        filters,
        limit);
  }

  /**
   * Executes the expensive autocomplete query using the {@link EntitySearchService}
   */
  private BrowseResult getRawBrowseResults(
      final String entityName,
      final String input,
      final Filter filters,
      final int start,
      final int count) {
    return entitySearchService.browse(
        entityName,
        input,
        filters,
        start,
        count);
  }

  /**
   * Returns true if the cache should be used or skipped when fetching search results
   */
  private boolean enableCache(final SearchFlags searchFlags) {
    return enableCache && (searchFlags == null || !searchFlags.isSkipCache());
  }

}
