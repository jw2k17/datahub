import Component from '@ember/component';
import { classNames, tagName } from '@ember-decorators/component';
import { EntityLinkNode } from '@datahub/data-models/types/entity/shared';

/**
 * It represents a row in the browsing experience. This row contains a title
 * which should be included in the link (node) passed into it. Also, depending
 * if it is a category or a entity it will add a folder icon or file icon.
 */
@tagName('li')
@classNames('browse-category browse-category-container__li')
export default class BrowseCategory extends Component {
  node: EntityLinkNode;
}
