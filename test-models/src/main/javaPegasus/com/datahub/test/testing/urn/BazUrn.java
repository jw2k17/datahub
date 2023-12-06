package com.datahub.test.testing.urn;

import com.linkedin.common.urn.Urn;
import java.net.URISyntaxException;

public final class BazUrn extends Urn {

  public static final String ENTITY_TYPE = "baz";
  // Can be obtained via getEntityKey, but not in open source. We need to unify the internal /
  // external URN definitions.
  private final int _id;

  public BazUrn(int id) throws URISyntaxException {
    super(ENTITY_TYPE, Integer.toString(id));
    this._id = id;
  }

  public int getBazIdEntity() {
    return _id;
  }

  @Override
  public boolean equals(Object obj) {
    // Override for find bugs, bug delegate to super implementation, both in open source and
    // internally.
    return super.equals(obj);
  }

  @Override
  public int hashCode() {
    return super.hashCode();
  }

  public static BazUrn createFromString(String rawUrn) throws URISyntaxException {
    final Urn urn = Urn.createFromString(rawUrn);

    if (!ENTITY_TYPE.equals(urn.getEntityType())) {
      throw new URISyntaxException(urn.toString(), "Can't cast Urn to BazUrn, not same ENTITY");
    }

    return new BazUrn(urn.getIdAsInt());
  }
}
