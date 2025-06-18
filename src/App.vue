<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { getIndexData } from "@/utils/auth";
const indexData = ref(getIndexData());

onLaunch(() => {
  // #ifdef H5
  document.title = indexData.value.websiteName;
  // 动态设置favicon
  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = `${indexData.value.imagePrefix}${indexData.value.favicon}`;
  // #endif
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
