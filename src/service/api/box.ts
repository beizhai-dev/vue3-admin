import { request } from '../request';

/**
 * Get box summary
 *
 * @param id Box ID
 */
export function fetchBoxSummary(params: Api.Box.SearchParams) {
  return request<Api.Box.SummaryList>({
    url: `/box/summary`,
    method: 'get',
    params
  });
}

/**
 * Create box summary
 *
 * @param boxId Box ID
 * @param data Summary data
 */
export function createBoxSummary(data: Api.Box.CreateSummary) {
  return request<void>({
    url: `/box/addSummary`,
    method: 'post',
    data
  });
}

/**
 * Update box summary
 *
 * @param boxId Box ID
 * @param data Summary data to update
 */
export function updateBoxSummary(data: Api.Box.UpdateSummary) {
  return request<void>({
    url: `/box/editSummary`,
    method: 'post',
    data
  });
}

/**
 * Delete box summary
 *
 * @param boxId Box ID
 */
export function deleteBoxSummary(boxId: number) {
  return request<void>({
    url: `/box/summary`,
    method: 'post',
    data: {
      boxId
    }
  });
}
