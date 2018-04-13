import Component from '@ember/component';
import { computed, set, get, setProperties, getProperties, getWithDefault } from '@ember/object';
import ComputedProperty, { not, or } from '@ember/object/computed';
import { run, schedule, next } from '@ember/runloop';
import { inject } from '@ember/service';
import { classify } from '@ember/string';
import { assert } from '@ember/debug';
import { IDatasetView } from 'wherehows-web/typings/api/datasets/dataset';
import { IDataPlatform } from 'wherehows-web/typings/api/list/platforms';
import { readPlatforms } from 'wherehows-web/utils/api/list/platforms';
import { task, TaskInstance } from 'ember-concurrency';
import {
  getSecurityClassificationDropDownOptions,
  DatasetClassifiers,
  getFieldIdentifierOptions,
  getDefaultSecurityClassification,
  compliancePolicyStrings,
  getComplianceSteps,
  isExempt,
  ComplianceFieldIdValue,
  IDatasetClassificationOption,
  DatasetClassification,
  SuggestionIntent,
  PurgePolicy,
  getSupportedPurgePolicies,
  mergeMappedColumnFieldsWithSuggestions,
  getFieldsRequiringReview,
  isFieldIdType,
  idTypeFieldsHaveLogicalType,
  changeSetFieldsRequiringReview,
  changeSetReviewableAttributeTriggers,
  mapSchemaColumnPropsToCurrentPrivacyPolicy,
  foldComplianceChangeSets
} from 'wherehows-web/constants';
import { isPolicyExpectedShape } from 'wherehows-web/utils/datasets/compliance-policy';
import scrollMonitor from 'scrollmonitor';
import { getFieldsSuggestions } from 'wherehows-web/utils/datasets/compliance-suggestions';
import { compact, isListUnique } from 'wherehows-web/utils/array';
import noop from 'wherehows-web/utils/noop';
import { IComplianceDataType } from 'wherehows-web/typings/api/list/compliance-datatypes';
import Notifications, { NotificationEvent, IConfirmOptions } from 'wherehows-web/services/notifications';
import { IDatasetColumn } from 'wherehows-web/typings/api/datasets/columns';
import {
  IComplianceInfo,
  IComplianceEntity,
  ISuggestedFieldClassification,
  IComplianceSuggestion
} from 'wherehows-web/typings/api/datasets/compliance';
import {
  IComplianceChangeSet,
  IComplianceFieldIdentifierOption,
  IDatasetComplianceActions,
  IdentifierFieldWithFieldChangeSetTuple,
  IDropDownOption,
  ISchemaFieldsToPolicy,
  ISchemaFieldsToSuggested,
  ISecurityClassificationOption,
  ShowAllShowReview
} from 'wherehows-web/typings/app/dataset-compliance';
import { uniqBy } from 'lodash';

const {
  complianceDataException,
  complianceFieldNotUnique,
  missingTypes,
  helpText,
  successUploading,
  invalidPolicyData,
  missingPurgePolicy,
  missingDatasetSecurityClassification
} = compliancePolicyStrings;

/**
 * String constant referencing the datasetClassification on the privacy policy
 * @type {string}
 */
const datasetClassificationKey = 'complianceInfo.datasetClassification';
/**
 * A list of available keys for the datasetClassification map on the security specification
 * @type {Array<keyof typeof DatasetClassifiers>}
 */
const datasetClassifiersKeys = <Array<keyof typeof DatasetClassifiers>>Object.keys(DatasetClassifiers);

/**
 * A reference to the compliance policy entities on the complianceInfo map
 * @type {string}
 */
const policyComplianceEntitiesKey = 'complianceInfo.complianceEntities';

/**
 * The initial state of the compliance step for a zero based array
 * @type {number}
 */
const initialStepIndex = -1;

export default class DatasetCompliance extends Component {
  isNewComplianceInfo: boolean;
  datasetName: string;
  sortColumnWithName: string;
  filterBy: string;
  sortDirection: string;
  searchTerm: string;
  helpText = helpText;
  watchers: Array<{ stateChange: (fn: () => void) => void; watchItem: Element; destroy?: Function }>;
  complianceWatchers: WeakMap<Element, {}>;
  _hasBadData: boolean;
  platform: IDatasetView['platform'];
  isCompliancePolicyAvailable: boolean = false;
  showAllDatasetMemberData: boolean;
  complianceInfo: void | IComplianceInfo;

  /**
   * Suggested values for compliance types e.g. identifier type and/or logical type
   * @type {IComplianceSuggestion | void}
   */
  complianceSuggestion: IComplianceSuggestion | void;

  schemaFieldNamesMappedToDataTypes: Array<Pick<IDatasetColumn, 'dataType' | 'fieldName'>>;
  onReset: <T>() => Promise<T>;
  onSave: <T>() => Promise<T>;
  notifyOnChangeSetSuggestions: (hasSuggestions: boolean) => void;
  notifyOnChangeSetRequiresReview: (hasChangeSetDrift: boolean) => void;

  classNames = ['compliance-container'];

  classNameBindings = ['isEditing:compliance-container--edit-mode'];

  /**
   * Reference to the application notifications Service
   * @type {ComputedProperty<Notifications>}
   */
  notifications: ComputedProperty<Notifications> = inject();

  /**
   * Flag indicating that the related dataset is schemaless or has a schema
   * @type {boolean}
   * @memberof DatasetCompliance
   */
  schemaless: boolean;
  /**
   * Tracks the current index of the compliance policy update wizard flow
   * @type {number}
   * @memberof DatasetCompliance
   */
  editStepIndex: number;

  /**
   * List of complianceDataType values
   * @type {Array<IComplianceDataType>}
   * @memberof DatasetCompliance
   */
  complianceDataTypes: Array<IComplianceDataType>;

  // Map of classifiers options for drop down
  classifiers: Array<ISecurityClassificationOption> = getSecurityClassificationDropDownOptions();

  /**
   * Default to show all fields to review
   * @type {string}
   * @memberof DatasetCompliance
   */
  fieldReviewOption: 'showReview' | 'showAll' = 'showAll';

  /**
   * Flag indicating that the component is in edit mode
   * @type {ComputedProperty<boolean>}
   * @memberof DatasetCompliance
   */
  isEditing = computed('editStepIndex', 'complianceInfo.fromUpstream', function(this: DatasetCompliance): boolean {
    // initialStepIndex is less than the currently set step index
    return get(this, 'editStepIndex') > initialStepIndex;
  });

  /**
   * Convenience flag indicating the policy is not currently being edited
   * @type {ComputedProperty<boolean>}
   * @memberof DatasetCompliance
   */
  isReadOnly = not('isEditing');

  /**
   * Flag indicating that the component is currently saving / attempting to save the privacy policy
   * @type {boolean}
   * @memberof DatasetCompliance
   */
  isSaving = false;

  /**
   * The list of supported purge policies for the related platform
   * @type {Array<PurgePolicy>}
   * @memberof DatasetCompliance
   */
  supportedPurgePolicies: Array<PurgePolicy> = [];

  constructor() {
    super(...arguments);

    //sets default values for class fields
    this.editStepIndex = initialStepIndex;
    this.sortColumnWithName || set(this, 'sortColumnWithName', 'identifierField');
    this.filterBy || set(this, 'filterBy', 'identifierField');
    this.sortDirection || set(this, 'sortDirection', 'asc');
    this.searchTerm || set(this, 'searchTerm', '');
    this.schemaFieldNamesMappedToDataTypes || (this.schemaFieldNamesMappedToDataTypes = []);
    this.complianceDataTypes || (this.complianceDataTypes = []);
  }

  /**
   * Lists the compliance wizard edit steps based on the datasets schemaless property
   * @memberof DatasetCompliance
   */
  editSteps = computed('schemaless', function(this: DatasetCompliance): Array<{ name: string }> {
    const hasSchema = !getWithDefault(this, 'schemaless', false);
    const steps = getComplianceSteps(hasSchema);

    // Ensure correct step ordering
    return Object.keys(steps)
      .sort()
      .map((key: string) => steps[+key]);
  });

  /**
   * Reads the complianceDataTypes property and transforms into a list of drop down options for the field
   * identifier type
   * @type {ComputedProperty<Array<IComplianceFieldIdentifierOption  | IDropDownOption<null | 'NONE'>>>}
   */
  complianceFieldIdDropdownOptions = computed('complianceDataTypes', function(
    this: DatasetCompliance
  ): Array<IComplianceFieldIdentifierOption | IDropDownOption<null | ComplianceFieldIdValue.None>> {
    type NoneAndUnspecifiedOptions = Array<IDropDownOption<null | ComplianceFieldIdValue.None>>;
    // object with interface IComplianceDataType and an index number indicative of position
    type IndexedComplianceDataType = IComplianceDataType & { index: number };

    const noneAndUnSpecifiedDropdownOptions: NoneAndUnspecifiedOptions = [
      { value: null, label: 'Select Field Type...', isDisabled: true },
      { value: ComplianceFieldIdValue.None, label: 'None' }
    ];
    // Creates a list of IComplianceDataType each with an index. The intent here is to perform a stable sort on
    // the items in the list, Array#sort is not stable, so for items that equal on the primary comparator
    // break the tie based on position in original list
    const indexedDataTypes: Array<IndexedComplianceDataType> = (get(this, 'complianceDataTypes') || []).map(
      (type, index) => ({
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
     * Inserts a divider in the list of compliance field identifier dropdown options
     * @param {Array<IComplianceFieldIdentifierOption>} types
     * @returns {Array<IComplianceFieldIdentifierOption>}
     */
    const insertDivider = (types: Array<IComplianceFieldIdentifierOption>): Array<IComplianceFieldIdentifierOption> => {
      const isId = ({ isId }: IComplianceFieldIdentifierOption): boolean => isId;
      const ids = types.filter(isId);
      const nonIds = types.filter(type => !isId(type));
      const divider = {
        value: '',
        label: '---------',
        isId: false,
        isDisabled: true
      };

      return [...ids, <IComplianceFieldIdentifierOption>divider, ...nonIds];
    };

    return [
      ...noneAndUnSpecifiedDropdownOptions,
      ...insertDivider(getFieldIdentifierOptions(indexedDataTypes.sort(dataTypeComparator)))
    ];
  });

  /**
   * e-c Task to update the current edit step in the wizard flow.
   * Handles the transitions between steps, including performing each step's
   * post processing action once a user has completed a step, or reverting the step
   * and stepping backward if the post process fails
   * @type {Task<void, (a?: void) => TaskInstance<void>>}
   * @memberof DatasetCompliance
   */
  updateEditStepTask = (function() {
    // initialize the previous action with a no-op function
    let previousAction = noop;
    // initialize the last seen index to the same value as editStepIndex
    let lastIndex = initialStepIndex;

    return task(function*(this: DatasetCompliance): IterableIterator<void> {
      const { editStepIndex: currentIndex, editSteps } = getProperties(this, ['editStepIndex', 'editSteps']);
      // the current step in the edit sequence
      const editStep = editSteps[currentIndex] || { name: '' };
      const { name } = editStep;

      if (name) {
        // using the steps name, construct a reference to the step process handler
        const nextAction = this.actions[`did${classify(name)}`];
        let previousActionResult: void;

        // if the transition is backward, then the previous action is ignored
        currentIndex > lastIndex && (previousActionResult = previousAction.call(this));
        lastIndex = currentIndex;

        try {
          yield previousActionResult;
          // if the previous action is resolved successfully, then replace with the next processor
          previousAction = typeof nextAction === 'function' ? nextAction : noop;

          set(this, 'editStep', editStep);
        } catch {
          // if the previous action settles in a rejected state, replace with no-op before
          // invoking the previousStep action to go back in the sequence
          // batch previousStep invocation in a afterRender queue due to editStepIndex update
          previousAction = noop;
          run(() => {
            if (this.isDestroyed || this.isDestroying) {
              return;
            }
            schedule('afterRender', this, this.actions.previousStep);
          });
        }
      }
    }).enqueue();
  })();

  /**
   * Holds a reference to the current step in the compliance edit wizard flow
   * @type {{ name: string }}
   */
  editStep: { name: string };

  /**
   * A list of ui values and labels for review filter drop-down
   * @type {Array<{value: string, label:string}>}
   * @memberof DatasetCompliance
   */
  fieldReviewOptions: Array<{ value: DatasetCompliance['fieldReviewOption']; label: string }> = [
    { value: 'showAll', label: 'Showing all fields' },
    { value: 'showReview', label: 'Showing only fields to review' }
  ];

  didReceiveAttrs(this: DatasetCompliance) {
    this._super(...arguments);
    // Perform validation step on the received component attributes
    this.validateAttrs();

    // Set the current step to first edit step if compliance policy is new / doesn't exist
    if (get(this, 'isNewComplianceInfo')) {
      this.updateStep(0);
    }
  }

  didInsertElement(this: DatasetCompliance) {
    get(this, 'complianceAvailabilityTask').perform();
  }

  /**
   * @override
   */
  didRender() {
    this._super(...arguments);
    // Hides DOM elements that are not currently visible in the UI and unhides them once the user scrolls the
    // elements into view
    this.enableDomCloaking();
  }

  /**
   * Parent task to determine if a compliance policy can be created or updated for the dataset
   * @type {Task<TaskInstance<Promise<Array<IDataPlatform>>>, () => TaskInstance<TaskInstance<Promise<Array<IDataPlatform>>>>>}
   * @memberof DatasetCompliance
   */
  complianceAvailabilityTask = task(function*(
    this: DatasetCompliance
  ): IterableIterator<TaskInstance<Promise<Array<IDataPlatform>>>> {
    yield get(this, 'getPlatformPoliciesTask').perform();

    const supportedPurgePolicies = get(this, 'supportedPurgePolicies');
    set(this, 'isCompliancePolicyAvailable', !!supportedPurgePolicies.length);
  }).restartable();

  /**
   * Task to retrieve platform policies and set supported policies for the current platform
   * @type {Task<Promise<Array<IDataPlatform>>, () => TaskInstance<Promise<Array<IDataPlatform>>>>}
   * @memberof DatasetCompliance
   */
  getPlatformPoliciesTask = task(function*(this: DatasetCompliance): IterableIterator<Promise<Array<IDataPlatform>>> {
    const platform = get(this, 'platform');

    if (platform) {
      set(this, 'supportedPurgePolicies', getSupportedPurgePolicies(platform, yield readPlatforms()));
    }
  }).restartable();

  /**
   * A `lite` / intermediary step to occlusion culling, this helps to improve the rendering of
   * elements that are currently rendered in the viewport by hiding that aren't.
   * Setting them to visibility hidden doesn't remove them from the document flow, but the browser
   * doesn't have to deal with layout for the affected elements since they are off-screen
   * @memberof DatasetCompliance
   */
  enableDomCloaking() {
    const dom = this.element.querySelector('.dataset-compliance-fields');
    const triggerThreshold = 100;

    if (dom) {
      const rows = dom.querySelectorAll('tbody tr');

      // if we already have watchers for elements, or if the elements previously cached are no longer valid,
      // e.g. those elements were destroyed when new data was received, pagination etc
      if (rows.length > triggerThreshold && (!this.complianceWatchers || !this.complianceWatchers.has(rows[0]))) {
        /**
         * If an item is not in the viewport add a class to occlude it
         */
        const cloaker = function(this: any) {
          return !this.isInViewport
            ? this.watchItem.classList.add('compliance-row--off-screen')
            : this.watchItem.classList.remove('compliance-row--off-screen');
        };
        this.watchers = [];

        const entries = <Array<[Element, object]>>[...rows].map(row => {
          const watcher: { stateChange: (fn: () => void) => void; watchItem: Element } = scrollMonitor.create(row);
          watcher['stateChange'](cloaker);
          cloaker.call(watcher);
          this.watchers = [...this.watchers, watcher];

          return [watcher.watchItem, watcher];
        });

        // Retain a weak reference to DOM nodes
        this.complianceWatchers = new WeakMap<Element, {}>(entries);
      }
    }
  }

  /**
   * Cleans up the artifacts from the dom cloaking operation, drops references held by scroll monitor
   * @returns void
   * @memberof DatasetCompliance
   */
  disableDomCloaking() {
    if (!this.watchers || !Array.isArray(this.watchers)) {
      return;
    }

    this.watchers.forEach(watcher => watcher.destroy && watcher.destroy());
  }

  /**
   * @override
   * @memberof DatasetCompliance
   */
  willDestroyElement() {
    this.disableDomCloaking();
  }

  /**
   * Ensure that props received from on this component
   * are valid, otherwise flag
   * @returns {boolean | void}
   * @memberof DatasetCompliance
   */
  validateAttrs(this: DatasetCompliance): boolean | void {
    const fieldNames: Array<string> = getWithDefault(this, 'schemaFieldNamesMappedToDataTypes', []).mapBy('fieldName');

    // identifier field names from the column api should be unique
    if (isListUnique(fieldNames.sort())) {
      return set(this, '_hasBadData', false);
    }

    // Flag this component's data as problematic
    set(this, '_hasBadData', true);
  }

  /**
   * Checks that all tags/ dataset content types have a boolean value
   * @type {ComputedProperty<boolean>}
   * @memberof DatasetCompliance
   */
  isDatasetFullyClassified = computed('datasetClassification', function(this: DatasetCompliance): boolean {
    const datasetClassification = get(this, 'datasetClassification');

    return datasetClassification
      .map(({ value }) => ({ value: value }))
      .every(({ value }) => typeof value === 'boolean');
  });

  /**
   * Checks if any of the attributes on the dataset classification is false
   * @type {ComputedProperty<boolean>}
   * @memberof DatasetCompliance
   */
  excludesSomeMemberData = computed(datasetClassificationKey, function(this: DatasetCompliance): boolean {
    const { datasetClassification } = get(this, 'complianceInfo') || { datasetClassification: {} };

    // `datasetClassification` is nullable hence default
    return Object.values(datasetClassification || {}).some(hasMemberData => !hasMemberData);
  });

  /**
   * Determines if all types of data fields should be shown in the table i.e. show only fields contained in
   * this dataset or otherwise
   * @type {ComputedProperty<boolean>}
   * @memberof DatasetCompliance
   */
  shouldShowAllMemberData = or('showAllDatasetMemberData', 'isEditing');

  /**
   * Determines if the save feature is allowed for the current dataset, otherwise e.g. interface should be disabled
   * @type {ComputedProperty<boolean>}
   * @memberof DatasetCompliance
   */
  isSavingDisabled = computed('isDatasetFullyClassified', 'isSaving', function(this: DatasetCompliance): boolean {
    const { isDatasetFullyClassified, isSaving } = getProperties(this, ['isDatasetFullyClassified', 'isSaving']);

    return !isDatasetFullyClassified || isSaving;
  });

  /**
   * Checks to ensure the the number of fields added to compliance entities is less than or equal
   * to what is available on the dataset schema
   * @return {boolean}
   */
  isSchemaFieldLengthGreaterThanUniqComplianceEntities(this: DatasetCompliance): boolean {
    const complianceInfo = get(this, 'complianceInfo');
    if (complianceInfo) {
      const { length: columnFieldsLength } = getWithDefault(this, 'schemaFieldNamesMappedToDataTypes', []);
      const { length: complianceListLength } = uniqBy(
        get(complianceInfo, 'complianceEntities') || [],
        'identifierField'
      );

      return columnFieldsLength >= complianceListLength;
    }

    return false;
  }

  /**
   * Computed property that is dependent on all the keys in the datasetClassification map
   * @type {ComputedProperty<Array<IDatasetClassificationOption>>}
   * @memberof DatasetCompliance
   */
  datasetClassification = computed(`${datasetClassificationKey}.{${datasetClassifiersKeys.join(',')}}`, function(
    this: DatasetCompliance
  ): Array<IDatasetClassificationOption> {
    const complianceInfo = get(this, 'complianceInfo');
    if (complianceInfo) {
      const { datasetClassification } = complianceInfo;

      return datasetClassifiersKeys.sort().reduce((datasetClassifiers, classifier) => {
        return [
          ...datasetClassifiers,
          {
            classifier,
            value: datasetClassification ? datasetClassification[classifier] : void 0, // undefined !== false, tri-state
            label: DatasetClassifiers[classifier]
          }
        ];
      }, []);
    }

    return [];
  });

  /**
   * Computed prop over the current Id fields in the Privacy Policy
   * @type {ComputedProperty<ISchemaFieldsToPolicy>}
   */
  columnIdFieldsToCurrentPrivacyPolicy: ComputedProperty<ISchemaFieldsToPolicy> = computed(
    `{schemaFieldNamesMappedToDataTypes,${policyComplianceEntitiesKey}.[]}`,
    function(this: DatasetCompliance): ISchemaFieldsToPolicy {
      const {
        complianceEntities = [],
        modifiedTime
      }: Pick<IComplianceInfo, 'complianceEntities' | 'modifiedTime'> = get(this, 'complianceInfo') || {
        complianceEntities: []
      };
      // Truncated list of Dataset field names and data types currently returned from the column endpoint
      const columnProps = getWithDefault(this, 'schemaFieldNamesMappedToDataTypes', []).map(
        ({ fieldName, dataType }) => ({
          identifierField: fieldName,
          dataType
        })
      );

      return mapSchemaColumnPropsToCurrentPrivacyPolicy({
        columnProps,
        complianceEntities,
        policyModificationTime: modifiedTime
      });
    }
  );

  /**
   * Creates a mapping of compliance suggestions to identifierField
   * This improves performance in a subsequent merge op since this loop
   * happens only once and is cached
   * @type {ComputedProperty<ISchemaFieldsToSuggested>}
   * @memberof DatasetCompliance
   */
  identifierFieldToSuggestion = computed('complianceSuggestion', function(
    this: DatasetCompliance
  ): ISchemaFieldsToSuggested {
    const identifierFieldToSuggestion: ISchemaFieldsToSuggested = {};
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
          identifierFieldToSuggestion: ISchemaFieldsToSuggested,
          { suggestion: { identifierField, identifierType, logicalType, securityClassification }, confidenceLevel, uid }
        ) => ({
          ...identifierFieldToSuggestion,
          [identifierField]: {
            identifierType,
            logicalType,
            securityClassification,
            confidenceLevel,
            uid,
            suggestionsModificationTime
          }
        }),
        identifierFieldToSuggestion
      );
    }

    return identifierFieldToSuggestion;
  });

  /**
   * Caches a reference to the generated list of merged data between the column api and the current compliance entities list
   * @type {ComputedProperty<IComplianceChangeSet>}
   * @memberof DatasetCompliance
   */
  compliancePolicyChangeSet = computed(
    'columnIdFieldsToCurrentPrivacyPolicy',
    'complianceDataTypes',
    'identifierFieldToSuggestion',
    function(this: DatasetCompliance): Array<IComplianceChangeSet> {
      // schemaFieldNamesMappedToDataTypes is a dependency for CP columnIdFieldsToCurrentPrivacyPolicy, so no need to dep on that directly
      const changeSet = mergeMappedColumnFieldsWithSuggestions(
        get(this, 'columnIdFieldsToCurrentPrivacyPolicy'),
        get(this, 'identifierFieldToSuggestion')
      );

      // pass current changeSet state to parent handlers
      run(() => next(this, 'notifyHandlerOfSuggestions', changeSet));
      run(() => next(this, 'notifyHandlerOfFieldsRequiringReview', get(this, 'complianceDataTypes'), changeSet));

      return changeSet;
    }
  );

  /**
   * Returns a list of changeSet fields that meets the user selected filter criteria
   * @type {ComputedProperty<IComplianceChangeSet>}
   * @memberof DatasetCompliance
   */
  filteredChangeSet = computed(
    'changeSetReviewCount',
    'fieldReviewOption',
    'compliancePolicyChangeSet',
    'complianceDataTypes',
    function(this: DatasetCompliance): Array<IComplianceChangeSet> {
      const { compliancePolicyChangeSet: changeSet, complianceDataTypes } = getProperties(this, [
        'compliancePolicyChangeSet',
        'complianceDataTypes'
      ]);

      return get(this, 'fieldReviewOption') === 'showReview'
        ? changeSetFieldsRequiringReview(complianceDataTypes)(changeSet)
        : changeSet;
    }
  );

  /**
   * Reduces the current filtered changeSet to a list of IdentifierFieldWithFieldChangeSetTuple
   * @type {ComputedProperty<Array<IdentifierFieldWithFieldChangeSetTuple>>}
   * @memberof DatasetCompliance
   */
  foldedChangeSet: ComputedProperty<Array<IdentifierFieldWithFieldChangeSetTuple>> = computed(
    'filteredChangeSet',
    function(this: DatasetCompliance): Array<IdentifierFieldWithFieldChangeSetTuple> {
      return foldComplianceChangeSets(get(this, 'filteredChangeSet'));
    }
  );

  /**
   * Invokes external action with flag indicating that at least 1 suggestion exists for a field in the changeSet
   * @param {Array<IComplianceChangeSet>} changeSet
   */
  notifyHandlerOfSuggestions = (changeSet: Array<IComplianceChangeSet>): void => {
    const hasChangeSetSuggestions = !!compact(getFieldsSuggestions(changeSet)).length;
    this.notifyOnChangeSetSuggestions(hasChangeSetSuggestions);
  };

  /**
   * Invokes external action with flag indicating that a field in the changeSet requires user review
   * @param {Array<IComplianceDataType>} complianceDataTypes
   * @param {Array<IComplianceChangeSet>} changeSet
   */
  notifyHandlerOfFieldsRequiringReview = (
    complianceDataTypes: Array<IComplianceDataType>,
    changeSet: Array<IComplianceChangeSet>
  ) => {
    // adding assertions for run-loop callback invocation, because static type checks are bypassed
    assert('expected complianceDataTypes to be of type `array`', Array.isArray(complianceDataTypes));
    assert('expected changeSet to be of type `array`', Array.isArray(changeSet));

    const hasChangeSetDrift = getFieldsRequiringReview(complianceDataTypes)(changeSet).some(
      (isReviewRequired: boolean) => isReviewRequired
    );
    this.notifyOnChangeSetRequiresReview(hasChangeSetDrift);
  };

  /**
   * Returns a count of changeSet fields that require user attention
   * @type {ComputedProperty<number>}
   * @memberof DatasetCompliance
   */
  changeSetReviewCount = computed(
    `compliancePolicyChangeSet.@each.{${changeSetReviewableAttributeTriggers}}`,
    'complianceDataTypes',
    function(this: DatasetCompliance): number {
      return changeSetFieldsRequiringReview(get(this, 'complianceDataTypes'))(get(this, 'compliancePolicyChangeSet'))
        .length;
    }
  );

  /**
   * Sets the default classification for the given identifier field's tag
   * Using the identifierType, determine the tag's default security classification based on a values
   * supplied by complianceDataTypes endpoint
   * @param {string} identifierField the field for which the default classification should apply
   * @param {ComplianceFieldIdValue} identifierType the value of the field's identifier type
   */
  setDefaultClassification(
    this: DatasetCompliance,
    { identifierField, identifierType }: Pick<IComplianceEntity, 'identifierField' | 'identifierType'>
  ) {
    const complianceDataTypes = get(this, 'complianceDataTypes');
    const defaultSecurityClassification = getDefaultSecurityClassification(complianceDataTypes, identifierType);

    this.actions.tagClassificationChanged.call(this, { identifierField }, { value: defaultSecurityClassification });
  }

  /**
   * Requires that the user confirm that any non-id fields are ok to be saved without a field format specified
   * @returns {Promise<boolean>}
   */
  async confirmUnformattedFields(this: DatasetCompliance): Promise<boolean> {
    type FormattedAndUnformattedEntities = {
      formatted: Array<IComplianceEntity>;
      unformatted: Array<IComplianceEntity>;
    };
    // Current list of compliance entities on policy
    const { complianceEntities = [] } = get(this, 'complianceInfo') || {};
    const formattedAndUnformattedEntities: FormattedAndUnformattedEntities = { formatted: [], unformatted: [] };
    // All candidate fields that can be on policy, excluding tracking type fields
    const changeSetEntities: Array<IComplianceEntity> = get(this, 'compliancePolicyChangeSet').map(
      ({ identifierField, identifierType = null, logicalType, nonOwner, securityClassification, readonly }) => ({
        identifierField,
        identifierType,
        logicalType,
        nonOwner,
        securityClassification,
        readonly
      })
    );

    // Fields that do not have a logicalType, and no identifierType or identifierType is ComplianceFieldIdValue.None
    const { formatted, unformatted }: FormattedAndUnformattedEntities = changeSetEntities.reduce(
      ({ formatted, unformatted }, field) => {
        const { identifierType, logicalType } = getProperties(field, ['identifierType', 'logicalType']);

        if (!logicalType && (ComplianceFieldIdValue.None === identifierType || !identifierType)) {
          unformatted = [...unformatted, field];
        } else {
          formatted = [...formatted, field];
        }

        return { formatted, unformatted };
      },
      formattedAndUnformattedEntities
    );

    const dialogActions = <IConfirmOptions['dialogActions']>{};
    let isConfirmed = true;
    let unformattedChangeSetEntities: Array<IComplianceEntity> = [];

    // If there are unformatted fields, require confirmation from user
    if (unformatted.length) {
      unformattedChangeSetEntities = unformatted.map(({ identifierField }) => ({
        identifierField,
        identifierType: ComplianceFieldIdValue.None,
        logicalType: null,
        securityClassification: null,
        nonOwner: null
      }));

      const confirmHandler = (function() {
        return new Promise((resolve, reject) => {
          dialogActions['didConfirm'] = () => resolve();
          dialogActions['didDismiss'] = () => reject();
        });
      })();

      // Create confirmation dialog
      get(this, 'notifications').notify(NotificationEvent.confirm, {
        header: 'Confirm fields to tagged as `none` field type',
        content: `There are ${unformatted.length} non-ID fields. `,
        dialogActions: dialogActions
      });

      try {
        await confirmHandler;
      } catch (e) {
        isConfirmed = false;
      }
    }

    isConfirmed && complianceEntities.setObjects([...formatted, ...unformattedChangeSetEntities]);

    return isConfirmed;
  }

  /**
   * Ensures the fields in the updated list of compliance entities meet the criteria
   * checked in the function. If criteria is not met, an the returned promise is settled
   * in a rejected state, otherwise fulfilled
   * @method
   * @return {any | Promise<any>}
   */
  validateFields(this: DatasetCompliance) {
    const { notify } = get(this, 'notifications');
    const { complianceEntities = [] } = get(this, 'complianceInfo') || {};
    const idTypeComplianceEntities = complianceEntities.filter(isFieldIdType(get(this, 'complianceDataTypes')));

    // Validation operations
    const idFieldsHaveValidLogicalType: boolean = idTypeFieldsHaveLogicalType(idTypeComplianceEntities);
    const isSchemaFieldLengthGreaterThanUniqComplianceEntities: boolean = this.isSchemaFieldLengthGreaterThanUniqComplianceEntities();

    if (!isSchemaFieldLengthGreaterThanUniqComplianceEntities) {
      notify(NotificationEvent.error, { content: complianceDataException });
      return Promise.reject(new Error(complianceFieldNotUnique));
    }

    if (!idFieldsHaveValidLogicalType) {
      return Promise.reject(notify(NotificationEvent.error, { content: missingTypes }));
    }
  }

  /**
   * Gets a reference to the current dataset classification object
   */
  getDatasetClassificationRef(this: DatasetCompliance): DatasetClassification {
    const complianceInfo = get(this, 'complianceInfo');

    if (!complianceInfo) {
      return <DatasetClassification>{};
    }

    let { datasetClassification } = complianceInfo;

    // For datasets initially without a datasetClassification, the default value is null
    if (datasetClassification === null) {
      datasetClassification = set(complianceInfo, 'datasetClassification', <DatasetClassification>{});
    }

    return datasetClassification;
  }

  /**
   * Display a modal dialog requesting that the user check affirm that the purge type is exempt
   * @return {Promise<void>}
   */
  showPurgeExemptionWarning(this: DatasetCompliance) {
    const dialogActions = <IConfirmOptions['dialogActions']>{};

    get(this, 'notifications').notify(NotificationEvent.confirm, {
      header: 'Confirm purge exemption',
      content:
        'By choosing this option you understand that either Legal or HSEC may contact you to verify the purge exemption',
      dialogActions
    });

    return new Promise((resolve, reject) => {
      dialogActions['didConfirm'] = () => resolve();
      dialogActions['didDismiss'] = () => reject();
    });
  }

  /**
   * Notifies the user to provide a missing purge policy
   * @return {Promise<never>}
   */
  needsPurgePolicyType(this: DatasetCompliance) {
    return Promise.reject(get(this, 'notifications').notify(NotificationEvent.error, { content: missingPurgePolicy }));
  }

  /**
   * Updates the currently active step in the edit sequence
   * @param {number} step
   */
  updateStep(this: DatasetCompliance, step: number) {
    set(this, 'editStepIndex', step);
    get(this, 'updateEditStepTask').perform();
  }

  actions: IDatasetComplianceActions = {
    /**
     * Adds a new field tag to the list of compliance change set items
     * @param {IComplianceChangeSet} tag properties for new field tag
     * @return {IComplianceChangeSet}
     */
    onFieldTagAdded(this: DatasetCompliance, tag: IComplianceChangeSet): IComplianceChangeSet {
      return get(this, 'compliancePolicyChangeSet').addObject(tag);
    },

    /**
     * Removes a field tag from the list of compliance change set items
     * @param {IComplianceChangeSet} tag
     * @return {IComplianceChangeSet}
     */
    onFieldTagRemoved(this: DatasetCompliance, tag: IComplianceChangeSet): IComplianceChangeSet {
      return get(this, 'compliancePolicyChangeSet').removeObject(tag);
    },

    /**
     * When a user updates the identifierFieldType, update working copy
     * @param {IComplianceChangeSet} tag
     * @param {ComplianceFieldIdValue} identifierType
     */
    tagIdentifierChanged(
      this: DatasetCompliance,
      tag: IComplianceChangeSet,
      { value: identifierType }: { value: ComplianceFieldIdValue }
    ) {
      const { identifierField } = tag;
      if (tag) {
        setProperties(tag, {
          identifierType,
          logicalType: null,
          nonOwner: null,
          isDirty: true
        });
      }

      this.setDefaultClassification({ identifierField, identifierType });
    },

    /**
     * Updates the logical type for a tag
     * @param {IComplianceChangeSet} tag the tag to be updated
     * @param {IComplianceChangeSet.logicalType} logicalType the updated logical type
     */
    tagLogicalTypeChanged(
      this: DatasetCompliance,
      tag: IComplianceChangeSet,
      logicalType: IComplianceChangeSet['logicalType']
    ) {
      setProperties(tag, { logicalType, isDirty: true });
    },

    /**
     * Updates the security classification on a  field tag
     * @param {IComplianceChangeSet} tag the tag to be updated
     * @param {IComplianceChangeSet.securityClassification} securityClassification the updated security classification value
     */
    tagClassificationChanged(
      this: DatasetCompliance,
      tag: IComplianceChangeSet,
      { value: securityClassification = null }: { value: IComplianceChangeSet['securityClassification'] }
    ) {
      setProperties(tag, {
        securityClassification,
        isDirty: true
      });
    },

    /**
     * Updates the nonOwner property on the tag
     * @param {IComplianceChangeSet} tag the field tag to be updated
     * @param {IComplianceChangeSet.nonOwner} nonOwner flag indicating the field property is a nonOwner
     */
    tagOwnerChanged(this: DatasetCompliance, tag: IComplianceChangeSet, nonOwner: IComplianceChangeSet['nonOwner']) {
      setProperties(tag, {
        nonOwner,
        isDirty: true
      });
    },

    /**
     * Sets each datasetClassification value as false
     * @returns {Promise<DatasetClassification>}
     */
    async markDatasetAsNotContainingMemberData(this: DatasetCompliance): Promise<DatasetClassification | void> {
      const dialogActions = <IConfirmOptions['dialogActions']>{};
      const confirmMarkAllHandler = new Promise((resolve, reject) => {
        dialogActions.didDismiss = () => reject();
        dialogActions.didConfirm = () => resolve();
      });
      let willMarkAllAsNo = true;

      get(this, 'notifications').notify(NotificationEvent.confirm, {
        content: 'Are you sure this dataset does not contain any of the listed types of data?',
        header: 'Dataset contains no listed types of data',
        dialogActions
      });

      try {
        await confirmMarkAllHandler;
      } catch (e) {
        willMarkAllAsNo = false;
      }

      if (willMarkAllAsNo) {
        return <DatasetClassification>setProperties(
          this.getDatasetClassificationRef(),
          datasetClassifiersKeys.reduce(
            (classification, classifier) => ({ ...classification, ...{ [classifier]: false } }),
            {}
          )
        );
      }
    },

    /**
     * Toggles the flag to show all member potential member data fields that may be contained in this dataset
     * @returns {boolean}
     */
    onShowAllDatasetMemberData(this: DatasetCompliance): boolean {
      return this.toggleProperty('showAllDatasetMemberData');
    },

    /**
     * Updates the fieldReviewOption with the user selected value
     * @param {{value: ShowAllShowReview}} { value }
     * @returns {ShowAllShowReview}
     */
    onFieldReviewChange(this: DatasetCompliance, { value }: { value: ShowAllShowReview }): ShowAllShowReview {
      return set(this, 'fieldReviewOption', value);
    },

    /**
     * Progresses 1 step backward in the edit sequence
     */
    previousStep(this: DatasetCompliance) {
      const editStepIndex = get(this, 'editStepIndex');
      const previousIndex = editStepIndex > 0 ? editStepIndex - 1 : editStepIndex;
      this.updateStep(previousIndex);
    },

    /**
     * Progresses 1 step forward in the edit sequence
     */
    nextStep(this: DatasetCompliance) {
      const { editStepIndex, editSteps } = getProperties(this, ['editStepIndex', 'editSteps']);
      const nextIndex = editStepIndex < editSteps.length - 1 ? editStepIndex + 1 : editStepIndex;
      this.updateStep(nextIndex);
    },

    /**
     * Handler for setting the dataset classification into edit mode and rendering into DOM
     * @returns {Promise<boolean>}
     */
    async didEditCompliancePolicy(this: DatasetCompliance): Promise<boolean> {
      const isConfirmed = await this.confirmUnformattedFields();

      if (isConfirmed) {
        // Ensure that the fields on the policy meet the validation criteria before proceeding
        // Otherwise exit early
        try {
          await this.validateFields();
        } catch (e) {
          // Flag this dataset's data as problematic
          if (e instanceof Error && [complianceDataException, complianceFieldNotUnique].includes(e.message)) {
            set(this, '_hasBadData', true);
            window.scrollTo(0, 0);
          }

          // return;
          throw e;
        }

        // If user provides confirmation for unformatted fields or there are none,
        // then validate fields against expectations
        // otherwise inform user of validation exception
        // setProperties(this, { isEditingCompliancePolicy: false, isEditingDatasetClassification: true });
      } else {
        throw new Error('unConfirmedUnformattedFields');
      }

      return isConfirmed;
    },

    /**
     * Handles tasks to be processed after the wizard step to edit a datasets pii and security classification is
     * completed
     * @returns {Promise<void>}
     */
    async didEditDatasetLevelCompliancePolicy(this: DatasetCompliance): Promise<void> {
      const complianceInfo = get(this, 'complianceInfo');

      if (complianceInfo) {
        const { confidentiality, containingPersonalData } = complianceInfo;

        // defaults the containing personal data flag to false if undefined
        if (typeof containingPersonalData === 'undefined') {
          set(complianceInfo, 'containingPersonalData', false);
        }

        if (!confidentiality) {
          get(this, 'notifications').notify(NotificationEvent.error, {
            content: missingDatasetSecurityClassification
          });

          return Promise.reject(new Error(missingDatasetSecurityClassification));
        }
      }
    },

    /**
     * Handles post processing tasks after the purge policy step has been completed
     * @returns {(Promise<void | {}>)}
     */
    didEditPurgePolicy(this: DatasetCompliance): Promise<void | {}> {
      const { complianceType = null } = get(this, 'complianceInfo') || {};

      if (!complianceType) {
        return this.needsPurgePolicyType();
      }

      if (isExempt(complianceType)) {
        return this.showPurgeExemptionWarning();
      }

      return Promise.resolve();
    },

    /**
     * Augments the field props with w a suggestionAuthority indicating that the field
     * suggestion has either been accepted or ignored, and assigns the value of that change to the prop
     * @param {IComplianceChangeSet} field field for which this suggestion intent should apply
     * @param {SuggestionIntent} [intent=SuggestionIntent.ignore] user's intended action for suggestion, Defaults to `ignore`
     */
    onFieldSuggestionIntentChange(
      this: DatasetCompliance,
      field: IComplianceChangeSet,
      intent: SuggestionIntent = SuggestionIntent.ignore
    ) {
      set(field, 'suggestionAuthority', intent);
    },

    /**
     * Receives the json representation for compliance and applies each key to the policy
     * @param {string} textString string representation for the JSON file
     */
    onComplianceJsonUpload(this: DatasetCompliance, textString: string) {
      const complianceInfo = get(this, 'complianceInfo');
      const { notify } = get(this, 'notifications');
      let policy;

      if (!complianceInfo) {
        notify(NotificationEvent.error, {
          content: 'Could not find compliance current compliance policy for this dataset'
        });

        return;
      }

      try {
        policy = JSON.parse(textString);
      } catch (e) {
        notify(NotificationEvent.error, {
          content: invalidPolicyData
        });
      }

      if (isPolicyExpectedShape(policy)) {
        setProperties(complianceInfo, {
          complianceEntities: policy.complianceEntities,
          datasetClassification: policy.datasetClassification
        });

        notify(NotificationEvent.info, {
          content: successUploading
        });
      }

      notify(NotificationEvent.error, {
        content: invalidPolicyData
      });
    },

    /**
     * Handles the compliance policy download action
     */
    onComplianceDownloadJson(this: DatasetCompliance) {
      const currentPolicy = get(this, 'complianceInfo');

      if (!currentPolicy) {
        return get(this, 'notifications').notify(NotificationEvent.error, {
          content: 'Could not find the current policy to download'
        });
      }

      const policy = Object.assign({}, getProperties(currentPolicy, ['datasetClassification', 'complianceEntities']));
      const href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(policy))}`;
      const download = `${get(this, 'datasetName')}_policy.json`;
      const anchor = document.createElement('a');
      const anchorParent = document.body;

      /**
       *  Post download housekeeping
       */
      const cleanupPostDownload = () => {
        anchor.removeEventListener('click', cleanupPostDownload);
        anchorParent.removeChild(anchor);
      };

      Object.assign(anchor, { download, href });
      anchor.addEventListener('click', cleanupPostDownload);

      // Element needs to be in DOM to receive event in firefox
      anchorParent.appendChild(anchor);

      anchor.click();
    },

    /**
     * Updates the source object representing the current datasetClassification map
     * @param {keyof typeof DatasetClassifiers} classifier the property on the datasetClassification to update
     * @param {boolean} value
     * @returns
     */
    onChangeDatasetClassification<K extends keyof typeof DatasetClassifiers>(
      this: DatasetCompliance,
      classifier: K,
      value: DatasetClassification[K]
    ) {
      return set(this.getDatasetClassificationRef(), classifier, value);
    },

    /**
     * Updates the complianceType on the compliance policy
     * @param {PurgePolicy} purgePolicy
     * @returns {IComplianceInfo.complianceType}
     */
    onDatasetPurgePolicyChange(
      this: DatasetCompliance,
      purgePolicy: PurgePolicy
    ): IComplianceInfo['complianceType'] | null {
      const complianceInfo = get(this, 'complianceInfo');

      if (!complianceInfo) {
        return null;
      }
      // directly set the complianceType to the updated value
      return set(complianceInfo, 'complianceType', purgePolicy);
    },

    /**
     * Updates the policy flag indicating that this dataset contains personal data
     * @param {boolean} containsPersonalData
     * @returns {boolean}
     */
    onDatasetLevelPolicyChange(this: DatasetCompliance, containsPersonalData: boolean): boolean | null {
      const complianceInfo = get(this, 'complianceInfo');
      // directly mutate the attribute on the complianceInfo object
      return complianceInfo ? set(complianceInfo, 'containingPersonalData', containsPersonalData) : null;
    },

    /**
     * Updates the confidentiality flag on the dataset compliance
     * @param {IComplianceInfo.confidentiality} [securityClassification=null]
     * @returns {IComplianceInfo.confidentiality}
     */
    onDatasetSecurityClassificationChange(
      this: DatasetCompliance,
      securityClassification: IComplianceInfo['confidentiality'] = null
    ): IComplianceInfo['confidentiality'] {
      const complianceInfo = get(this, 'complianceInfo');

      return complianceInfo ? set(complianceInfo, 'confidentiality', securityClassification) : null;
    },

    /**
     * If all validity checks are passed, invoke onSave action on controller
     */
    async saveCompliance(this: DatasetCompliance): Promise<void> {
      const setSaveFlag = (flag = false) => set(this, 'isSaving', flag);

      try {
        const isSaving = true;
        const onSave = get(this, 'onSave');
        setSaveFlag(isSaving);

        await onSave();
        return this.updateStep(-1);
      } finally {
        setSaveFlag();
      }
    },

    // Rolls back changes made to the compliance spec to current
    // server state
    resetCompliance(this: DatasetCompliance) {
      get(this, 'onReset')();
    }
  };
}
