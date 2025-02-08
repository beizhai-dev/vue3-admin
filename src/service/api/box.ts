import { request } from '../request';

/**
 * Get box summary
 *
 * @param id Box ID
 */
export function fetchBoxSummary(params: Api.Box.SummarySearchParams) {
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
  return request({
    url: `/box/summary`,
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
export function updateBoxSummary(id: number, data: Api.Box.UpdateSummary) {
  return request({
    url: `/box/summary/${id}`,
    method: 'post',
    data
  });
}

/**
 * Delete box summary
 *
 * @param boxId Box ID
 */
export function deleteBoxSummary(id: number) {
  return request({
    url: `/box/summary/delete/${id}`,
    method: 'post'
  });
}

/**
 * Get box summary detail by ID
 *
 * @param id Box summary ID
 */
export function fetchBoxSummaryById(id: number) {
  return request<Api.Box.Summary>({
    url: `/box/summary/${id}`,
    method: 'get'
  });
}

/**
 * Batch delete box summaries
 *
 * @param ids Box summary IDs
 */
export function batchDeleteBoxSummary(ids: string[]) {
  return request({
    url: '/box/summary/batchDelete',
    method: 'post',
    data: ids
  });
}
