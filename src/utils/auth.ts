enum TokenKeys {
  Access = 'ACCESS_TOKEN',
  Refresh = 'REFRESH_TOKEN',
}

// 获取access token
export const getAccessToken = () => {
  return getToken(TokenKeys.Access)
}

// 获取refresh token
export const getRefreshToken = () => {
  return getToken(TokenKeys.Refresh)
}

// 通用的获取token函数
const getToken = (tokenKey: TokenKeys) => {
  const tokenInfo = wx.getStorageSync(tokenKey)
  if (!tokenInfo) {
    return null
  }

  const currentTime = Date.now() // 获取当前时间的时间戳
  const expirationTime = tokenInfo.expiration // 获取令牌的过期时间

  // 检查令牌是否过期
  if (currentTime >= expirationTime) {
    return null // 令牌过期，返回 null
  }

  return tokenInfo.value // 令牌有效，返回令牌值
}

// 设置token
export const setToken = (token: Auth.Token) => {
  wx.setStorageSync(TokenKeys.Refresh, {
    value: token.refreshToken,
    expiration: token.refreshExpiresIn,
  })
  wx.setStorageSync(TokenKeys.Access, {
    value: token.accessToken,
    expiration: token.accessExpiresIn,
  })
}

// 删除token
export const removeToken = () => {
  wx.removeStorageSync(TokenKeys.Access)
  wx.removeStorageSync(TokenKeys.Refresh)
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return 'Bearer ' + token
}

//存储场景码
export const setScene = (sence: string) => {
  wx.setStorageSync('Sence_Code', {
    value: sence,
    expiration: 300 * 1000,
  })
}

// 获取token
export const getScene = () => {
  return wx.getStorageSync('Sence_Code')
}
