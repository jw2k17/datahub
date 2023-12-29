package com.linkedin.metadata.models.registry.template.dataproduct;

import com.fasterxml.jackson.databind.JsonNode;
import com.linkedin.dataproduct.DataProductAssociationArray;
import com.linkedin.dataproduct.DataProductProperties;
import com.linkedin.metadata.models.registry.template.ArrayMergingTemplate;
import java.util.Collections;
import javax.annotation.Nonnull;

public class DataProductPropertiesTemplate implements ArrayMergingTemplate<DataProductProperties> {

  private static final String ASSETS_FIELD_NAME = "assets";
  private static final String KEY_FIELD_NAME = "destinationUrn";

  @Nonnull
  @Override
  public DataProductProperties getDefault() {
    DataProductProperties dataProductProperties = new DataProductProperties();
    dataProductProperties.setAssets(new DataProductAssociationArray());
    return dataProductProperties;
  }

  @Nonnull
  @Override
  public JsonNode transformFields(JsonNode baseNode) {
    return arrayFieldToMap(baseNode, ASSETS_FIELD_NAME, Collections.singletonList(KEY_FIELD_NAME));
  }

  @Nonnull
  @Override
  public JsonNode rebaseFields(JsonNode patched) {
    return transformedMapToArray(
        patched, ASSETS_FIELD_NAME, Collections.singletonList(KEY_FIELD_NAME));
  }
}
