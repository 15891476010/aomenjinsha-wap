<template>
  <view class="home-page">
    <!-- 顶部导航栏组件 -->
    <TopNavigation />
  </view>
</template>

<script setup lang="ts">
import TopNavigation from '../components/TopNavigation.vue'
</script>

<style lang="scss" scoped>
.home-page {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  /* 优化滚动性能 */
  -webkit-overflow-scrolling: touch;
  /* 确保页面可以正常滚动 */
  position: relative;
}
</style>
