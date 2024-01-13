<template>
  <view class="success-page">
    <view class="success-container">
      <image class="success-icon" src="https://picsum.photos/seed/picsum/200/200"></image>
      <text class="success-text">登录成功</text>
      <button class="home-button" @tap="goToBaidu">回到主页</button>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    goToBaidu() {
      // 打开百度网址
      uni.navigateTo({
        url: '/pages/webview/webview?url=' + encodeURIComponent('https://ganyiconsulting.com'),
      })
    },
  },
}
</script>

<style scoped>
.success-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.success-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
  border-radius: 100rpx;
}

.success-text {
  font-size: 36rpx;
  color: #333;
  margin-bottom: 15rpx;
}

.home-button {
  width: 60%;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #28bb9c;
  color: white;
  border-radius: 40rpx;
  text-align: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
}
</style>
