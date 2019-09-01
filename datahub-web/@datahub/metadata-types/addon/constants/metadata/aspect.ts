import { MetadataAspect } from '@datahub/metadata-types/types/metadata/aspect';
import { Snapshot } from '@datahub/metadata-types/types/metadata/snapshot';

/**
 * An enumeration of MetadataAspect['metadata'] property keys
 * Defined as a record instead of an enum to bind the values to updates at the source-of-truth's (MetadataAspect['metadata'])
 * type definitions are reflected here
 * @type Record<string, keyof MetadataAspect['metadata']>
 */
export const SnapshotMetadataAspectKey: Record<string, keyof MetadataAspect> = {
  Ownership: 'com.linkedin.common.Ownership'
};

/**
 * Aliases the values in the constant enum SnapshotMetadataAspectKeyName, this is a union of strings that can be used to index the
 * metadata object on an instance of MetadataAspect
 * This creates a type of values found in the record above SnapshotMetadataAspectKey
 * essentially Object.values(SnapshotMetadataAspectKey) as a type
 * @type {string}
 */
export type SnapshotMetadataAspectKeyName = (typeof SnapshotMetadataAspectKey)[string];

/**
 * Takes a lookup key on the aspects metadata object, and returns an iteratee function that is truthy when it's argument
 * has a metadata object that matches the lookup key
 * @param {SnapshotMetadataAspectKeyName} metadataAspectKey the metadata aspect key to find on the aspect's metadata object
 * @returns {((aspect: ArrayElement<Snapshot['aspects']>) => boolean)}
 */
const getMetadataAspectWithMetadataAspectKey = (metadataAspectKey: SnapshotMetadataAspectKeyName) => (
  aspect: MetadataAspect
): boolean => aspect.hasOwnProperty(metadataAspectKey);

/**
 * Get the value of the specific metadata keyed by metadataAspectKey from the provided metadata aspect
 * @param {SnapshotMetadataAspectKeyName} metadataAspectKey a string from the enum SnapshotMetadataAspectKeyName, which is the list of keys that may
 * be found on the metadata pair of MetadataAspect instance
 * @param {MetadataAspect} [aspect] optional aspect to read the metadata key from
 * @returns {MetadataAspect['metadata'][SnapshotMetadataAspectKeyName]}
 */
const getMetadataAspectValue = (
  metadataAspectKey: SnapshotMetadataAspectKeyName,
  aspect: MetadataAspect
): MetadataAspect[SnapshotMetadataAspectKeyName] => (aspect ? aspect[metadataAspectKey] : undefined);

/**
 * Takes a metadata Snapshot instance e.g. IDatasetSnapshot or IMetricSnapshot,
 * and then returns a function that takes a SnapshotMetadataAspectKeyName to lookup the value of that aspect on the snapshot's list of
 * aspects.
 * A snapshot's aspects list can contain multiple metadata aspects, but each can only have one of the keys in SnapshotMetadataAspectKeyName
 * @param {Snapshot} snapshot the metadata snapshot to read from
 * @returns {(metadataAspectKey:SnapshotMetadataAspectKeyName) => MetadataAspect['metadata'][SnapshotMetadataAspectKeyName]}
 */
export const getMetadataAspect = (snapshot: Snapshot = {} as Snapshot) => (
  metadataAspectKey: SnapshotMetadataAspectKeyName
) => {
  const { aspects = [] } = snapshot;
  // Find the aspect with the metadata key that matches the passed in metadataAspectKey
  const [relevantAspect] = aspects.filter(getMetadataAspectWithMetadataAspectKey(metadataAspectKey));

  return relevantAspect ? getMetadataAspectValue(metadataAspectKey, relevantAspect) : undefined;
};
