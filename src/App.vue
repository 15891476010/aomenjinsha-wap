<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

onLaunch(() => {
  console.log("App Launch");
});

onShow(() => {
  console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});

onMounted(() => {
  console.log("App Mounted");
});
</script>

<template>
  <view>
    <!-- 自定义加载组件 -->
    <CustomLoading
      :show="loadingState.show"
      :title="loadingState.title"
      :customIcon="loadingState.customIcon"
      :mask="loadingState.mask"
    />
  </view>
</template>

<style>
/* 全局样式 */
.content {
  width: 100%;
  min-height: 100vh;
}
</style>
