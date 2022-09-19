package com.datahub.authentication.invite;

import com.datahub.authentication.Authentication;
import com.linkedin.common.urn.Urn;
import com.linkedin.entity.EntityResponse;
import com.linkedin.entity.EnvelopedAspectMap;
import com.linkedin.entity.client.EntityClient;
import com.linkedin.events.metadata.ChangeType;
import com.linkedin.metadata.key.InviteTokenKey;
import com.linkedin.metadata.query.filter.Condition;
import com.linkedin.metadata.query.filter.ConjunctiveCriterion;
import com.linkedin.metadata.query.filter.ConjunctiveCriterionArray;
import com.linkedin.metadata.query.filter.Criterion;
import com.linkedin.metadata.query.filter.CriterionArray;
import com.linkedin.metadata.query.filter.Filter;
import com.linkedin.metadata.search.SearchEntity;
import com.linkedin.metadata.search.SearchResult;
import com.linkedin.metadata.secret.SecretService;
import com.linkedin.metadata.utils.GenericRecordUtils;
import com.linkedin.mxe.MetadataChangeProposal;
import com.linkedin.r2.RemoteInvocationException;
import java.net.URISyntaxException;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Collections;
import java.util.Objects;
import java.util.UUID;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import lombok.extern.slf4j.Slf4j;

import static com.linkedin.metadata.Constants.*;


@Slf4j
public class InviteTokenService {
  private static final String HASHING_ALGORITHM = "SHA-256";
  private static final String ROLE_FIELD_NAME = "role";
  private static final String HAS_ROLE_FIELD_NAME = "hasRole";
  private final EntityClient _entityClient;
  private final SecretService _secretService;
  private final MessageDigest _messageDigest;
  private final Base64.Encoder _encoder;

  public InviteTokenService(@Nonnull EntityClient entityClient, @Nonnull SecretService secretService) throws Exception {
    _entityClient = Objects.requireNonNull(entityClient, "entityClient must not be null");
    _secretService = Objects.requireNonNull(secretService, "secretService must not be null");
    _messageDigest = MessageDigest.getInstance(HASHING_ALGORITHM);
    _encoder = Base64.getEncoder();
  }

  public Urn getInviteTokenUrn(@Nonnull final String inviteTokenStr) throws URISyntaxException {
    String hashedInviteTokenStr = hashString(inviteTokenStr);
    String inviteTokenUrnStr = String.format("urn:li:inviteToken:%s", hashedInviteTokenStr);
    return Urn.createFromString(inviteTokenUrnStr);
  }

  public boolean isInviteTokenValid(@Nonnull final Urn inviteTokenUrn, @Nonnull final Authentication authentication)
      throws RemoteInvocationException {
    return _entityClient.exists(inviteTokenUrn, authentication);
  }

  @Nullable
  public Urn getInviteTokenRole(@Nonnull final Urn inviteTokenUrn, @Nonnull final Authentication authentication)
      throws URISyntaxException, RemoteInvocationException {
    com.linkedin.identity.InviteToken inviteToken = getInviteTokenEntity(inviteTokenUrn, authentication);
    return inviteToken.hasRole() ? inviteToken.getRole() : null;
  }

  @Nonnull
  public String getInviteToken(@Nullable final String roleUrnStr, boolean regenerate,
      @Nonnull final Authentication authentication) throws Exception {
    final Filter inviteTokenFilter =
        roleUrnStr == null ? createInviteTokenFilter() : createInviteTokenFilter(roleUrnStr);

    final SearchResult searchResult =
        _entityClient.filter(INVITE_TOKEN_ENTITY_NAME, inviteTokenFilter, null, 0, 10, authentication);

    final int numEntities = searchResult.getEntities().size();
    // If there is more than one invite token, wipe all of them and generate a fresh one
    if (numEntities > 1) {
      deleteExistingInviteTokens(searchResult, authentication);
      return createInviteToken(roleUrnStr, authentication);
    }

    // If we want to regenerate, or there are no entities in the result, create a new invite token.
    if (regenerate || numEntities == 0) {
      return createInviteToken(roleUrnStr, authentication);
    }

    final SearchEntity searchEntity = searchResult.getEntities().get(0);
    final Urn inviteTokenUrn = searchEntity.getEntity();

    com.linkedin.identity.InviteToken inviteToken = getInviteTokenEntity(inviteTokenUrn, authentication);
    return _secretService.decrypt(inviteToken.getToken());
  }

  private String hashString(@Nonnull final String str) {
    byte[] hashedBytes = _messageDigest.digest(str.getBytes());
    return _encoder.encodeToString(hashedBytes);
  }

  private com.linkedin.identity.InviteToken getInviteTokenEntity(@Nonnull final Urn inviteTokenUrn,
      @Nonnull final Authentication authentication) throws RemoteInvocationException, URISyntaxException {
    final EntityResponse inviteTokenEntity =
        _entityClient.getV2(INVITE_TOKEN_ENTITY_NAME, inviteTokenUrn, Collections.singleton(INVITE_TOKEN_ASPECT_NAME),
            authentication);

    if (inviteTokenEntity == null) {
      throw new RuntimeException(String.format("Invite token %s does not exist", inviteTokenUrn));
    }

    final EnvelopedAspectMap aspectMap = inviteTokenEntity.getAspects();
    // If invite token aspect is not present, create a new one. Otherwise, return existing one.
    if (!aspectMap.containsKey(INVITE_TOKEN_ASPECT_NAME)) {
      throw new RuntimeException(
          String.format("Invite token %s does not contain aspect %s", inviteTokenUrn, INVITE_TOKEN_ASPECT_NAME));
    }
    return new com.linkedin.identity.InviteToken(aspectMap.get(INVITE_TOKEN_ASPECT_NAME).getValue().data());
  }

  private Filter createInviteTokenFilter() {
    final Filter filter = new Filter();
    final ConjunctiveCriterionArray disjunction = new ConjunctiveCriterionArray();
    final ConjunctiveCriterion conjunction = new ConjunctiveCriterion();
    final CriterionArray andCriterion = new CriterionArray();

    final Criterion roleCriterion = new Criterion();
    roleCriterion.setField(HAS_ROLE_FIELD_NAME);
    roleCriterion.setValue("false");
    roleCriterion.setCondition(Condition.EQUAL);

    andCriterion.add(roleCriterion);
    conjunction.setAnd(andCriterion);
    disjunction.add(conjunction);
    filter.setOr(disjunction);

    return filter;
  }

  private Filter createInviteTokenFilter(@Nonnull final String roleUrnStr) {
    final Filter filter = new Filter();
    final ConjunctiveCriterionArray disjunction = new ConjunctiveCriterionArray();
    final ConjunctiveCriterion conjunction = new ConjunctiveCriterion();
    final CriterionArray andCriterion = new CriterionArray();

    final Criterion roleCriterion = new Criterion();
    roleCriterion.setField(ROLE_FIELD_NAME);
    roleCriterion.setValue(roleUrnStr);
    roleCriterion.setCondition(Condition.EQUAL);

    andCriterion.add(roleCriterion);
    conjunction.setAnd(andCriterion);
    disjunction.add(conjunction);
    filter.setOr(disjunction);

    return filter;
  }

  @Nonnull
  private String createInviteToken(@Nullable final String roleUrnStr, @Nonnull final Authentication authentication)
      throws Exception {
    String inviteTokenStr = UUID.randomUUID().toString();
    String hashedInviteTokenStr = hashString(inviteTokenStr);
    InviteTokenKey inviteTokenKey = new InviteTokenKey();
    inviteTokenKey.setId(hashedInviteTokenStr);
    com.linkedin.identity.InviteToken inviteTokenAspect =
        new com.linkedin.identity.InviteToken().setToken(_secretService.encrypt(inviteTokenStr));
    if (roleUrnStr != null) {
      Urn roleUrn = Urn.createFromString(roleUrnStr);
      inviteTokenAspect.setRole(roleUrn);
    }

    // Ingest inviteToken MCP
    final MetadataChangeProposal inviteTokenProposal = new MetadataChangeProposal();
    inviteTokenProposal.setEntityType(INVITE_TOKEN_ENTITY_NAME);
    inviteTokenProposal.setEntityKeyAspect(GenericRecordUtils.serializeAspect(inviteTokenKey));
    inviteTokenProposal.setAspectName(INVITE_TOKEN_ASPECT_NAME);
    inviteTokenProposal.setAspect(GenericRecordUtils.serializeAspect(inviteTokenAspect));
    inviteTokenProposal.setChangeType(ChangeType.UPSERT);
    _entityClient.ingestProposal(inviteTokenProposal, authentication);

    return inviteTokenStr;
  }

  private void deleteExistingInviteTokens(@Nonnull final SearchResult searchResult,
      @Nonnull final Authentication authentication) {
    searchResult.getEntities().forEach(entity -> {
      try {
        _entityClient.deleteEntity(entity.getEntity(), authentication);
      } catch (RemoteInvocationException e) {
        log.error(String.format("Failed to delete invite token entity %s", entity.getEntity()), e);
      }
    });
  }
}
