import Component from '@ember/component';
import { get } from '@ember/object';
import { service } from '@ember-decorators/service';
import ComputedProperty from '@ember/object/computed';
import HotKeys from 'wherehows-web/services/hot-keys';

export default class GlobalHotkeys extends Component {
  /**
   * Sets the class names binded to the html element generated by this component
   * @type {Array<string>}
   */
  classNames = ['global-hotkey-binder'];

  /**
   * Allows us to bind the tabindex attribute to our element to make it focusable. This will
   * allow it to capture keyup events
   * @type {Array<string>}
   */
  attributeBindings = ['tabindex'];

  /**
   * Sets the tabindex for our rendered element through attributeBindings
   * @type {number}
   */
  tabindex = 0;

  /**
   * Contains a set of elements that we deem to be inEligible in any circumstance. Targets
   * with these tags will never be passed through for global hotkeys
   * @type {Set<string>}
   */
  inEligibleTargets = new Set(['INPUT', 'TEXTAREA']);

  /**
   * Service that assists with actually triggering the actions tied to a particular Eligible
   * target hotkey
   * @type {Ember.Service}
   */
  @service
  hotKeys: ComputedProperty<HotKeys>;

  /**
   * Returns true if target exists, is not an input, and is not an editable div
   * @param {HTMLElement} target - target element
   * @returns {boolean}
   */
  isEligibleTarget(target: HTMLElement): boolean {
    return (
      !!target &&
      !get(this, 'inEligibleTargets').has(target.tagName) &&
      !(target.tagName === 'DIV' && target.attributes.getNamedItem('contenteditable'))
    );
  }

  /**
   * Method for handling the global keyup.
   * @param {KeyboardEvent} e - KeyboardEvent triggered by user input
   */
  keyUp(e: KeyboardEvent) {
    const target = <HTMLElement>e.target;

    if (this.isEligibleTarget(target)) {
      get(this, 'hotKeys').applyKeyMapping(e.keyCode);
    }
  }
}
