import { assert } from '@ember/debug';
import { notFoundApiError } from 'wherehows-web/utils/api';
import { createInitialComplianceInfo } from 'wherehows-web/utils/datasets/compliance-policy';
import { datasetUrlById, datasetUrlByUrn } from 'wherehows-web/utils/api/datasets/shared';
import { ApiStatus } from 'wherehows-web/utils/api/shared';
import {
  IComplianceGetResponse,
  IComplianceInfo,
  IComplianceSuggestion,
  IComplianceSuggestionResponse
} from 'wherehows-web/typings/api/datasets/compliance';
import { getJSON, postJSON } from 'wherehows-web/utils/api/fetcher';

/**
 * Constructs the dataset compliance url
 * @param {number} id the id of the dataset
 * @return {string} the dataset compliance url
 */
const datasetComplianceUrlById = (id: number): string => `${datasetUrlById(id)}/compliance`;

/**
 * Returns the url for a datasets compliance policy by urn
 * @param {string} urn
 * @return {string}
 */
const datasetComplianceUrlByUrn = (urn: string): string => `${datasetUrlByUrn(urn)}/compliance`;

/**
 * Constructs the compliance suggestions url based of the compliance id
 * @param {number} id the id of the dataset
 * @return {string} compliance suggestions url
 */
const datasetComplianceSuggestionsUrlById = (id: number): string => `${datasetComplianceUrlById(id)}/suggestions`;

/**
 * Returns the url for a dataset compliance suggestion by urn
 * @param {string} urn
 * @return {string}
 */
const datasetComplianceSuggestionUrlByUrn = (urn: string): string => `${datasetUrlByUrn(urn)}/compliance/suggestion`;

/**
 * Determines if the client app should 'new' a compliance policy
 * If the endpoint responds with a failed status, and the msg contains the indicator that a compliance does not exist
 * @param {IComplianceGetResponse} { status, msg }
 * @returns {boolean}
 */
const requiresCompliancePolicyCreation = ({ status, msg }: IComplianceGetResponse): boolean => {
  const notFound = 'No entity found for query';
  return status === ApiStatus.FAILED && String(msg).includes(notFound);
};

/**
 * Describes the properties on a map generated by reading the compliance policy for a dataset
 * @interface
 */
export interface IReadComplianceResult {
  isNewComplianceInfo: boolean;
  complianceInfo: IComplianceInfo;
}

/**
 * Fetches the current compliance policy for a dataset with thi given id
 * @param {number} id the id of the dataset
 * @returns {(Promise<IReadComplianceResult>)}
 */
const readDatasetCompliance = async (id: number): Promise<IReadComplianceResult> => {
  assert(`Expected id to be a number but received ${typeof id}`, typeof id === 'number');

  const response = await getJSON<IComplianceGetResponse>({ url: datasetComplianceUrlById(id) });
  const isNewComplianceInfo = requiresCompliancePolicyCreation(response);
  let { msg, status, complianceInfo } = response;

  if (isNewComplianceInfo) {
    complianceInfo = createInitialComplianceInfo(id);
  }

  if ((status === ApiStatus.OK || isNewComplianceInfo) && complianceInfo) {
    return { isNewComplianceInfo, complianceInfo };
  }

  throw new Error(msg);
};

/**
 * Reads the dataset compliance policy by urn.
 * Resolves with a new compliance policy instance if remote response is ApiResponseStatus.NotFound
 * @param {string} urn the urn for the related dataset
 * @return {Promise<IReadComplianceResult>}
 */
const readDatasetComplianceByUrn = async (urn: string): Promise<IReadComplianceResult> => {
  let complianceInfo: IComplianceGetResponse['complianceInfo'];
  let isNewComplianceInfo = false;

  try {
    ({ complianceInfo } = await getJSON<Pick<IComplianceGetResponse, 'complianceInfo'>>({
      url: datasetComplianceUrlByUrn(urn)
    }));
  } catch (e) {
    if (notFoundApiError(e)) {
      complianceInfo = createInitialComplianceInfo(urn);
      isNewComplianceInfo = true;
    } else {
      throw e;
    }
  }

  return { isNewComplianceInfo, complianceInfo: complianceInfo! };
};

/**
 * Persists the dataset compliance policy
 * @param {string} urn
 * @param {IComplianceInfo} complianceInfo
 * @return {Promise<void>}
 */
const saveDatasetComplianceByUrn = (urn: string, complianceInfo: IComplianceInfo): Promise<void> =>
  postJSON<void>({ url: datasetComplianceUrlByUrn(urn), data: complianceInfo });

/**
 * Requests the compliance suggestions for a given dataset Id and returns the suggestion list
 * @param {number} id the id of the dataset
 * @return {Promise<IComplianceSuggestion>}
 */
const readDatasetComplianceSuggestion = async (id: number): Promise<IComplianceSuggestion> => {
  const { complianceSuggestion = <IComplianceSuggestion>{} } = await getJSON<IComplianceSuggestionResponse>({
    url: datasetComplianceSuggestionsUrlById(id)
  });

  return complianceSuggestion;
};

/**
 * Reads the suggestions for a dataset compliance policy by urn
 * @param {string} urn
 * @return {Promise<IComplianceSuggestion>}
 */
const readDatasetComplianceSuggestionByUrn = async (urn: string): Promise<IComplianceSuggestion> => {
  let complianceSuggestion: IComplianceSuggestion = <IComplianceSuggestion>{};
  try {
    ({ complianceSuggestion = <IComplianceSuggestion>{} } = await getJSON<
      Pick<IComplianceSuggestionResponse, 'complianceSuggestion'>
    >({ url: datasetComplianceSuggestionUrlByUrn(urn) }));
  } catch {
    return complianceSuggestion;
  }

  return complianceSuggestion;
};

export {
  readDatasetCompliance,
  readDatasetComplianceSuggestion,
  datasetComplianceUrlById,
  readDatasetComplianceByUrn,
  saveDatasetComplianceByUrn,
  readDatasetComplianceSuggestionByUrn
};
