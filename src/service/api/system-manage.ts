import { request } from '../request';

/** get role list */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/systemManage/getRoleList',
    method: 'get',
    params
  });
}

/**
 * get all roles
 *
 * these roles are all enabled
 */
export function fetchGetAllRoles() {
  return request<Api.SystemManage.AllRole[]>({
    url: '/systemManage/getAllRoles',
    method: 'get'
  });
}

/** get user list */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/system/users',
    method: 'get',
    params
  });
}

/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.MenuList>({
    url: '/system/menus',
    method: 'get'
  });
}

/** get all pages */
export function fetchGetAllPages() {
  return request<string[]>({
    url: '/systemManage/getAllPages',
    method: 'get'
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/systemManage/getMenuTree',
    method: 'get'
  });
}

/** add menu */
export function fetchAddMenu(params: Partial<Api.SystemManage.Menu>) {
  return request<Api.Common.CommonOperateResponse>({
    url: '/system/menus',
    method: 'post',
    data: params
  });
}

/** update menu */
export function fetchUpdateMenu(id: number, params: Partial<Api.SystemManage.Menu>) {
  return request<Api.Common.CommonOperateResponse>({
    url: `/system/menus/${id}`,
    method: 'post',
    data: params
  });
}

/** delete menu */
export function fetchDeleteMenu(id: number) {
  return request<Api.Common.CommonOperateResponse>({
    url: `/system/menus/delete/${id}`,
    method: 'post'
  });
}
/** batch delete menu */
export function fetchBatchDeleteMenu(ids: string[]) {
  return request<Api.Common.CommonOperateResponse>({
    url: '/system/menus/batchDelete',
    method: 'post',
    data: ids
  });
}
