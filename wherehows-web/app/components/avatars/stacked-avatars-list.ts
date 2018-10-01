import Component from '@ember/component';
import { IAvatar } from 'wherehows-web/typings/app/avatars';
import { action, computed } from '@ember-decorators/object';
import { IDropDownOption } from 'wherehows-web/typings/app/dataset-compliance';
import { classNames } from '@ember-decorators/component';

/**
 * Specifies the default maximum number of images to render before the more button
 * @type {number}
 */
const defaultMavAvatarLength = 6;

@classNames('avatar-container')
export default class StackedAvatarsList extends Component {
  /**
   * The list of avatar objects to render
   * @type {Array<IAvatar>}
   */
  avatars: Array<IAvatar>;

  /**
   * External action to selection of an avatar's menu option
   * @type {(avatar: IAvatar, option?: IDropDownOption<any>) => any}
   */
  handleAvatarOptionSelection: (avatar: IAvatar, option?: IDropDownOption<any>) => any;

  constructor() {
    super(...arguments);

    this.avatars || (this.avatars = []);
  }

  /**
   * Calculates the max number of avatars to render
   * @type {ComputedProperty<number>}
   * @memberof StackedAvatarsList
   */
  @computed('avatars.length')
  get maxAvatarLength(): number {
    const {
      avatars: { length }
    } = this;
    return length ? Math.min(length, defaultMavAvatarLength) : defaultMavAvatarLength;
  }

  /**
   * Build the list of avatars to render based on the max number
   * @type {ComputedProperty<StackedAvatarsList['avatars']>}
   * @memberof StackedAvatarsList
   */
  @computed('maxAvatarLength')
  get maxAvatars(): StackedAvatarsList['avatars'] {
    const { avatars, maxAvatarLength } = this;

    return avatars.slice(0, maxAvatarLength);
  }

  /**
   * Determines the list of avatars that have not been rendered after the max has been ascertained
   * @type {ComputedProperty<StackedAvatarsList['avatars']>}
   * @memberof StackedAvatarsList
   */
  @computed('maxAvatars')
  get rollupAvatars(): StackedAvatarsList['avatars'] {
    const { avatars, maxAvatarLength } = this;

    return avatars.slice(maxAvatarLength);
  }

  /**
   * Handler to invoke IAvatarDropDownAction instance when the drop down option is selected
   * @param {IAvatar} avatar the avatar item selected from the list
   * @param {(IDropDownOption<any>)} [selectedOption] drop down option selected
   * @memberof StackedAvatarsList
   */
  @action
  onAvatarOptionSelected(avatar: IAvatar, selectedOption?: IDropDownOption<any>): void {
    this.handleAvatarOptionSelection(avatar, selectedOption);
  }
}
