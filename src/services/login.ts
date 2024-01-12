import type { LoginResult } from '@/types/member'
import { http } from '@/utils/http'

type LoginWxMinParams = {
  code: string
  encryptedData?: string
  iv?: string
}
/**
 * 小程序登录
 * @param data 请求参数
 */
export const postLoginWxMinAPI = (data: LoginWxMinParams) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin',
    data,
  })
}

/**
 * 小程序登录
 * @param code 请求参数
 */
export const postLoginMiniAPI = (code: string) => {
  return http<Auth.Token>({
    method: 'POST',
    url: '/api/auth/miniprogram-login',
    data: { code }, // 将 code 作为对象传递
  })
}

/**
 * 刷新令牌
 * @param refreshToken 请求参数
 */
export const postRefreshTokenAPI = (refreshToken: string) => {
  return http<Auth.Token>({
    method: 'POST',
    url: '/api/auth/refresh', // 替换为实际的刷新令牌 API 路径
    data: { refreshToken }, // 将 refreshToken 作为对象的属性传递
  })
}

/**
 * 小程序登录_内测版
 * @param phoneNumber 模拟手机号码
 */
export const postLoginWxMinSimpleAPI = (phoneNumber: string) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin/simple',
    data: {
      phoneNumber,
    },
  })
}

type LoginParams = {
  account: string
  password: string
}
/**
 * 传统登录-用户名+密码
 * @param data 请求参数
 */
export const postLoginAPI = (data: LoginParams) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login',
    data,
  })
}

/**
 * 更新用户电话号码
 * @param code
 * @param encryptedData
 * @param iv
 * @returns
 */
export const updateUserPhoneAPI = async (code: string, encryptedData: string, iv: string) => {
  const response = await http({
    method: 'POST',
    url: '/api/users/update-phone',
    data: { code, encryptedData, iv },
  })
  return response.data
}
