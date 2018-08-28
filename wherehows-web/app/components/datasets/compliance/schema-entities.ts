import Component from '@ember/component';
import ComputedProperty, { not, alias } from '@ember/object/computed';
import { IComplianceDataType } from 'wherehows-web/typings/api/list/compliance-datatypes';
import {
  lowQualitySuggestionConfidenceThreshold,
  TagFilter,
  tagsRequiringReview,
  changeSetReviewableAttributeTriggers,
  getSupportedPurgePolicies,
  PurgePolicy,
  singleTagsInChangeSet,
  tagsForIdentifierField,
  tagsWithoutIdentifierType,
  ComplianceFieldIdValue,
  NonIdLogicalType,
  overrideTagReadonly,
  getDefaultSecurityClassification,
  SuggestionIntent,
  getFieldIdentifierOptions
} from 'wherehows-web/constants';
import { computed, get, set, getProperties, setProperties } from '@ember/object';
import { arrayMap, compact, iterateArrayAsync } from 'wherehows-web/utils/array';
import {
  IComplianceChangeSet,
  ISchemaFieldsToPolicy,
  ISchemaFieldsToSuggested,
  IdentifierFieldWithFieldChangeSetTuple,
  IComplianceEntityWithMetadata,
  IComplianceFieldIdentifierOption,
  IDropDownOption
} from 'wherehows-web/typings/app/dataset-compliance';
import { readPlatforms } from 'wherehows-web/utils/api/list/platforms';
import { IDatasetColumn } from 'wherehows-web/typings/api/datasets/columns';
import { getTagsSuggestions } from 'wherehows-web/utils/datasets/compliance-suggestions';
import { task, Task, TaskInstance } from 'ember-concurrency';
import {
  IComplianceInfo,
  ISuggestedFieldClassification,
  IComplianceSuggestion,
  IComplianceEntity
} from 'wherehows-web/typings/api/datasets/compliance';
import { assert } from '@ember/debug';
import { pluralize } from 'ember-inflector';
import { action } from '@ember-decorators/object';
import { noop } from 'wherehows-web/utils/helpers/functions';
import { IDataPlatform } from 'wherehows-web/typings/api/list/platforms';
import { IDatasetView } from 'wherehows-web/typings/api/datasets/dataset';
import { pick } from 'wherehows-web/utils/object';
import { TrackableEventCategory, trackableEvent } from 'wherehows-web/constants/analytics/event-tracking';
import { notificationDialogActionFactory } from 'wherehows-web/utils/notifications/notifications';
import Notifications, { NotificationEvent } from 'wherehows-web/services/notifications';
import { service } from '@ember-decorators/service';
import { isMetadataObject, jsonValuesMatch } from 'wherehows-web/utils/datasets/compliance/metadata-schema';

export default class ComplianceSchemaEntities extends Component {
  /**
   * Reference to the application notifications Service
   * @type {ComputedProperty<Notifications>}
   */
  @service
  notifications: Notifications;

  complianceInfo: undefined | IComplianceInfo;
  platform: IDatasetView['platform'];
  isCompliancePolicyAvailable: boolean = false;
  searchTerm: string;

  /**
   * Enum of categories that can be tracked for this component
   * @type {TrackableEventCategory}
   */
  trackableCategory = TrackableEventCategory;

  /**
   * Map of events that can be tracked
   * @type {ITrackableEventCategoryEvent}
   */
  trackableEvent = trackableEvent;

  /**
   * Flag determining whether or not we are in an editing state. This is passed in from the
   * dataset-compliance parent
   * @type {boolean}
   */
  isEditing: boolean;

  /**
   * Maybe not useful anymore, used when the dataset has not had any compliance info edits,
   * passed in from the dataset-compliance parent
   * @type {boolean}
   */
  isNewComplianceInfo: boolean;

  /**
   * List of complianceDataType values, passed in from the dataset-compliance parent
   * @type {Array<IComplianceDataType>}
   */
  complianceDataTypes: Array<IComplianceDataType>;

  /**
   * Convenience flag indicating the policy is not currently being edited
   * @type {ComputedProperty<boolean>}
   * @memberof ComplianceSchemaEntities
   */
  isReadOnly: ComputedProperty<boolean> = not('isEditing');

  /**
   * Confidence percentage number used to filter high quality suggestions versus lower quality, passed
   * in from dataset-compliance parent
   * @type {number}
   */
  suggestionConfidenceThreshold: number;

  /**
   * Flag indicating that the field names in each compliance row is truncated or rendered in full
   * @type {boolean}
   */
  isShowingFullFieldNames = true;

  /**
   * Flag indicating the current compliance policy edit-view mode. Guided mode involves fields and dropdowns
   * while the "advanced mode" is a direct json schema edit
   * @type {boolean}
   */
  showGuidedComplianceEditMode: boolean = true;

  /**
   * Flag indicating the readonly confirmation dialog should not be shown again for this compliance form
   * @type {boolean}
   */
  doNotShowReadonlyConfirmation: boolean = false;

  /**
   * Default to show all fields to review
   * @type {string}
   * @memberof ComplianceSchemaEntities
   */
  fieldReviewOption: TagFilter = TagFilter.showAll;

  /**
   * References the ComplianceFieldIdValue enum
   * @type {ComplianceFieldIdValue}
   */
  ComplianceFieldIdValue = ComplianceFieldIdValue;

  /**
   * Reduces the current filtered changeSet to a list of IdentifierFieldWithFieldChangeSetTuple
   * @type {Array<IdentifierFieldWithFieldChangeSetTuple>}
   * @memberof ComplianceSchemaEntities
   */
  foldedChangeSet: Array<IdentifierFieldWithFieldChangeSetTuple>;

  /**
   * The list of supported purge policies for the related platform
   * @type {Array<PurgePolicy>}
   * @memberof ComplianceSchemaEntities
   */
  supportedPurgePolicies: Array<PurgePolicy> = [];

  /**
   * Flag enabling or disabling the manual apply button
   * @type {boolean}
   * @memberof DatasetCompliance
   */
  isManualApplyDisabled: boolean = false;

  /**
   * String representation of a parse error that may have occurred when validating manually entered compliance entities
   * @type {string}
   * @memberof DatasetCompliance
   */
  manualParseError: string = '';

  /**
   * Lists the compliance entities that are entered via the advanced editing interface
   * @type {Pick<IComplianceInfo, 'complianceEntities'>}
   * @memberof DatasetCompliance
   */
  manuallyEnteredComplianceEntities: Pick<IComplianceInfo, 'complianceEntities'>;

  /**
   * A list of ui values and labels for review filter drop-down
   * @type {Array<{value: string, label:string}>}
   * @memberof ComplianceSchemaEntities
   */
  fieldReviewOptions: Array<{ value: TagFilter; label: string }> = [
    { value: TagFilter.showAll, label: 'Show all fields' },
    { value: TagFilter.showReview, label: 'Show required fields' },
    { value: TagFilter.showSuggested, label: 'Show suggested fields' }
  ];

  schemaFieldNamesMappedToDataTypes: Array<Pick<IDatasetColumn, 'dataType' | 'fieldName'>>;

  /**
   * Computed prop over the current Id fields in the Privacy Policy
   * @type {ISchemaFieldsToPolicy}
   */
  columnIdFieldsToCurrentPrivacyPolicy: ISchemaFieldsToPolicy;

  /**
   * Suggested values for compliance types e.g. identifier type and/or logical type
   * @type {IComplianceSuggestion | void}
   */
  complianceSuggestion: IComplianceSuggestion | void;

  onComplianceJsonUpdate: (jsonString: string) => Promise<void>;
  notifyOnChangeSetSuggestions: (hasSuggestions: boolean) => void;
  notifyOnChangeSetRequiresReview: (hasChangeSetDrift: boolean) => void;
  notifyOnComplianceSuggestionFeedback: () => void;

  /**
   * The changeSet tags that require user attention
   * @type {ComputedProperty<Array<IComplianceChangeSet>>}
   * @memberof ComplianceSchemaEntities
   */
  changeSetReview: Array<IComplianceChangeSet>;

  /**
   * Filters out the compliance tags requiring review excluding tags that require review,
   * due to a suggestion mismatch with the current tag identifierType
   * This drives the initialStep review check and fulfills the use-case,
   * where the user can proceed with the compliance update, without
   * being required to resolve a suggestion mismatch
   * @type {ComputedProperty<Array<IComplianceChangeSet>>}
   * @memberof DatasetCompliance
   */
  changeSetReviewWithoutSuggestionCheck = computed('changeSetReview', function(
    this: ComplianceSchemaEntities
  ): Array<IComplianceChangeSet> {
    return tagsRequiringReview(get(this, 'complianceDataTypes'), {
      checkSuggestions: false,
      suggestionConfidenceThreshold: 0 // irrelevant value set to 0 since checkSuggestions flag is false above
    })(get(this, 'changeSetReview'));
  });

  /**
   * Returns a count of changeSet tags that require user attention
   * @type {ComputedProperty<number>}
   * @memberof ComplianceSchemaEntities
   */
  changeSetReviewCount = alias('changeSetReview.length');

  /**
   * Computes a cta string for the selected field review filter option
   * @type {ComputedProperty<string>}
   * @memberof ComplianceSchemaEntities
   */
  fieldReviewHint: ComputedProperty<string> = computed('fieldReviewOption', 'changeSetReviewCount', function(
    this: ComplianceSchemaEntities
  ): string {
    type TagFilterHint = { [K in TagFilter]: string };

    const { fieldReviewOption, changeSetReviewCount } = getProperties(this, [
      'fieldReviewOption',
      'changeSetReviewCount'
    ]);

    const hint = (<TagFilterHint>{
      [TagFilter.showAll]: `${pluralize(changeSetReviewCount, 'field')} to be reviewed`,
      [TagFilter.showReview]: 'It is required to select compliance info for all fields',
      [TagFilter.showSuggested]: 'Please review suggestions and provide feedback'
    })[fieldReviewOption];

    return changeSetReviewCount ? hint : '';
  });

  /**
   * Creates a mapping of compliance suggestions to identifierField
   * This improves performance in a subsequent merge op since this loop
   * happens only once and is cached
   * @type {ComputedProperty<ISchemaFieldsToSuggested>}
   * @memberof ComplianceSchemaEntities
   */
  identifierFieldToSuggestion = computed('complianceSuggestion', function(
    this: ComplianceSchemaEntities
  ): ISchemaFieldsToSuggested {
    const fieldSuggestions: ISchemaFieldsToSuggested = {};
    const complianceSuggestion = get(this, 'complianceSuggestion') || {
      lastModified: 0,
      suggestedFieldClassification: <Array<ISuggestedFieldClassification>>[]
    };
    const { lastModified: suggestionsModificationTime, suggestedFieldClassification = [] } = complianceSuggestion;

    // If the compliance suggestions array contains suggestions the create reduced lookup map,
    // otherwise, ignore
    if (suggestedFieldClassification.length) {
      return suggestedFieldClassification.reduce(
        (
          fieldSuggestions: ISchemaFieldsToSuggested,
          { suggestion: { identifierField, identifierType, logicalType, securityClassification }, confidenceLevel, uid }
        ) => ({
          ...fieldSuggestions,
          [identifierField]: {
            identifierType,
            logicalType,
            securityClassification,
            confidenceLevel,
            uid,
            suggestionsModificationTime
          }
        }),
        fieldSuggestions
      );
    }

    return fieldSuggestions;
  });

  /**
   * Caches a reference to the generated list of merged data between the column api and the current compliance entities list
   * @type {ComputedProperty<IComplianceChangeSet>}
   * @memberof ComplianceSchemaEntities
   */
  compliancePolicyChangeSet: Array<IComplianceChangeSet>;

  /**
   * Returns a list of changeSet fields that meets the user selected filter criteria
   * @type {ComputedProperty<IComplianceChangeSet>}
   * @memberof ComplianceSchemaEntities
   */
  filteredChangeSet: Array<IComplianceChangeSet>;

  /**
   * Lists the IComplianceChangeSet / tags without an identifierType value
   * @type {ComputedProperty<Array<IComplianceChangeSet>>}
   * @memberof ComplianceSchemaEntities
   */
  unspecifiedTags = computed(`compliancePolicyChangeSet.@each.{${changeSetReviewableAttributeTriggers}}`, function(
    this: ComplianceSchemaEntities
  ): Array<IComplianceChangeSet> {
    const tags = get(this, 'compliancePolicyChangeSet');
    const singleTags = singleTagsInChangeSet(tags, tagsForIdentifierField);

    return tagsWithoutIdentifierType(singleTags);
  });

  /**
   * Formatted JSON string representing the compliance entities for this dataset
   * @type {ComputedProperty<string>}
   */
  jsonComplianceEntities: ComputedProperty<string> = computed('columnIdFieldsToCurrentPrivacyPolicy', function(
    this: ComplianceSchemaEntities
  ): string {
    const entityAttrs: Array<keyof IComplianceEntity> = [
      'identifierField',
      'identifierType',
      'logicalType',
      'nonOwner',
      'valuePattern',
      'readonly'
    ];
    const entityMap: ISchemaFieldsToPolicy = get(this, 'columnIdFieldsToCurrentPrivacyPolicy');
    const entitiesWithModifiableKeys = arrayMap((tag: IComplianceEntityWithMetadata) => pick(tag, entityAttrs))(
      (<Array<IComplianceEntityWithMetadata>>[]).concat(...Object.values(entityMap))
    );

    return JSON.stringify(entitiesWithModifiableKeys, null, '\t');
  });

  /**
   * Reads the complianceDataTypes property and transforms into a list of drop down options for the field
   * identifier type
   * @type {ComputedProperty<Array<IComplianceFieldIdentifierOption  | IDropDownOption<null | 'NONE'>>>}
   */
  complianceFieldIdDropdownOptions = computed('complianceDataTypes', function(
    this: ComplianceSchemaEntities
  ): Array<IComplianceFieldIdentifierOption | IDropDownOption<null | ComplianceFieldIdValue.None>> {
    // object with interface IComplianceDataType and an index number indicative of position
    type IndexedComplianceDataType = IComplianceDataType & { index: number };

    const noneDropDownOption: IDropDownOption<ComplianceFieldIdValue.None> = {
      value: ComplianceFieldIdValue.None,
      label: 'None'
    };
    // Creates a list of IComplianceDataType each with an index. The intent here is to perform a stable sort on
    // the items in the list, Array#sort is not stable, so for items that equal on the primary comparator
    // break the tie based on position in original list
    const indexedDataTypes: Array<IndexedComplianceDataType> = (get(this, 'complianceDataTypes') || []).map(
      (type, index): IndexedComplianceDataType => ({
        ...type,
        index
      })
    );

    /**
     * Compares each compliance data type, ensure that positional order is maintained
     * @param {IComplianceDataType} a the compliance type to compare
     * @param {IComplianceDataType} b the other
     * @returns {number} 0, 1, -1 indicating sort order
     */
    const dataTypeComparator = (a: IndexedComplianceDataType, b: IndexedComplianceDataType): number => {
      const { idType: aIdType, index: aIndex } = a;
      const { idType: bIdType, index: bIndex } = b;
      // Convert boolean values to number type
      const typeCompare = Number(aIdType) - Number(bIdType);

      // True types first, hence negation
      // If types are same, then sort on original position i.e stable sort
      return typeCompare ? -typeCompare : aIndex - bIndex;
    };

    /**
     * Inserts a divider in the list of compliance field identifier options
     * @param {Array<IComplianceFieldIdentifierOption>} types
     * @returns {Array<IComplianceFieldIdentifierOption>}
     */
    const insertDividers = (
      types: Array<IComplianceFieldIdentifierOption>
    ): Array<IComplianceFieldIdentifierOption> => {
      const isId = ({ isId }: IComplianceFieldIdentifierOption): boolean => isId;
      const ids = types.filter(isId);
      const nonIds = types.filter((type): boolean => !isId(type));
      //divider to indicate section for ids
      const idsDivider = { value: '', label: 'First Party IDs', isDisabled: true };
      // divider to indicate section for non ids
      const nonIdsDivider = { value: '', label: 'Non First Party IDs', isDisabled: true };

      return [
        <IComplianceFieldIdentifierOption>idsDivider,
        ...ids,
        <IComplianceFieldIdentifierOption>nonIdsDivider,
        ...nonIds
      ];
    };

    return [
      noneDropDownOption,
      ...insertDividers(getFieldIdentifierOptions(indexedDataTypes.sort(dataTypeComparator)))
    ];
  });

  /**
   * Invokes external action with flag indicating that at least 1 suggestion exists for a field in the changeSet
   * @param {number} suggestionConfidenceThreshold confidence threshold for filtering out higher quality suggestions
   * @param {Array<IComplianceChangeSet>} changeSet
   */
  notifyHandlerOfSuggestions = (
    suggestionConfidenceThreshold: number,
    changeSet: Array<IComplianceChangeSet>
  ): void => {
    const hasChangeSetSuggestions = !!compact(getTagsSuggestions({ suggestionConfidenceThreshold })(changeSet)).length;
    this.notifyOnChangeSetSuggestions(hasChangeSetSuggestions);
  };

  /**
   * Invokes external action with flag indicating that a field in the tags requires user review
   * @param {number} suggestionConfidenceThreshold confidence threshold for filtering out higher quality suggestions
   * @param {Array<IComplianceDataType>} complianceDataTypes
   * @param {Array<IComplianceChangeSet>} tags
   */
  notifyHandlerOfFieldsRequiringReview = (
    suggestionConfidenceThreshold: number,
    complianceDataTypes: Array<IComplianceDataType>,
    tags: Array<IComplianceChangeSet>
  ): void => {
    // adding assertions for run-loop callback invocation, because static type checks are bypassed
    assert('expected complianceDataTypes to be of type `array`', Array.isArray(complianceDataTypes));
    assert('expected tags to be of type `array`', Array.isArray(tags));

    const hasChangeSetDrift = !!tagsRequiringReview(complianceDataTypes, {
      checkSuggestions: true,
      suggestionConfidenceThreshold
    })(tags).length;

    this.notifyOnChangeSetRequiresReview(hasChangeSetDrift);
  };

  /**
   * Sets the default classification for the given identifier field's tag
   * Using the identifierType, determine the tag's default security classification based on a values
   * supplied by complianceDataTypes endpoint
   * @param {string} identifierField the field for which the default classification should apply
   * @param {ComplianceFieldIdValue} identifierType the value of the field's identifier type
   */
  setDefaultClassification(
    this: ComplianceSchemaEntities,
    { identifierField, identifierType }: Pick<IComplianceEntity, 'identifierField' | 'identifierType'>
  ): void {
    const complianceDataTypes = get(this, 'complianceDataTypes');
    const defaultSecurityClassification = getDefaultSecurityClassification(complianceDataTypes, identifierType);

    this.actions.tagClassificationChanged.call(this, { identifierField }, { value: defaultSecurityClassification });
  }

  /**
   * Task to retrieve platform policies and set supported policies for the current platform
   * @type {Task<Promise<any>, () => TaskInstance<Promise<any>>>}
   * @memberof ComplianceSchemaEntities
   */
  foldChangeSetTask: Task<Promise<any>, () => TaskInstance<Promise<any>>>;

  /**
   * Task to retrieve platform policies and set supported policies for the current platform
   * @type {Task<Promise<Array<IDataPlatform>>, () => TaskInstance<Promise<Array<IDataPlatform>>>>}
   * @memberof ComplianceSchemaEntities
   */
  getPlatformPoliciesTask = task(function*(
    this: ComplianceSchemaEntities
  ): IterableIterator<Promise<Array<IDataPlatform>>> {
    const platform = get(this, 'platform');

    if (platform) {
      set(this, 'supportedPurgePolicies', getSupportedPurgePolicies(platform, yield readPlatforms()));
    }
  }).restartable();

  /**
   * Sets the identifierType attribute on IComplianceChangeSetFields without an identifierType to ComplianceFieldIdValue.None
   * @returns {Promise<Array<IComplianceChangeSet>>}
   */
  setUnspecifiedTagsAsNoneTask = task(function*(
    this: ComplianceSchemaEntities
  ): IterableIterator<Promise<Array<ComplianceFieldIdValue | NonIdLogicalType>>> {
    const unspecifiedTags = get(this, 'unspecifiedTags');
    const setTagIdentifier = (value: ComplianceFieldIdValue | NonIdLogicalType) => (tag: IComplianceChangeSet) =>
      set(tag, 'identifierType', value);

    yield iterateArrayAsync(arrayMap(setTagIdentifier(ComplianceFieldIdValue.None)))(unspecifiedTags);
  }).drop();

  constructor() {
    super(...arguments);
    // Setting default values for passed in properties
    typeof this.isEditing === 'boolean' || (this.isEditing = false);
    typeof this.isNewComplianceInfo === 'boolean' || (this.isNewComplianceInfo = false);
    this.compliancePolicyChangeSet || (this.compliancePolicyChangeSet = []);
    this.searchTerm || set(this, 'searchTerm', '');
    typeof this.suggestionConfidenceThreshold === 'number' ||
      (this.suggestionConfidenceThreshold = lowQualitySuggestionConfidenceThreshold);
    this.complianceDataTypes || (this.complianceDataTypes = []);
    // this.schemaFieldNamesMappedToDataTypes || (this.schemaFieldNamesMappedToDataTypes = []);
    this.columnIdFieldsToCurrentPrivacyPolicy || (this.columnIdFieldsToCurrentPrivacyPolicy = {});
    this.changeSetReview || (this.changeSetReview = []);
  }

  /**
   * Updates the fieldReviewOption with the user selected value
   * @param {{value: TagFilter}} { value }
   * @returns {TagFilter}
   */
  @action
  onFieldReviewChange(this: ComplianceSchemaEntities, { value }: { value: TagFilter }): TagFilter {
    const option = set(this, 'fieldReviewOption', value);
    get(this, 'foldChangeSetTask').perform();

    return option;
  }

  /**
   * Toggles the flag isShowingFullFieldNames when invoked
   */
  @action
  onFieldDblClick(): void {
    this.toggleProperty('isShowingFullFieldNames');
  }

  /**
   * Adds a new field tag to the list of compliance change set items
   * @param {IComplianceChangeSet} tag properties for new field tag
   * @return {IComplianceChangeSet}
   */
  @action
  onFieldTagAdded(this: ComplianceSchemaEntities, tag: IComplianceChangeSet): void {
    get(this, 'compliancePolicyChangeSet').addObject(tag);
    get(this, 'foldChangeSetTask').perform();
  }

  /**
   * Removes a field tag from the list of compliance change set items
   * @param {IComplianceChangeSet} tag
   * @return {IComplianceChangeSet}
   */
  @action
  onFieldTagRemoved(this: ComplianceSchemaEntities, tag: IComplianceChangeSet): void {
    get(this, 'compliancePolicyChangeSet').removeObject(tag);
    get(this, 'foldChangeSetTask').perform();
  }

  /**
   * Disables the readonly attribute of a compliance policy changeSet tag,
   * allowing the user to override properties on the tag
   * @param {IComplianceChangeSet} tag the IComplianceChangeSet instance
   */
  @action
  async onTagReadOnlyDisable(this: ComplianceSchemaEntities, tag: IComplianceChangeSet): Promise<void> {
    const { dialogActions, dismissedOrConfirmed } = notificationDialogActionFactory();
    const {
      doNotShowReadonlyConfirmation,
      notifications: { notify }
    } = getProperties(this, ['doNotShowReadonlyConfirmation', 'notifications']);

    if (doNotShowReadonlyConfirmation) {
      overrideTagReadonly(tag);
      return;
    }

    notify(NotificationEvent.confirm, {
      header: 'Are you sure you would like to modify this field?',
      content:
        "This field's compliance information is currently readonly, please confirm if you would like to override this value",
      dialogActions,
      toggleText: 'Do not show this again for this dataset',
      onDialogToggle: (doNotShow: boolean): boolean => set(this, 'doNotShowReadonlyConfirmation', doNotShow)
    });

    try {
      await dismissedOrConfirmed;
      overrideTagReadonly(tag);
    } catch (e) {
      return;
    }
  }

  /**
   * When a user updates the identifierFieldType, update working copy
   * @param {IComplianceChangeSet} tag
   * @param {ComplianceFieldIdValue} identifierType
   */
  @action
  tagIdentifierChanged(
    this: ComplianceSchemaEntities,
    tag: IComplianceChangeSet,
    { value: identifierType }: { value: ComplianceFieldIdValue }
  ): void {
    const { identifierField } = tag;
    if (tag) {
      setProperties(tag, {
        identifierType,
        logicalType: null,
        nonOwner: null,
        isDirty: true,
        valuePattern: null
      });
    }

    this.setDefaultClassification({ identifierField, identifierType });
  }

  /**
   * Augments the tag props with a suggestionAuthority indicating that the tag
   * suggestion has either been accepted or ignored, and assigns the value of that change to the prop
   * @param {IComplianceChangeSet} tag tag for which this suggestion intent should apply
   * @param {SuggestionIntent} [intent=SuggestionIntent.ignore] user's intended action for suggestion, Defaults to `ignore`
   */
  @action
  onFieldSuggestionIntentChange(
    this: ComplianceSchemaEntities,
    tag: IComplianceChangeSet,
    intent: SuggestionIntent = SuggestionIntent.ignore
  ): void {
    set(tag, 'suggestionAuthority', intent);
  }

  /**
   * Applies wholesale user changes to a field tag's properties
   * @param {IComplianceChangeSet} tag a reference to the current tag object
   * @param {IComplianceChangeSet} tagUpdates updated properties to be applied to the current tag
   */
  @action
  tagPropertiesUpdated(tag: IComplianceChangeSet, tagUpdates: IComplianceChangeSet) {
    console.log('tag properties updated');
    console.log(tagUpdates);
    setProperties(tag, tagUpdates);
    console.log(JSON.stringify(tag));
  }

  /**
   * Toggle the visibility of the guided compliance edit view vs the advanced edit view modes
   * @param {boolean} toggle flag ,if true, show guided edit mode, otherwise, advanced
   */
  @action
  onShowGuidedEditMode(this: ComplianceSchemaEntities, toggle: boolean): void {
    const isShowingGuidedEditMode = set(this, 'showGuidedComplianceEditMode', toggle);

    if (!isShowingGuidedEditMode) {
      this.actions.onManualComplianceUpdate.call(this, get(this, 'jsonComplianceEntities'));
    }
  }

  /**
   * Handles updating the list of compliance entities when a user manually enters values
   * for the compliance entity metadata
   * @param {string} updatedEntities json string of entities
   */
  @action
  onManualComplianceUpdate(this: ComplianceSchemaEntities, updatedEntities: string): void {
    try {
      // check if the string is parse-able as a JSON object
      const entities = JSON.parse(updatedEntities);
      const metadataObject = {
        complianceEntities: entities
      };
      // Check that metadataObject has a valid property matching complianceEntitiesTaxonomy
      let isValid = isMetadataObject(metadataObject);

      // Lists the fieldNames / identifierField property values on the edit compliance policy
      const updatedIdentifierFieldValues = new Set(
        arrayMap(({ identifierField }: IComplianceEntity) => identifierField)(entities)
      );
      // Lists the expected fieldNames / identifierField property values from the schemaFieldNamesMappedToDataTypes
      const expectedIdentifierFieldValues = arrayMap(
        ({ fieldName }: Pick<IDatasetColumn, 'dataType' | 'fieldName'>) => fieldName
      )(get(this, 'schemaFieldNamesMappedToDataTypes'));

      isValid = isValid && jsonValuesMatch([...updatedIdentifierFieldValues], expectedIdentifierFieldValues);

      setProperties(this, { isManualApplyDisabled: !isValid, manualParseError: '' });

      if (isValid) {
        set(this, 'manuallyEnteredComplianceEntities', metadataObject);
      }
    } catch (e) {
      setProperties(this, { isManualApplyDisabled: true, manualParseError: e.message });
    }
  }

  /**
   * Handler to apply manually entered compliance entities to the actual list of
   * compliance metadata entities to be saved
   */
  @action
  async onApplyComplianceJson(this: ComplianceSchemaEntities) {
    try {
      await get(this, 'onComplianceJsonUpdate')(JSON.stringify(get(this, 'manuallyEnteredComplianceEntities')));
      // Proceed to next step if application of entities is successful
      this.actions.nextStep.call(this);
    } catch {
      noop();
    }
  }
}
