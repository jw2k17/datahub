package com.linkedin.metadata.restli;

import com.linkedin.common.urn.Urn;
import com.linkedin.data.template.RecordTemplate;
import com.linkedin.data.template.UnionTemplate;
import com.linkedin.metadata.dao.BaseSearchDAO;
import com.linkedin.metadata.dao.SearchResult;
import com.linkedin.metadata.dao.utils.ModelUtils;
import com.linkedin.metadata.query.AutoCompleteResult;
import com.linkedin.metadata.query.Criterion;
import com.linkedin.metadata.query.CriterionArray;
import com.linkedin.metadata.query.Filter;
import com.linkedin.metadata.query.SearchResultMetadata;
import com.linkedin.metadata.query.SortCriterion;
import com.linkedin.metadata.query.SortOrder;
import com.linkedin.parseq.Task;
import com.linkedin.restli.server.CollectionResult;
import com.linkedin.restli.server.PagingContext;
import com.linkedin.restli.server.annotations.Action;
import com.linkedin.restli.server.annotations.ActionParam;
import com.linkedin.restli.server.annotations.Finder;
import com.linkedin.restli.server.annotations.Optional;
import com.linkedin.restli.server.annotations.PagingContextParam;
import com.linkedin.restli.server.annotations.QueryParam;
import com.linkedin.restli.server.annotations.RestMethod;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import static com.linkedin.metadata.restli.RestliConstants.*;


/**
 * A base class for the entity rest.li resource that supports CRUD + search methods
 *
 * See http://go/gma for more details
 *
 * @param <KEY> the resource's key type
 * @param <VALUE> the resource's value type
 * @param <URN> must be a valid {@link Urn} type for the snapshot
 * @param <SNAPSHOT> must be a valid snapshot type defined in com.linkedin.metadata.snapshot
 * @param <ASPECT_UNION> must be a valid aspect union type supported by the snapshot
 * @param <DOCUMENT> must be a valid search document type defined in com.linkedin.metadata.search
 */
public abstract class BaseSearchableEntityResource<
    // @formatter:off
    KEY extends RecordTemplate,
    VALUE extends RecordTemplate,
    URN extends Urn,
    SNAPSHOT extends RecordTemplate,
    ASPECT_UNION extends UnionTemplate,
    DOCUMENT extends RecordTemplate>
    // @formatter:on
    extends BaseEntityResource<KEY, VALUE, URN, SNAPSHOT, ASPECT_UNION> {

  private static final Filter EMPTY_FILTER = new Filter().setCriteria(new CriterionArray());
  private static final String MATCH_ALL = "*";
  private static final String REMOVED_FIELD = "removed";
  private static final String DEFAULT_SORT_CRITERION_FIELD = "urn";

  public BaseSearchableEntityResource(@Nonnull Class<SNAPSHOT> snapshotClass,
      @Nonnull Class<ASPECT_UNION> aspectUnionClass) {
    super(snapshotClass, aspectUnionClass);
  }

  /**
   * Returns a document-specific {@link BaseSearchDAO}.
   */
  @Nonnull
  protected abstract BaseSearchDAO<DOCUMENT> getSearchDAO();

  /**
   * Returns all {@link VALUE} objects from search index which by default are NOT removed. By default the list is sorted in ascending order of urn
   *
   * @param pagingContext pagination context
   * @param aspectNames list of aspect names that need to be returned
   * @param filter {@link Filter} to filter the search results
   * @param sortCriterion {@link SortCriterion} to sort the search results
   * @return list of all {@link VALUE} objects obtained from search results
   */
  @RestMethod.GetAll
  @Nonnull
  public Task<List<VALUE>> getAll(@Nonnull PagingContext pagingContext,
      @QueryParam(PARAM_ASPECTS) @Optional("[]") @Nonnull String[] aspectNames,
      @QueryParam(PARAM_FILTER) @Optional @Nullable Filter filter,
      @QueryParam(PARAM_SORT) @Optional @Nullable SortCriterion sortCriterion) {

    final Filter searchFilter = filter != null ? filter : EMPTY_FILTER;
    if (searchFilter.hasCriteria() && searchFilter.getCriteria()
        .stream()
        .noneMatch(t -> t.getField().equals(REMOVED_FIELD))) {
      searchFilter.getCriteria().add(new Criterion().setField(REMOVED_FIELD).setValue("false"));
    }

    final SortCriterion searchSortCriterion = sortCriterion != null ? sortCriterion
        : new SortCriterion().setField(DEFAULT_SORT_CRITERION_FIELD).setOrder(SortOrder.ASCENDING);
    return RestliUtils.toTask(
        () -> getSearchQueryCollectionResult(MATCH_ALL, aspectNames, searchFilter, searchSortCriterion,
            pagingContext).getElements());
  }

  @Finder(FINDER_SEARCH)
  @Nonnull
  public Task<CollectionResult<VALUE, SearchResultMetadata>> search(@QueryParam(PARAM_INPUT) @Nonnull String input,
      @QueryParam(PARAM_ASPECTS) @Optional("[]") @Nonnull String[] aspectNames,
      @QueryParam(PARAM_FILTER) @Optional @Nullable Filter filter,
      @QueryParam(PARAM_SORT) @Optional @Nullable SortCriterion sortCriterion,
      @PagingContextParam @Nonnull PagingContext pagingContext) {

    final Filter searchFilter = filter != null ? filter : EMPTY_FILTER;
    return RestliUtils.toTask(
        () -> getSearchQueryCollectionResult(input, aspectNames, searchFilter, sortCriterion, pagingContext));
  }

  @Action(name = ACTION_AUTOCOMPLETE)
  @Nonnull
  public Task<AutoCompleteResult> autocomplete(@ActionParam(PARAM_QUERY) @Nonnull String query,
      @ActionParam(PARAM_FIELD) @Nullable String field, @ActionParam(PARAM_FILTER) @Nullable Filter filter,
      @ActionParam(PARAM_LIMIT) int limit) {
    return RestliUtils.toTask(() -> getSearchDAO().autoComplete(query, field, filter, limit));
  }

  @Nonnull
  private CollectionResult<VALUE, SearchResultMetadata> getSearchQueryCollectionResult(@Nonnull String input,
      @Nonnull String[] aspectNames, @Nullable Filter searchFilter, @Nullable SortCriterion sortCriterion,
      @Nonnull PagingContext pagingContext) {

    final SearchResult<DOCUMENT> searchResult =
        getSearchDAO().search(input, searchFilter, sortCriterion, pagingContext.getStart(), pagingContext.getCount());
    final List<URN> matchedUrns = searchResult.getDocumentList()
        .stream()
        .map(d -> (URN) ModelUtils.getUrnFromDocument(d))
        .collect(Collectors.toList());
    final Map<URN, VALUE> urnValueMap = getInternal(matchedUrns, parseAspectsParam(aspectNames));
    return new CollectionResult<>(matchedUrns.stream().map(urn -> urnValueMap.get(urn)).collect(Collectors.toList()),
        searchResult.getTotalCount(), searchResult.getSearchResultMetadata());
  }
}
