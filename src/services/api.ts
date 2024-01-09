const baseURL = 'https://api.ganyiconsulting.com'
const wechatURL = 'https://api.weixin.qq.com'
export const myfetch = (url: any, method: any, data: any) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      data,
      success: (res) => {
        resolve(res.data)
      },
      fail: (error) => {
        reject(error)
      },
    })
  })
}

export const miniprogramLogin = (code: string) => {
  return myfetch(`${baseURL}/api/auth/miniprogram-login`, 'POST', { code })
}

export const getPhoneNumber = (accessToken: any, code: any) => {
  return myfetch(
    `${wechatURL}/wxa/business/getuserphonenumber?access_token=${accessToken}`,
    'POST',
    { code },
  )
}
