<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { ref, onMounted } from "vue";
import { getIndexData } from "@/utils/auth";

const indexData = ref(getIndexData());

onLaunch(() => {
  console.log("App Launch");
  // #ifdef H5
  document.title = indexData.value.websiteName;
  // 动态设置favicon
  let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement("link") as HTMLLinkElement;
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

onMounted(() => {});
</script>

<template>
  <view>
    <!-- 全局注册wot-design-uni的组件 -->
    <wd-message-box />
    <wd-toast />
    <wd-loading />
  </view>
</template>

<style>
/* 全局隐藏滚动条样式 */
/* 应用到所有元素 */
* {
  /* Webkit内核浏览器 (Chrome, Safari, Edge) */
  -webkit-scrollbar: none !important;
  /* Firefox */
  scrollbar-width: none !important;
  /* IE 10+ */
  -ms-overflow-style: none !important;
}

*::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
}

/* 确保页面滚动功能正常 */
page {
  overflow-x: hidden;
  overflow-y: auto;
}

/* 针对 uni-app 页面容器 */
.uni-page-body {
  overflow-x: hidden !important;
}

/* 针对 wot-design-uni 组件 */
.wd-tabs,
.wd-tabs *,
.wd-tabs__nav-wrap,
.wd-tabs__nav {
  -webkit-scrollbar: none !important;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

.wd-tabs__nav-wrap::-webkit-scrollbar,
.wd-tabs__nav::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}
</style>
