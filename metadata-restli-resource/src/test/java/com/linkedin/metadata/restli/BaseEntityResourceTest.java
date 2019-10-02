package com.linkedin.metadata.restli;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import com.linkedin.common.urn.Urn;
import com.linkedin.data.template.RecordTemplate;
import com.linkedin.metadata.dao.AspectKey;
import com.linkedin.metadata.dao.BaseLocalDAO;
import com.linkedin.metadata.dao.utils.ModelUtils;
import com.linkedin.metadata.dao.utils.RecordUtils;
import com.linkedin.parseq.BaseEngineTest;
import com.linkedin.restli.common.HttpStatus;
import com.linkedin.restli.server.ResourceContext;
import com.linkedin.restli.server.RestLiServiceException;
import com.linkedin.testing.AspectBar;
import com.linkedin.testing.AspectFoo;
import com.linkedin.testing.EntityAspectUnion;
import com.linkedin.testing.EntityAspectUnionArray;
import com.linkedin.testing.EntityKey;
import com.linkedin.testing.EntitySnapshot;
import com.linkedin.testing.EntityValue;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import javax.annotation.Nonnull;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import static com.linkedin.metadata.dao.BaseReadDAO.*;
import static com.linkedin.testing.TestUtils.*;
import static org.mockito.Mockito.*;
import static org.testng.Assert.*;


public class BaseEntityResourceTest extends BaseEngineTest {

  private BaseLocalDAO<EntityAspectUnion, Urn> _mockLocalDAO;
  private TestResource _resource = new TestResource();

  class TestResource extends BaseEntityResource<EntityKey, EntityValue, Urn, EntitySnapshot, EntityAspectUnion> {

    public TestResource() {
      super(EntitySnapshot.class, EntityAspectUnion.class);
    }

    @Nonnull
    @Override
    protected BaseLocalDAO<EntityAspectUnion, Urn> getLocalDAO() {
      return _mockLocalDAO;
    }

    @Nonnull
    @Override
    protected Urn createUrnFromString(@Nonnull String urnString) {
      try {
        return Urn.createFromString(urnString);
      } catch (URISyntaxException e) {
        throw RestliUtils.badRequestException("Invalid URN: " + urnString);
      }
    }

    @Nonnull
    @Override
    protected Urn toUrn(@Nonnull EntityKey key) {
      return makeUrn(key.getId());
    }

    @Nonnull
    @Override
    protected EntityKey toKey(@Nonnull Urn urn) {
      return new EntityKey().setId(urn.getIdAsLong());
    }

    @Nonnull
    @Override
    protected EntityValue toValue(@Nonnull EntitySnapshot snapshot) {
      EntityValue value = new EntityValue();
      ModelUtils.getAspectsFromSnapshot(snapshot).forEach(a -> {
        if (a instanceof AspectFoo) {
          value.setFoo(AspectFoo.class.cast(a));
        } else if (a instanceof AspectBar) {
          value.setBar(AspectBar.class.cast(a));
        }
      });
      return value;
    }

    @Nonnull
    @Override
    protected EntitySnapshot toSnapshot(@Nonnull EntityValue value, @Nonnull Urn urn) {
      EntitySnapshot snapshot = new EntitySnapshot().setUrn(urn);
      EntityAspectUnionArray aspects = new EntityAspectUnionArray();
      if (value.hasFoo()) {
        aspects.add(ModelUtils.newAspectUnion(EntityAspectUnion.class, value.getFoo()));
      }
      if (value.hasBar()) {
        aspects.add(ModelUtils.newAspectUnion(EntityAspectUnion.class, value.getBar()));
      }

      snapshot.setAspects(aspects);
      return snapshot;
    }

    @Override
    public ResourceContext getContext() {
      return mock(ResourceContext.class);
    }
  }

  @BeforeMethod
  public void setup() {
    _mockLocalDAO = mock(BaseLocalDAO.class);
  }

  @Test
  public void testGet() {
    Urn urn = makeUrn(1234);
    AspectFoo foo = new AspectFoo().setValue("foo");
    AspectKey<Urn, AspectFoo> aspect1Key = new AspectKey<>(AspectFoo.class, urn, LATEST_VERSION);
    AspectKey<Urn, AspectBar> aspect2Key = new AspectKey<>(AspectBar.class, urn, LATEST_VERSION);

    when(_mockLocalDAO.get(new HashSet<>(Arrays.asList(aspect1Key, aspect2Key)))).thenReturn(
        Collections.singletonMap(aspect1Key, Optional.of(foo)));

    EntityValue value = runAndWait(_resource.get(makeResourceKey(urn), new String[0]));

    assertEquals(value.getFoo(), foo);
    assertFalse(value.hasBar());
  }

  @Test
  public void testGetSpecificAspect() {
    Urn urn = makeUrn(1234);
    AspectKey<Urn, AspectFoo> aspect1Key = new AspectKey<>(AspectFoo.class, urn, LATEST_VERSION);
    String[] aspectNames = {AspectFoo.class.getCanonicalName()};

    runAndWait(_resource.get(makeResourceKey(urn), aspectNames));

    verify(_mockLocalDAO, times(1)).get(Collections.singleton(aspect1Key));
    verifyNoMoreInteractions(_mockLocalDAO);
  }

  @Test
  public void testBatchGet() {
    Urn urn1 = makeUrn(1);
    Urn urn2 = makeUrn(2);
    AspectFoo foo = new AspectFoo().setValue("foo");
    AspectBar bar = new AspectBar().setValue("bar");

    AspectKey<Urn, AspectFoo> aspectFooKey1 = new AspectKey<>(AspectFoo.class, urn1, LATEST_VERSION);
    AspectKey<Urn, AspectBar> aspectBarKey1 = new AspectKey<>(AspectBar.class, urn1, LATEST_VERSION);
    AspectKey<Urn, AspectFoo> aspectFooKey2 = new AspectKey<>(AspectFoo.class, urn2, LATEST_VERSION);
    AspectKey<Urn, AspectBar> aspectBarKey2 = new AspectKey<>(AspectBar.class, urn2, LATEST_VERSION);

    when(_mockLocalDAO.get(ImmutableSet.of(aspectFooKey1, aspectBarKey1, aspectFooKey2, aspectBarKey2))).thenReturn(
        ImmutableMap.of(aspectFooKey1, Optional.of(foo), aspectFooKey2, Optional.of(bar)));

    Map<EntityKey, EntityValue> keyValueMap = runAndWait(
        _resource.batchGet(ImmutableSet.of(makeResourceKey(urn1), makeResourceKey(urn2)), new String[0])).entrySet()
        .stream()
        .collect(Collectors.toMap(e -> e.getKey().getKey(), e -> e.getValue()));

    assertEquals(keyValueMap.size(), 2);
    assertEquals(keyValueMap.get(makeKey(1)).getFoo(), foo);
    assertFalse(keyValueMap.get(makeKey(1)).hasBar());
    assertEquals(keyValueMap.get(makeKey(2)).getBar(), bar);
    assertFalse(keyValueMap.get(makeKey(2)).hasFoo());
  }

  @Test
  public void testBatchGetSpecificAspect() {
    Urn urn1 = makeUrn(1);
    Urn urn2 = makeUrn(2);
    AspectKey<Urn, AspectFoo> fooKey1 = new AspectKey<>(AspectFoo.class, urn1, LATEST_VERSION);
    AspectKey<Urn, AspectFoo> fooKey2 = new AspectKey<>(AspectFoo.class, urn2, LATEST_VERSION);
    String[] aspectNames = {ModelUtils.getAspectName(AspectFoo.class)};

    runAndWait(_resource.batchGet(ImmutableSet.of(makeResourceKey(urn1), makeResourceKey(urn2)), aspectNames));

    verify(_mockLocalDAO, times(1)).get(ImmutableSet.of(fooKey1, fooKey2));
    verifyNoMoreInteractions(_mockLocalDAO);
  }

  @Test
  public void testIngest() {
    Urn urn = makeUrn(1);
    AspectFoo foo = new AspectFoo().setValue("foo");
    AspectBar bar = new AspectBar().setValue("bar");
    List<EntityAspectUnion> aspects = Arrays.asList(ModelUtils.newAspectUnion(EntityAspectUnion.class, foo),
        ModelUtils.newAspectUnion(EntityAspectUnion.class, bar));
    EntitySnapshot snapshot = ModelUtils.newSnapshot(EntitySnapshot.class, urn, aspects);

    runAndWait(_resource.ingest(snapshot));

    verify(_mockLocalDAO, times(1)).add(eq(urn), eq(foo), any());
    verify(_mockLocalDAO, times(1)).add(eq(urn), eq(bar), any());
    verifyNoMoreInteractions(_mockLocalDAO);
  }

  @Test
  public void testGetSnapshotWithOneAspect() {
    Urn urn = makeUrn(1);
    AspectFoo foo = new AspectFoo().setValue("foo");
    AspectKey<Urn, ? extends RecordTemplate> fooKey = new AspectKey<>(AspectFoo.class, urn, LATEST_VERSION);
    Set<AspectKey<Urn, ? extends RecordTemplate>> aspectKeys = ImmutableSet.of(fooKey);
    when(_mockLocalDAO.get(aspectKeys)).thenReturn(ImmutableMap.of(fooKey, Optional.of(foo)));
    String[] aspectNames = new String[]{ModelUtils.getAspectName(AspectFoo.class)};

    EntitySnapshot snapshot = runAndWait(_resource.getSnapshot(urn.toString(), aspectNames));

    assertEquals(snapshot.getUrn(), urn);
    assertEquals(snapshot.getAspects().size(), 1);
    assertEquals(snapshot.getAspects().get(0).getAspectFoo(), foo);
  }

  @Test
  public void testGetSnapshotWithAllAspects() {
    Urn urn = makeUrn(1);
    AspectFoo foo = new AspectFoo().setValue("foo");
    AspectFoo bar = new AspectFoo().setValue("bar");
    AspectKey<Urn, ? extends RecordTemplate> fooKey = new AspectKey<>(AspectFoo.class, urn, LATEST_VERSION);
    AspectKey<Urn, ? extends RecordTemplate> barKey = new AspectKey<>(AspectBar.class, urn, LATEST_VERSION);
    Set<AspectKey<Urn, ? extends RecordTemplate>> aspectKeys = ImmutableSet.of(fooKey, barKey);
    when(_mockLocalDAO.get(aspectKeys)).thenReturn(ImmutableMap.of(fooKey, Optional.of(foo), barKey, Optional.of(bar)));

    EntitySnapshot snapshot = runAndWait(_resource.getSnapshot(urn.toString(), new String[0]));

    assertEquals(snapshot.getUrn(), urn);

    Set<RecordTemplate> aspects = snapshot.getAspects().stream().map(RecordUtils::getSelectedRecordTemplateFromUnion).collect(Collectors.toSet());
    assertEquals(aspects, ImmutableSet.of(foo, bar));
  }

  @Test
  public void testGetSnapshotWithInvalidUrn() {
    try {
      runAndWait(_resource.getSnapshot("invalid urn", new String[]{ModelUtils.getAspectName(AspectFoo.class)}));
    } catch (RestLiServiceException e) {
      assertEquals(e.getStatus(), HttpStatus.S_400_BAD_REQUEST);
      return;
    }

    fail("No exception thrown");
  }

  @Test
  public void testBackfillOneAspect() {
    Urn urn = makeUrn(1);
    AspectFoo foo = new AspectFoo().setValue("foo");
    when(_mockLocalDAO.backfill(AspectFoo.class, urn)).thenReturn(Optional.of(foo));
    String[] aspectNames = new String[]{ModelUtils.getAspectName(AspectFoo.class)};

    String[] backfilledAspects = runAndWait(_resource.backfill(urn.toString(), aspectNames));

    assertEquals(ImmutableSet.copyOf(backfilledAspects), ImmutableSet.of(ModelUtils.getAspectName(AspectFoo.class)));
  }

  @Test
  public void testBackfillAllAspects() {
    Urn urn = makeUrn(1);
    AspectFoo foo = new AspectFoo().setValue("foo");
    AspectBar bar = new AspectBar().setValue("bar");
    when(_mockLocalDAO.backfill(AspectFoo.class, urn)).thenReturn(Optional.of(foo));
    when(_mockLocalDAO.backfill(AspectBar.class, urn)).thenReturn(Optional.of(bar));

    String[] backfilledAspects = runAndWait(_resource.backfill(urn.toString(), new String[0]));

    assertEquals(ImmutableSet.copyOf(backfilledAspects),
        ImmutableSet.of(ModelUtils.getAspectName(AspectFoo.class), ModelUtils.getAspectName(AspectBar.class)));
  }

  @Test
  public void testBackfillWithInvalidUrn() {
    try {
      runAndWait(_resource.backfill("invalid urn", new String[]{ModelUtils.getAspectName(AspectFoo.class)}));
    } catch (RestLiServiceException e) {
      assertEquals(e.getStatus(), HttpStatus.S_400_BAD_REQUEST);
      return;
    }

    fail("No exception thrown");
  }
}
