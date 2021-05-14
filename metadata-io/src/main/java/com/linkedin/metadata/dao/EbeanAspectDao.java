package com.linkedin.metadata.dao;

import com.google.common.annotations.VisibleForTesting;
import com.linkedin.common.AuditStamp;
import com.linkedin.common.urn.Urn;
import com.linkedin.metadata.dao.ebean.EbeanAspect;
import com.linkedin.metadata.dao.exception.ModelConversionException;
import com.linkedin.metadata.dao.exception.RetryLimitReached;
import com.linkedin.metadata.dao.retention.IndefiniteRetention;
import com.linkedin.metadata.dao.retention.Retention;
import com.linkedin.metadata.dao.retention.TimeBasedRetention;
import com.linkedin.metadata.dao.retention.VersionBasedRetention;
import com.linkedin.metadata.dao.utils.QueryUtils;
import com.linkedin.metadata.query.ExtraInfo;
import com.linkedin.metadata.query.ExtraInfoArray;
import com.linkedin.metadata.query.ListResultMetadata;
import io.ebean.DuplicateKeyException;
import io.ebean.EbeanServer;
import io.ebean.EbeanServerFactory;
import io.ebean.PagedList;
import io.ebean.Query;
import io.ebean.RawSql;
import io.ebean.RawSqlBuilder;
import io.ebean.Transaction;
import io.ebean.config.ServerConfig;
import java.net.URISyntaxException;
import java.sql.Timestamp;
import java.time.Clock;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.persistence.RollbackException;
import javax.persistence.Table;

import static com.linkedin.metadata.dao.ebean.EbeanAspect.*;

public class EbeanAspectDao {

  public static final long LATEST_VERSION = 0;
  private static final String EBEAN_MODEL_PACKAGE = EbeanAspect.class.getPackage().getName();
  private static final IndefiniteRetention INDEFINITE_RETENTION = new IndefiniteRetention();

  private final EbeanServer _server;
  private final Map<String, Retention> _aspectRetentionMap = new HashMap<>();
  private final Clock _clock = Clock.systemUTC();

  private int _queryKeysCount = 0; // 0 means no pagination on keys

  /**
   * Constructor for EntityEbeanDao.
   *
   * @param serverConfig {@link ServerConfig} that defines the configuration of EbeanServer instances
   */
  public EbeanAspectDao(@Nonnull final ServerConfig serverConfig) {
    this(createServer(serverConfig));
  }

  @VisibleForTesting
  public EbeanAspectDao(@Nonnull final EbeanServer server) {
    _server = server;
  }

  /**
   * Return the {@link EbeanServer} server instance used for customized queries.
   */
  public EbeanServer getServer() {
    return _server;
  }

  public long saveLatestAspect(
      @Nonnull String urn,
      @Nonnull String aspectName,
      @Nullable String oldAspectMetadata,
      @Nullable String oldActor,
      @Nullable String oldImpersonator,
      @Nullable Timestamp oldTime,
      @Nonnull String newAspectMetadata,
      @Nonnull String newActor,
      @Nullable String newImpersonator,
      @Nonnull Timestamp newTime) {
    // Save oldValue as the largest version + 1
    long largestVersion = 0;
    if (oldAspectMetadata != null && oldTime != null) {
      largestVersion = getNextVersion(urn, aspectName);
      saveAspect(urn, aspectName, oldAspectMetadata, oldActor, oldImpersonator, oldTime, largestVersion, true);
    }

    // Save newValue as the latest version (v0)
    saveAspect(urn, aspectName, newAspectMetadata, newActor, newImpersonator, newTime, LATEST_VERSION, oldAspectMetadata == null);

    // Apply retention policy
    applyRetention(urn, aspectName, getRetention(aspectName), largestVersion);

    return largestVersion;
  }

  protected void saveAspect(
      @Nonnull String urn,
      @Nonnull String aspectName,
      @Nonnull String aspectMetadata,
      @Nonnull String actor,
      @Nullable String impersonator,
      @Nonnull Timestamp timestamp,
      long version,
      boolean insert) {

    final EbeanAspect aspect = new EbeanAspect();
    aspect.setKey(new EbeanAspect.PrimaryKey(urn, aspectName, version));
    aspect.setMetadata(aspectMetadata);
    aspect.setCreatedOn(timestamp);
    aspect.setCreatedBy(actor);
    if (impersonator != null) {
      aspect.setCreatedFor(impersonator);
    }

    saveAspect(aspect, insert);
  }

  protected void saveAspect(final @Nonnull EbeanAspect ebeanAspect, final boolean insert) {
    if (insert) {
      _server.insert(ebeanAspect);
    } else {
      _server.update(ebeanAspect);
    }
  }

  @Nullable
  protected EbeanAspect getLatestAspect(@Nonnull String urn, @Nonnull String aspectName) {
    final EbeanAspect.PrimaryKey key = new EbeanAspect.PrimaryKey(urn, aspectName, 0L);
    return _server.find(EbeanAspect.class, key);
  }

  @Nullable
  public EbeanAspect getAspect(@Nonnull String urn, @Nonnull String aspectName, long version) {
    return getAspect(new EbeanAspect.PrimaryKey(urn, aspectName, version));
  }

  @Nullable
  public EbeanAspect getAspect(@Nonnull EbeanAspect.PrimaryKey primaryKey) {
    return _server.find(EbeanAspect.class, primaryKey);
  }

  @Nonnull
  public Map<EbeanAspect.PrimaryKey, EbeanAspect> batchGet(@Nonnull Set<EbeanAspect.PrimaryKey> keys) {
    if (keys.isEmpty()) {
      return Collections.emptyMap();
    }

    final List<EbeanAspect> records;
    if (_queryKeysCount == 0) {
      records = batchGet(keys, keys.size());
    } else {
      records = batchGet(keys, _queryKeysCount);
    }
    return records.stream().collect(Collectors.toMap(EbeanAspect::getKey, record -> record));
  }

  /**
   * BatchGet that allows pagination on keys to avoid large queries.
   * TODO: can further improve by running the sub queries in parallel
   *
   * @param keys a set of keys with urn, aspect and version
   * @param keysCount the max number of keys for each sub query
   */
  @Nonnull
  private List<EbeanAspect> batchGet(@Nonnull Set<EbeanAspect.PrimaryKey> keys, int keysCount) {

    int position = 0;

    final int totalPageCount = QueryUtils.getTotalPageCount(keys.size(), keysCount);
    final List<EbeanAspect> finalResult = batchGetUnion(new ArrayList<>(keys), keysCount, position);

    while (QueryUtils.hasMore(position, keysCount, totalPageCount)) {
      position += keysCount;
      final List<EbeanAspect> oneStatementResult = batchGetUnion(new ArrayList<>(keys), keysCount, position);
      finalResult.addAll(oneStatementResult);
    }

    return finalResult;
  }

  /**
   * Builds a single SELECT statement for batch get, which selects one entity, and then can be UNION'd with other SELECT
   * statements.
   */
  private String batchGetSelect(
      int selectId,
      @Nonnull String urn,
      @Nonnull String aspect,
      long version,
      @Nonnull Map<String, Object> outputParamsToValues) {

    final String urnArg = "urn" + selectId;
    final String aspectArg = "aspect" + selectId;
    final String versionArg = "version" + selectId;

    outputParamsToValues.put(urnArg, urn);
    outputParamsToValues.put(aspectArg, aspect);
    outputParamsToValues.put(versionArg, version);

    return String.format("SELECT urn, aspect, version, metadata, createdOn, createdBy, createdFor "
            + "FROM %s WHERE urn = :%s AND aspect = :%s AND version = :%s",
        EbeanAspect.class.getAnnotation(Table.class).name(), urnArg, aspectArg, versionArg);
  }

  @Nonnull
  private List<EbeanAspect> batchGetUnion(@Nonnull List<EbeanAspect.PrimaryKey> keys, int keysCount, int position) {

    // Build one SELECT per key and then UNION ALL the results. This can be much more performant than OR'ing the
    // conditions together. Our query will look like:
    //   SELECT * FROM metadata_aspect WHERE urn = 'urn0' AND aspect = 'aspect0' AND version = 0
    //   UNION ALL
    //   SELECT * FROM metadata_aspect WHERE urn = 'urn0' AND aspect = 'aspect1' AND version = 0
    //   ...
    // Note: UNION ALL should be safe and more performant than UNION. We're selecting the entire entity key (as well
    // as data), so each result should be unique. No need to deduplicate.
    // Another note: ebean doesn't support UNION ALL, so we need to manually build the SQL statement ourselves.
    final StringBuilder sb = new StringBuilder();
    final int end = Math.min(keys.size(), position + keysCount);
    final Map<String, Object> params = new HashMap<>();
    for (int index = position; index < end; index++) {
      sb.append(batchGetSelect(
          index - position,
          keys.get(index).getUrn(),
          keys.get(index).getAspect(),
          keys.get(index).getVersion(),
          params));

      if (index != end - 1) {
        sb.append(" UNION ALL ");
      }
    }

    final RawSql rawSql = RawSqlBuilder.parse(sb.toString())
        .columnMapping(URN_COLUMN, "key.urn")
        .columnMapping(ASPECT_COLUMN, "key.aspect")
        .columnMapping(VERSION_COLUMN, "key.version")
        .create();

    final Query<EbeanAspect> query = _server.find(EbeanAspect.class).setRawSql(rawSql);

    for (Map.Entry<String, Object> param : params.entrySet()) {
      query.setParameter(param.getKey(), param.getValue());
    }

    return query.findList();
  }

  @Nonnull
  public ListResult<Long> listVersions(
      @Nonnull String urn,
      @Nonnull String aspectName,
      int start,
      int pageSize) {

    final PagedList<EbeanAspect> pagedList = _server.find(EbeanAspect.class)
        .select(KEY_ID)
        .where()
        .eq(URN_COLUMN, urn)
        .eq(ASPECT_COLUMN, aspectName)
        .setFirstRow(start)
        .setMaxRows(pageSize)
        .orderBy()
        .asc(VERSION_COLUMN)
        .findPagedList();

    List<Long> versions = pagedList.getList().stream().map(a -> a.getKey().getVersion()).collect(Collectors.toList());
    return toListResult(versions, null, pagedList, start);
  }

  @Nonnull
  public ListResult<String> listUrns(
      @Nonnull String aspectName,
      int start,
      int pageSize) {

    final PagedList<EbeanAspect> pagedList = _server.find(EbeanAspect.class)
        .select(KEY_ID)
        .where()
        .eq(ASPECT_COLUMN, aspectName)
        .eq(VERSION_COLUMN, LATEST_VERSION)
        .setFirstRow(start)
        .setMaxRows(pageSize)
        .orderBy()
        .asc(URN_COLUMN)
        .findPagedList();

    final List<String> urns = pagedList
        .getList()
        .stream()
        .map(entry -> entry.getKey().getUrn())
        .collect(Collectors.toList());

    return toListResult(urns, null, pagedList, start);
  }

  @Nonnull
  public ListResult<String> listAspectMetadata(
      @Nonnull Urn urn,
      @Nonnull String aspectName,
      int start,
      int pageSize) {

    final PagedList<EbeanAspect> pagedList = _server.find(EbeanAspect.class)
        .select(ALL_COLUMNS)
        .where()
        .eq(URN_COLUMN, urn.toString())
        .eq(ASPECT_COLUMN, aspectName)
        .setFirstRow(start)
        .setMaxRows(pageSize)
        .orderBy()
        .asc(VERSION_COLUMN)
        .findPagedList();

    final List<String> aspects = pagedList.getList().stream().map(EbeanAspect::getMetadata).collect(Collectors.toList());
    final ListResultMetadata listResultMetadata = makeListResultMetadata(pagedList.getList().stream().map(
        EbeanAspectDao::toExtraInfo).collect(Collectors.toList()));
    return toListResult(aspects, listResultMetadata, pagedList, start);
  }

  @Nonnull
  public ListResult<String> listLatestAspectMetadata(
      @Nonnull String aspectName,
      int start,
      int pageSize) {
    return listAspectMetadata(aspectName, LATEST_VERSION, start, pageSize);
  }

  @Nonnull
  public ListResult<String> listAspectMetadata(
      @Nonnull String aspectName,
      long version,
      int start,
      int pageSize) {

    final PagedList<EbeanAspect> pagedList = _server.find(EbeanAspect.class)
        .select(ALL_COLUMNS)
        .where()
        .eq(ASPECT_COLUMN, aspectName)
        .eq(VERSION_COLUMN, version)
        .setFirstRow(start)
        .setMaxRows(pageSize)
        .orderBy()
        .asc(URN_COLUMN)
        .findPagedList();

    final List<String> aspects = pagedList.getList().stream().map(EbeanAspect::getMetadata).collect(Collectors.toList());
    final ListResultMetadata listResultMetadata = makeListResultMetadata(pagedList.getList().stream().map(
        EbeanAspectDao::toExtraInfo).collect(Collectors.toList()));
    return toListResult(aspects, listResultMetadata, pagedList, start);
  }

  @Nonnull
  public Retention getRetention(@Nonnull String aspectName) {
    return _aspectRetentionMap.getOrDefault(aspectName, INDEFINITE_RETENTION);
  }

  public void setRetention(@Nonnull String aspectName, @Nonnull Retention retention) {
    _aspectRetentionMap.put(aspectName, retention);
  }

  @Nonnull
  public <T> T runInTransactionWithRetry(@Nonnull Supplier<T> block, int maxTransactionRetry) {
    int retryCount = 0;
    Exception lastException;

    T result = null;
    do {
      try (Transaction transaction = _server.beginTransaction()) {
        result = block.get();
        transaction.commit();
        lastException = null;
        break;
      } catch (RollbackException | DuplicateKeyException exception) {
        lastException = exception;
      }
    } while (++retryCount <= maxTransactionRetry);

    if (lastException != null) {
      throw new RetryLimitReached("Failed to add after " + maxTransactionRetry + " retries", lastException);
    }

    return result;
  }


  private void applyRetention(
      @Nonnull String urn,
      @Nonnull String aspectName,
      @Nonnull Retention retention,
      long largestVersion) {
    if (retention instanceof IndefiniteRetention) {
      return;
    }

    if (retention instanceof VersionBasedRetention) {
      applyVersionBasedRetention(urn, aspectName, (VersionBasedRetention) retention, largestVersion);
      return;
    }

    if (retention instanceof TimeBasedRetention) {
      applyTimeBasedRetention(urn, aspectName, (TimeBasedRetention) retention, _clock.millis());
      return;
    }
  }

  protected void applyVersionBasedRetention(
      @Nonnull String urn,
      @Nonnull String aspectName,
      @Nonnull VersionBasedRetention retention,
      long largestVersion) {
    _server.find(EbeanAspect.class)
        .where()
        .eq(URN_COLUMN, urn.toString())
        .eq(ASPECT_COLUMN, aspectName)
        .ne(VERSION_COLUMN, LATEST_VERSION)
        .le(VERSION_COLUMN, largestVersion - retention.getMaxVersionsToRetain() + 1)
        .delete();
  }

  protected void applyTimeBasedRetention(
      @Nonnull String urn,
      @Nonnull String aspectName,
      @Nonnull TimeBasedRetention retention,
      long currentTime) {

    _server.find(EbeanAspect.class)
        .where()
        .eq(URN_COLUMN, urn.toString())
        .eq(ASPECT_COLUMN, aspectName)
        .lt(CREATED_ON_COLUMN, new Timestamp(currentTime - retention.getMaxAgeToRetain()))
        .delete();
  }

  private long getNextVersion(@Nonnull String urn, @Nonnull String aspectName) {
    final List<PrimaryKey> result = _server.find(EbeanAspect.class)
        .where()
        .eq(URN_COLUMN, urn.toString())
        .eq(ASPECT_COLUMN, aspectName)
        .orderBy()
        .desc(VERSION_COLUMN)
        .setMaxRows(1)
        .findIds();

    return result.isEmpty() ? 0 : result.get(0).getVersion() + 1L;
  }

  @Nonnull
  private <T> ListResult<T> toListResult(@Nonnull List<T> values, @Nullable ListResultMetadata listResultMetadata,
      @Nonnull PagedList<?> pagedList, @Nullable Integer start) {
    final int nextStart =
        (start != null && pagedList.hasNext()) ? start + pagedList.getList().size() : ListResult.INVALID_NEXT_START;
    return ListResult.<T>builder()
        // Format
        .values(values)
        .metadata(listResultMetadata)
        .nextStart(nextStart)
        .havingMore(pagedList.hasNext())
        .totalCount(pagedList.getTotalCount())
        .totalPageCount(pagedList.getTotalPageCount())
        .pageSize(pagedList.getPageSize())
        .build();
  }

  @Nonnull
  private static ExtraInfo toExtraInfo(@Nonnull final EbeanAspect aspect) {
    final ExtraInfo extraInfo = new ExtraInfo();
    extraInfo.setVersion(aspect.getKey().getVersion());
    extraInfo.setAudit(makeAuditStamp(aspect));
    try {
      extraInfo.setUrn(Urn.createFromString(aspect.getKey().getUrn()));
    } catch (URISyntaxException e) {
      throw new ModelConversionException(e.getMessage());
    }

    return extraInfo;
  }

  @Nonnull
  private static AuditStamp makeAuditStamp(@Nonnull EbeanAspect aspect) {
    final AuditStamp auditStamp = new AuditStamp();
    auditStamp.setTime(aspect.getCreatedOn().getTime());

    try {
      auditStamp.setActor(new Urn(aspect.getCreatedBy()));
      if (aspect.getCreatedFor() != null) {
        auditStamp.setImpersonator(new Urn(aspect.getCreatedFor()));
      }
    } catch (URISyntaxException e) {
      throw new RuntimeException(e);
    }
    return auditStamp;
  }

  @Nonnull
  private ListResultMetadata makeListResultMetadata(@Nonnull List<ExtraInfo> extraInfos) {
    final ListResultMetadata listResultMetadata = new ListResultMetadata();
    listResultMetadata.setExtraInfos(new ExtraInfoArray(extraInfos));
    return listResultMetadata;
  }

  @Nonnull
  private static EbeanServer createServer(@Nonnull ServerConfig serverConfig) {
    // Make sure that the serverConfig includes the package that contains DAO's Ebean model.
    if (!serverConfig.getPackages().contains(EBEAN_MODEL_PACKAGE)) {
      serverConfig.getPackages().add(EBEAN_MODEL_PACKAGE);
    }
    // TODO: Consider supporting SCSI
    return EbeanServerFactory.create(serverConfig);
  }
}