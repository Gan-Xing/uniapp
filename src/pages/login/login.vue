<script setup lang="ts">
import {
  getUserInfoAPI,
  postLoginAPI,
  postLoginMiniAPI,
  postLoginWxMinAPI,
  postLoginWxMinSimpleAPI,
  updateUserPhoneAPI,
} from '@/services/login'
import { useMemberStore } from '@/stores'
import type { LoginResult } from '@/types/member'
import { getAccessToken, setToken } from '@/utils'
import { onLoad } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue'

// #ifdef MP-WEIXIN
// 获取 code 登录凭证
let code = ''
const userInfo = reactive({
  avatarUrl: '',
  nickName: '',
})

// 页面加载时检查会话
onLoad(async () => {
  try {
    const res = await loginAndSetCode()
    if (!res) {
      return uni.showToast({ icon: 'error', title: '微信登录失败' })
    }
    const userInfo = await getUserInfoAPI()
    const { phoneNumber, avatar, username } = userInfo
    // if (phoneNumber) {
    //   uni.switchTab({ url: '/pages/my/my' })
    // }
  } catch {
    return uni.showToast({ icon: 'error', title: '微信登录失败' })
  }

  // uni.switchTab({ url: '/pages/index/index' })
})

// 检查会话并根据需要刷新 code
const checkSessionAndRefreshCode = async () => {
  let isSessionValid = false

  await new Promise((resolve) => {
    wx.checkSession({
      success: () => {
        isSessionValid = true
        resolve(true)
      },
      fail: () => {
        isSessionValid = false
        resolve(false)
      },
    })
  })

  if (!isSessionValid) {
    await loginAndSetCode()
  }

  return isSessionValid
}

// 登录并设置 code
const loginAndSetCode = async () => {
  try {
    const res = await wx.login()
    console.log('===================', res)
    if (!res.code) {
      console.error('无法获取登录凭证（code）')
      return false // 登录失败，返回 false
    }
    code = res.code
    const response = await postLoginMiniAPI(res.code)
    if (!response.success) {
      console.error('后端登录失败')
      return false // 登录失败，返回 false
    }
    setToken(response.data.token)
    return true // 登录成功，返回 true
  } catch (error) {
    console.error('登录过程中发生错误:', error)
    return false // 登录失败，返回 false
  }
}

// 获取用户手机号码
const onGetphonenumber: UniHelper.ButtonOnGetphonenumber = async (ev) => {
  await checkedAgreePrivacy()
  const { encryptedData, iv } = ev.detail

  try {
    const isSessionValid = await checkSessionAndRefreshCode()
    if (isSessionValid && encryptedData && iv) {
      const res = await updateUserPhoneAPI(encryptedData, iv)
      const accessToken = getAccessToken()
      const result: LoginResult = {
        id: res.id, // 确保类型是 number
        avatar: res.avatar, // 确保类型是 string
        account: '', // 根据实际情况替换 'your_account'，确保类型是 string
        nickname: res.username, // 如果是可选的，则可以不提供
        mobile: res.phoneNumber, // 确保类型是 string
        token: accessToken, // 础保类型是 string
      }
      loginSuccess(result)
    }
  } catch (error) {
    console.error('Error updating phone number:', error)
  }
}

// #endif

// 模拟手机号码快捷登录（开发练习）
const onGetphonenumberSimple = async () => {
  await checkedAgreePrivacy()
  const res = await postLoginWxMinSimpleAPI('13123456789')
  // loginSuccess(res.result)
}

// 新增：选择头像的处理函数
function onChooseAvatar(e) {
  userInfo.avatarUrl = e.detail.avatarUrl
  // 你可能需要调用 API 更新用户信息
  // updateUserProfileAPI({ avatarUrl: userInfo.avatarUrl });
}

// 新增：昵称输入处理函数
function onInputChange(e) {
  userInfo.nickName = e.detail.value
  // 你可能需要调用 API 更新用户信息
  // updateUserProfileAPI({ nickName: userInfo.nickName });
}

const loginSuccess = (profile: LoginResult) => {
  // 保存会员信息
  const memberStore = useMemberStore()
  memberStore.setProfile(profile)
  // 成功提示
  uni.showToast({ icon: 'success', title: '登录成功' })
  setTimeout(() => {
    // 页面跳转
    // uni.switchTab({ url: '/pages/my/my' })
    uni.switchTab({ url: '/pages/index/index' })
    // uni.navigateBack()
  }, 500)
}

// #ifdef H5
// 传统表单登录，测试账号：13123456789 密码：123456，测试账号仅开发学习使用。
const form = ref({
  account: '13123456789',
  password: '',
})

// 表单提交
const onSubmit = async () => {
  await checkedAgreePrivacy()
  const res = await postLoginAPI(form.value)
  // loginSuccess(res.result)
}
// #endif

// 请先阅读并勾选协议
const isAgreePrivacy = ref(false)
const isAgreePrivacyShakeY = ref(false)
const checkedAgreePrivacy = async () => {
  if (!isAgreePrivacy.value) {
    uni.showToast({
      icon: 'none',
      title: '请先阅读并勾选协议',
    })
    // 震动提示
    isAgreePrivacyShakeY.value = true
    setTimeout(() => {
      isAgreePrivacyShakeY.value = false
    }, 500)
    // 返回错误
    return Promise.reject(new Error('请先阅读并勾选协议'))
  }
}
const getUserProfile = async () => {
  try {
    const res = await uni.getUserProfile({
      desc: '展示用户信息', // The purpose of requesting user info
    })
    console.log('===============res.userInfo', res.userInfo)
    // userInfo.value.avatar = res.userInfo.avatarUrl
    // userInfo.value.nickName = res.userInfo.nickName
    // Additional logic if needed after obtaining user info
  } catch (error) {
    console.error('Failed to get user profile:', error)
    // Handle error
  }
}

const onOpenPrivacyContract = () => {
  // #ifdef MP-WEIXIN
  // 跳转至隐私协议页面
  wx.openPrivacyContract({})
  // #endif
}
</script>

<template>
  <view class="viewport">
    <view class="logo">
      <image
        src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/logo_icon.png"
      ></image>
    </view>
    <view class="login">
      <!-- 网页端表单登录 -->
      <!-- #ifdef H5 -->
      <input v-model="form.account" class="input" type="text" placeholder="请输入用户名/手机号码" />
      <input v-model="form.password" class="input" type="text" password placeholder="请输入密码" />
      <button @tap="onSubmit" class="button phone">登录</button>
      <!-- #endif -->

      <!-- 小程序端授权登录 -->
      <!-- #ifdef MP-WEIXIN -->
      <view class="userinfo">
        <button open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
          <image class="avatar" :src="userInfo.avatarUrl"></image>
        </button>
        <view class="nickname-wrapper">
          <text class="nickname-label">昵称</text>
          <input
            type="nickname"
            class="nickname-input"
            placeholder="请输入昵称"
            @change="onInputChange"
          />
        </view>
      </view>
      <view class="button-privacy-wrap">
        <button
          :hidden="isAgreePrivacy"
          class="button-opacity button phone"
          @tap="checkedAgreePrivacy"
        >
          请先阅读并勾选协议
        </button>
        <button class="button phone" open-type="getPhoneNumber" @getphonenumber="onGetphonenumber">
          <text class="icon icon-phone"></text>
          手机号快捷登录
        </button>
      </view>
      <!-- #endif -->
      <view class="tips" :class="{ animate__shakeY: isAgreePrivacyShakeY }">
        <label class="label" @tap="isAgreePrivacy = !isAgreePrivacy">
          <radio class="radio" color="#28bb9c" :checked="isAgreePrivacy" />
          <text>登录/注册即视为你同意小兔鲜儿</text>
        </label>
        <navigator class="link" hover-class="none" url="./protocal">《服务条款》</navigator>
        和
        <text class="link" @tap="onOpenPrivacyContract">《隐私协议》</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20rpx 40rpx;
}

.logo {
  flex: 1;
  text-align: center;
  image {
    width: 220rpx;
    height: 220rpx;
    margin-top: 15vh;
  }
}

.login {
  display: flex;
  flex-direction: column;
  height: 60vh;
  padding: 40rpx 20rpx 20rpx;

  .input {
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    border: 1px solid #ddd;
    padding-left: 30rpx;
    margin-bottom: 20rpx;
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    color: #fff;
    .icon {
      font-size: 40rpx;
      margin-right: 6rpx;
    }
  }

  .phone {
    background-color: #28bb9c;
  }

  .wechat {
    background-color: #06c05f;
  }

  .extra {
    flex: 1;
    padding: 70rpx 70rpx 0;
    .caption {
      width: 440rpx;
      line-height: 1;
      border-top: 1rpx solid #ddd;
      font-size: 26rpx;
      color: #999;
      position: relative;
      text {
        transform: translate(-40%);
        background-color: #fff;
        position: absolute;
        top: -12rpx;
        left: 50%;
      }
    }

    .options {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 70rpx;
      button {
        padding: 0;
        background-color: transparent;
        &::after {
          border: none;
        }
      }
    }

    .icon {
      font-size: 24rpx;
      color: #444;
      display: flex;
      flex-direction: column;
      align-items: center;

      &::before {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 6rpx;
        font-size: 40rpx;
        border: 1rpx solid #444;
        border-radius: 50%;
      }
    }
    .icon-weixin::before {
      border-color: #06c05f;
      color: #06c05f;
    }
  }
}

@keyframes animate__shakeY {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, -5rpx);
  }
  100% {
    transform: translate(0, 0);
  }
}

.animate__shakeY {
  animation: animate__shakeY 0.2s ease-in-out 3;
}

.button-privacy-wrap {
  position: relative;
  .button-opacity {
    opacity: 0;
    position: absolute;
    z-index: 1;
  }
}

.tips {
  position: absolute;
  bottom: 80rpx;
  left: 20rpx;
  right: 20rpx;
  font-size: 22rpx;
  color: #999;
  text-align: center;

  .radio {
    transform: scale(0.6);
    margin-right: -4rpx;
    margin-top: -4rpx;
    vertical-align: middle;
  }

  .link {
    display: inline;
    color: #28bb9c;
  }
}

.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #aaa;
  width: 80%;
}

.userinfo-avatar {
  overflow: hidden;
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.usermotto {
  margin-top: 200px;
}
.avatar-wrapper {
  padding: 0;
  width: 56px !important;
  border-radius: 8px;
  margin-top: 40px;
  margin-bottom: 40px;
}

.avatar {
  display: block;
  width: 56px;
  height: 56px;
}

.nickname-wrapper {
  display: flex;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  border-top: 0.5px solid rgba(0, 0, 0, 0.1);
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
  color: black;
}

.nickname-label {
  width: 105px;
}

.nickname-input {
  flex: 1;
}

.phone-verification {
  margin: 20px;
  display: flex;
  justify-content: center;

  button {
    padding: 10px 20px;
    background-color: #f8f8f8;
    border-radius: 5px;
    border: 1px solid #ddd;
  }
}
</style>
