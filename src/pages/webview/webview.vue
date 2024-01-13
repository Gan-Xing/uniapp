<template>
  <web-view :src="webviewUrl"></web-view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  url: {
    type: String,
    default: 'https://www.baidu.com',
  },
})

const webviewUrl = ref(props.url)

onMounted(() => {
  // 如果需要，您可以在这里根据条件设置不同的URL
  // webviewUrl.value = 'https://其他网址.com';
})
</script>

<style scoped>
/* 您可以在这里添加一些样式 */
.web-view {
  width: 100%;
  height: 100%;
}
</style>
