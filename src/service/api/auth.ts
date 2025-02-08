import { request } from '../request';

/**
 * Login
 *
 * @param username User name
 * @param password Password
 */
export function fetchLogin(params: Api.Auth.LoginParams) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/login',
    method: 'post',
    data: params
  });
}

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/auth/getUserInfo' });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/refreshToken',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/auth/error', params: { code, msg } });
}

/** 获取验证码图片 */
export function getCaptchaImg(params: { width: number; height: number }) {
  return request<Api.Auth.CaptchaResult>({ url: '/auth/captcha/img', params });
}
