package datahub.spark.model.dataset;

import org.apache.hadoop.fs.Path;

import com.linkedin.common.FabricType;

import lombok.ToString;

import java.net.URI;

@ToString
public class HdfsPathDataset extends SparkDataset {

  private static String getPath(Path path, boolean includeScheme) {
    URI uri = path.toUri();
    String = uri.getScheme();
    if (includeScheme) {
      /* S3 paths ingested into Datahub through the S3 Data Lake Soure
         do not have s3*:// in their name.  Remove this from the URI before setting the path.
       */
      if (scheme.equals("s3a") || scheme.equals("s3n")) {
        toRemove = scheme + "://";
        return uri.toString().replace(toRemove, "");
      }
      return uri.toString();
    } else {
      return uri.getHost() + uri.getPath();
    }
  }

  private static String getPlatform(Path path) {
    String scheme = path.toUri().getScheme();
    if (scheme.equals("s3a") || scheme.equals("s3n")) {
      return "s3";
    } else {
      return scheme;
    }
  }

  public HdfsPathDataset(Path path, String platformInstance, boolean includeScheme, FabricType fabricType) {
    // TODO check static partitions?
    this(getPath(path, includeScheme), platformInstance, getPlatform(path), fabricType);
  }

  public HdfsPathDataset(String pathUri, String platformInstance, String platform, FabricType fabricType) {
    // TODO check static partitions?
    super(platform, platformInstance, pathUri, fabricType);
  }

}
