import Component from '@ember/component';
import { set, setProperties } from '@ember/object';
import { IPowerSelectAPI } from 'wherehows-web/typings/modules/power-select';
import { ISuggestion, ISuggestionGroup } from 'wherehows-web/utils/parsers/autocomplete/types';
import { inject as service } from '@ember/service';
import HotKeys from 'wherehows-web/services/hot-keys';
import { Keyboard } from 'wherehows-web/constants/keyboard';
import { later, cancel } from '@ember/runloop';
import { computed } from '@ember/object';
import { INachoDropdownOption } from '@nacho-ui/dropdown/types/nacho-dropdown';
import { task } from 'ember-concurrency';
import { EmberRunTimer } from '@ember/runloop/types';
import { cancelInflightTask } from 'wherehows-web/utils/search/typeahead';
import { DataModelEntity, DataModelName } from '@datahub/data-models/constants/entity';
import { DatasetEntity } from '@datahub/data-models/entity/dataset/dataset-entity';
import { capitalize } from '@ember/string';
import { stringListOfEntities } from '@datahub/data-models/entity/utils/entities';
import { unGuardedEntities } from 'wherehows-web/utils/entity/flag-guard';
import { getConfig } from 'wherehows-web/services/configurator';
import { ETaskPromise } from '@datahub/utils/types/concurrency';

const initProps = (): {
  entities: Array<INachoDropdownOption<string>>;
} => {
  /**
   * List of entities converted into nacho dropdown format
   */
  const nachoDropdownOptions: Array<INachoDropdownOption<string>> = unGuardedEntities(getConfig).map(
    (dataModel): INachoDropdownOption<DataModelName> => ({
      label: capitalize(dataModel.displayName),
      value: dataModel.displayName
    })
  );

  /**
   * List of entities and empty selection item when there is no selection available
   */
  const nachoDropdownOptionsWithSelect: Array<INachoDropdownOption<string>> = [
    {
      label: 'Select entity type',
      value: ''
    },
    ...nachoDropdownOptions
  ];

  return {
    entities: nachoDropdownOptionsWithSelect
  };
};
/**
 * Presentation component that renders a search box
 */

export default class SearchBox extends Component {
  @service
  hotKeys: HotKeys;

  /**
   * HBS Expected Parameter
   * The value of the input
   * note: recommend (readonly) helper.
   * @type {string}
   */
  text!: string;

  /**
   * HBS Expected Parameter
   * Action when the user actually wants to search
   */
  onSearch!: (q: string, entity?: string) => void;

  /**
   * HBS Expected Parameter
   * Action when the user types into the input, so we can show suggestions
   */
  onTypeahead!: ETaskPromise<Array<ISuggestionGroup>, string, string>;

  /**
   * List of entities to render inside the dropdown
   */
  entities: Array<INachoDropdownOption<string>>;

  /**
   * Selected entity in the entity dropdown
   */
  selectedEntity?: DataModelName;

  /**
   * internal field to save temporal inputs in the text input
   * @type {string}
   */
  inputText: string;

  /**
   * when suggestions box is open, we will save a reference to power-select
   * se we can close it.
   * @type {IPowerSelectAPI<string>}
   */
  powerSelectApi?: IPowerSelectAPI<string>;

  /**
   * When ever we are focusing the input or not
   * @type {boolean}
   */
  focusing: boolean;

  /**
   * Initial set of suggestions
   */
  initialSuggestions: Array<ISuggestionGroup>;

  /**
   * Flag to show or hide entity tooltip
   */
  showSelectEntityTooltip: boolean = false;

  /**
   * Timer for the tooltip
   */
  tooltipTimeout: EmberRunTimer;

  init(): void {
    setProperties(this, initProps());
    super.init();
  }

  /**
   * Adding a specific trigger class name to apply different styles
   * when ump is enabled (so we can change rounded borders)
   */
  @computed()
  get triggerClassName(): string {
    return '';
  }

  /**
   * When no entity is selected then, search should not be allowed
   */
  @computed('selectedEntity')
  get searchDisabled(): boolean {
    const { selectedEntity } = this;
    return !selectedEntity;
  }

  /**
   * Placeholder for input
   */
  @computed('searchDisabled', 'selectedEntity')
  get placeholder(): string {
    const { searchDisabled, selectedEntity } = this;

    if (searchDisabled) {
      return `Select ${stringListOfEntities(unGuardedEntities(getConfig))}`;
    }
    if (selectedEntity) {
      return DataModelEntity[selectedEntity].renderProps.search.placeholder;
    }
    return '';
  }

  didReceiveAttrs(): void {
    super.didReceiveAttrs();
    // When new attrs, update inputText with latest text
    set(this, 'inputText', this.text);
    // Invoke the task to update the initialSuggestions

    this.setInitialSuggestionsTask.perform();
  }

  /**
   * Task to apply suggestions when the component is initialized and on subsequent scenarios such as when
   * the selected entity is changed
   * @returns {IterableIterator<TaskInstance<Array<ISuggestionGroup>>>}
   */
  @task(function*(this: SearchBox): IterableIterator<Promise<Array<ISuggestionGroup>>> {
    const { selectedEntity = DatasetEntity.displayName } = this;
    const initialSuggestions: Array<ISuggestionGroup> = yield this.onTypeahead.perform('', selectedEntity);
    set(this, 'initialSuggestions', initialSuggestions || []);
  })
  setInitialSuggestionsTask!: ETaskPromise<Array<ISuggestionGroup>>;

  /**
   * Performs the external task to process the user entered query and related attributes and yields
   * a list of ISuggestionGroup values
   * @param {string} query user query input string
   * @returns {IterableIterator<TaskInstance<Array<ISuggestionGroup>>>}
   */
  @(task(function*(this: SearchBox, query: string = ''): IterableIterator<Promise<Array<ISuggestionGroup>>> {
    return yield this.onTypeahead.perform(query, this.selectedEntity || DatasetEntity.displayName);
  }).restartable())
  onTypeaheadTask!: ETaskPromise<Array<ISuggestionGroup>>;

  didInsertElement(): void {
    super.didInsertElement();
    // Registering this hot key allows us to jump to focus the search bar when pressing '/'
    this.hotKeys.registerKeyMapping(Keyboard.Slash, this.setFocus.bind(this));
  }

  willDestroyElement(): void {
    super.willDestroyElement();
    // Cleanup event listener prior to component destruction
    this.hotKeys.unregisterKeyMapping(Keyboard.Slash);
    cancel(this.tooltipTimeout);
  }

  /**
   * Sets focus to the search input element, helpful when we need to trigger focus using code
   * instead of the user clicking on the search bar.
   */
  setFocus(): void {
    const searchInput = this.element.querySelector<HTMLInputElement>('input');
    searchInput && searchInput.focus();
  }

  /**
   * When the input transitioned from focus->blur
   * Reset suggestions, save text and cancel previous search.
   */
  @cancelInflightTask('onTypeaheadTask')
  onBlur(): void {
    setProperties(this, {
      text: this.inputText,
      focusing: false
    });
  }

  /**
   * When the input transitioned from blur->focus
   * Restore inputText value from text, open suggestions, and search latest term
   */
  onFocus(pws: IPowerSelectAPI<string>): void {
    setProperties(this, {
      inputText: this.text,
      powerSelectApi: pws,
      focusing: true
    });
    pws.actions.search(this.text);
    pws.actions.open();
  }

  /**
   * Power select forces us to return undefined to prevent to select
   * the first item on the list.
   */
  defaultHighlighted(): undefined {
    return undefined;
  }

  /**
   * When user types text we save it
   * @param text user typed text
   */
  onInput(text: string): void {
    set(this, 'inputText', text);
  }

  /**
   * When user selects an item from the list
   */
  onChange(selected: ISuggestion): void {
    if (selected) {
      const text = selected.text;

      setProperties(this, {
        text,
        inputText: text
      });

      // lets blur and regain focus at last char after selection to reset
      // power select state.
      const input = this.element.querySelector('input');
      input && input.blur();
      later((): void => {
        const input = this.element.querySelector('input');
        if (input) {
          // 2 because of opera see  https://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
          const length = input.value.length * 2;
          input.focus();
          input.setSelectionRange(length, length);
        }
      }, 1);
    }
  }

  /**
   * When user intents to perform a search
   */
  @cancelInflightTask('onTypeaheadTask')
  onSubmit(): void {
    if (this.inputText && this.inputText.trim().length > 0) {
      // this will prevent search text from jitter,
      // since inputText may differ from text, PWS will try to restore
      // text since there was not a selection, but we will set text from the route
      // at a later point. That will cause the search box to show  for example:
      // => car // press enter
      // => somethingelse //after onSubmit
      // => car // route sets car

      set(this, 'text', this.inputText);
      this.onSearch(this.inputText, this.selectedEntity);
      if (this.powerSelectApi) {
        this.powerSelectApi.actions.close(new Event('onSubmit'));
      }
    }
  }

  /**
   * When are going to close the suggestion box only when there is an event attached
   * to the on close, like on blur (user action event), or onSubmit which comes from our own code.
   * @param _
   * @param event
   */
  onClose(_: IPowerSelectAPI<string>, event: Event): false | void {
    if (!event) {
      return false;
    }
  }

  /**
   * Action when the user changes the entity selected in the dropdown
   */
  onSelectedEntityChange(entity?: DataModelName): void {
    const selectedEntity = entity && Object.keys(DataModelEntity).includes(entity) ? entity : undefined;
    setProperties(this, {
      selectedEntity,
      showSelectEntityTooltip: false
    });

    this.setInitialSuggestionsTask.perform();
  }

  /**
   * Generic ember mouseDown event to catch the click on the search input when input is disabled.
   * We are using mousedown since click is swallowed when input is disabled
   */
  mouseDown(e: Event): void {
    const input = this.element.querySelector('input');
    const target: HTMLElement = e.target as HTMLElement;
    if (target === input && this.searchDisabled) {
      cancel(this.tooltipTimeout);
      set(this, 'showSelectEntityTooltip', true);

      // Hide in 1 sec
      const tooltipTimeout = later((): false => {
        set(this, 'showSelectEntityTooltip', false);
        return false;
      }, 2000);
      set(this, 'tooltipTimeout', tooltipTimeout);
    }
  }
}
