package com.linkedin.metadata.entity.datastax;

import java.sql.Timestamp;

// Dumb object for now

public class DatastaxAspect {
  private String urn;
  private String aspect;
  private long version;
  private String metadata;
  private String systemMetadata;
  private Timestamp createdOn;
  private String createdBy;
  private String createdfor;

  public String toString() {
    return String.format("urn: %s, aspect: %s, version: %s, metadata: %s, createdon: %s, createdby: %s, createdfor: %s, systemmetadata: %s",
                         urn, aspect, version, metadata, createdOn, createdBy, createdfor, systemMetadata
                  );
  }

  public static class PrimaryKey {
    private String urn;
    private String aspect;
    private long version;

    public PrimaryKey(String urn, String aspect, long version) {
      setUrn(urn);
      setAspect(aspect);
      setVersion(version);
    }

    public String getUrn() {
      return urn;
    }

    public void setUrn(String urn) {
      this.urn = urn;
    }

    public String getAspect() {
      return aspect;
    }

    public void setAspect(String aspect) {
      this.aspect = aspect;
    }

    public long getVersion() {
      return version;
    }

    public void setVersion(long version) {
      this.version = version;
    }
  }

  public DatastaxAspect() {
  }

  public PrimaryKey toPrimaryKey() {
    return new PrimaryKey(this.urn, this.aspect, this.version);
  }

  public DatastaxAspect(String urn,
                        String aspect,
                        long version,
                        String metadata,
                        String systemMetadata,
                        Timestamp createdOn,
                        String createdBy,
                        String createdFor) {
    this.urn = urn;
    this.aspect = aspect;
    this.version = version;
    this.metadata = metadata;
    this.systemMetadata = systemMetadata;
    this.createdOn = createdOn;
    this.createdBy = createdBy;
    createdfor = createdFor;
  }

  public String getCreatedfor() {
    return createdfor;
  }

  public void setCreatedfor(String createdfor) {
    this.createdfor = createdfor;
  }

  public String getAspect() {
    return aspect;
  }

  public void setAspect(String aspect) {
    this.aspect = aspect;
  }

  public long getVersion() {
    return version;
  }

  public void setVersion(long version) {
    this.version = version;
  }

  public String getMetadata() {
    return metadata;
  }

  public void setMetadata(String metadata) {
    this.metadata = metadata;
  }

  public String getSystemMetadata() {
    return systemMetadata;
  }

  public void setSystemMetadata(String systemMetadata) {
    this.systemMetadata = systemMetadata;
  }

  public Timestamp getCreatedOn() {
    return createdOn;
  }

  public void setCreatedOn(Timestamp createdOn) {
    this.createdOn = createdOn;
  }

  public String getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(String createdBy) {
    this.createdBy = createdBy;
  }

  public String getUrn() {
    return urn;
  }

  public void setUrn(String urn) {
    this.urn = urn;
  }
}