package com.linkedin.datahub.upgrade.restorebackup.backupreader;

import com.linkedin.datahub.upgrade.UpgradeContext;
import java.io.IOException;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.apache.avro.generic.GenericRecord;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.security.UserGroupInformation;
import org.apache.parquet.avro.AvroParquetReader;
import org.apache.parquet.hadoop.ParquetReader;


/**
 * BackupReader for retrieving EbeanAspectV2 objects from a local parquet file
 */
@Slf4j
public class LocalParquetReader implements BackupReader {

  public LocalParquetReader() {
    // Need below to solve issue with hadoop path class not working in linux systems
    // https://stackoverflow.com/questions/41864985/hadoop-ioexception-failure-to-login
    UserGroupInformation.setLoginUser(UserGroupInformation.createRemoteUser("hduser"));
  }

  @Override
  public String getName() {
    return "LOCAL_PARQUET";
  }

  @Override
  public Optional<EbeanAspectBackupIterator> getBackupIterator(UpgradeContext context) {
    Optional<String> path = context.parsedArgs().get("BACKUP_FILE_PATH");
    if (!path.isPresent()) {
      context.report().addLine("BACKUP_FILE_PATH must be set to run RestoreBackup through local parquet file");
      return Optional.empty();
    }

    try {
      ParquetReader<GenericRecord> reader = AvroParquetReader.<GenericRecord>builder(new Path(path.get())).build();
      return Optional.of(new ParquetEbeanAspectBackupIterator(reader));
    } catch (IOException e) {
      context.report().addLine(String.format("Failed to build ParquetReader: %s", e));
      return Optional.empty();
    }
  }
}
