import { TrackingEventCategory, TrackingGoal, PageType } from '@datahub/shared/constants/tracking/event-tracking';
import { IDataModelEntitySearchResult } from '@datahub/data-models/types/entity/search';
import { DataModelEntityInstance } from '@datahub/data-models/constants/entity';

/**
 * Describes the interface for a tracking event.
 * More specific traffic events may extend from this.
 * @interface IBaseTrackingEvent
 */
export interface IBaseTrackingEvent {
  // The category this event should be logged under e.g. Search
  category: TrackingEventCategory;
  // The action that was performed for the event category e.g. SearchResultClickEvent
  action: string;
  // An optional name e.g. the urn of the search item
  name?: string;
  // An optional value for the event, e.g. the score or rating of a particular item
  value?: number | string;
}

/**
 * Options bag for additional properties that may be used in generating tracking events
 * @export
 * @interface ICustomEventData
 */
export interface ICustomEventData {
  [K: string]: unknown;
}

/**
 * Describes the interface for a tracking goal
 * @export
 * @interface IBaseTrackingGoal
 */
export interface IBaseTrackingGoal {
  // The name of the goal being tracked, usually a numeric identifier
  name: TrackingGoal;
}

/**
 * A mapping of events names to instances of tracking events
 * @template K the event names to key by
 * @template T types that are assignable to the base tracking event
 * @alias {Record<Extract<K, string>,T>}
 */
export type TrackingEvents<K = string, T extends IBaseTrackingEvent = IBaseTrackingEvent> = Record<
  Extract<K, string>,
  T
>;

/**
 * Defines the parameters for the class methods trackEvent on the BrowseCategoryContainer component
 * @interface ICategoryContainerTrackEventParams
 */
export interface ICategoryContainerTrackEventParams {
  // The name of the current user being tracked
  userName: string;
  // The title of the card that the user clicked on
  categoryName: string;
}

/**
 * Defines the parameters for the class methods trackEvent on the BrowseCategoryContainer component
 * @interface ISearchResultTrackEventParams
 */
export interface ISearchResultClickTrackEventParams {
  // The filters chosen by the user in the search-results filter bar
  facet: string | null;
  // Describes an object consisting of `category` and `action` of the event being tracked, along with additional optional properties
  baseSearchTrackingEvent: IBaseTrackingEvent;
  // The type of click event generated by the user. For example, "SEARCH CLICK" or "SEARCHSATCLICK" or "FACETCLICK"
  actionCategory: string;
  // Position of the result card in the list of results
  absolutePosition: number | null;
}

/**
 * Defined the paramaters for the class methods trackEvent on the Search Service
 * @interface ISearchResultImpressionTrackEventParams
 */
export interface ISearchResultImpressionTrackEventParams {
  // The name of the current user being tracked
  userName: string;
  // Position of the result card in the list of results
  absolutePosition: number | null;
  // URN of the target entity
  targetUrn: string;
}

/**
 * Params being passed to the `trackSearchActionFacetClickEvent` method after a facetClick occurs
 * @interface ISearchActionFacetClickParams
 */
export interface ISearchActionFacetClickParams {
  // The name of the facet filter selected by the user. Eg : `Bucket` or `Frequency`
  facetName: string;
  // The value of the facet filter clicked by the user. Eg: `Horizontal` or `Monthly`
  facetValue: string;
}

/**
 * Parameters being passed to track the search results. They include the resultData itself, items per page and the page number.
 *
 * @interface ITrackSearchResultImpressionsParams
 */
export interface ITrackSearchResultImpressionsParams {
  result: IDataModelEntitySearchResult<DataModelEntityInstance>;
  itemsPerPage: number;
  page: number;
}

/**
 * Interface defining the params being passed from the application's context to the tracking service.
 * Meant for PageViewEvent tracking.
 */
export interface IPageViewEventTrackingParams {
  // The route of the current page for which the PVE was triggered : Example - browse/index
  page: string;
  // heading of the current page for which the PVE was triggered : Example - browse.index
  title: string;
  // Type of the page being tracked. Refer to `pageTypeSymbols` for more details.
  pageType: PageType;
  // The name of the current user being tracked
  userName: string;
}
