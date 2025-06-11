<template>
  <view>
    <CustomLoading v-bind="loadingState" />
    <view class="content">
      <router-view />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import CustomLoading from "@/components/CustomLoading.vue";
import { getLoadingState } from "@/utils/loading";
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useThemeStore } from "@/store";

// 主题初始化
const themeStore = useThemeStore();

// 获取加载状态 - 使用深度监听确保响应性
const loadingState = computed(() => getLoadingState());

// 监听加载状态变化
watch(
  () => loadingState.value.show,
  (newVal) => {
    console.log("App loading state changed:", newVal);
    console.log("Current loading state:", loadingState.value);
  },
  { immediate: true }
);

onMounted(() => {
  console.log("App mounted");
  console.log("Initial loading state:", loadingState.value);
});

onLaunch(() => {
  console.log("App Launch");
  // 初始化主题
  themeStore.initTheme();
});

onShow(() => {
  console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});
</script>

<style lang="scss">
@import "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap";
@import "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap";
@import "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap";
@import "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap";
@import "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600;700&display=swap";
/* 全局样式文件或 App.vue 的 style */
/* 强制覆盖所有元素 */
:deep(*) {
  font-family: "Montserrat", "Noto Sans", "Roboto", "Open Sans", "Lato", sans-serif;
}
/* H5 环境样式变量设置 */
:root {
  --primary-color: #165dff;
  --primary-color-light: #94bfff;
  --primary-color-dark: #0e3c9b;
}

/* 小程序环境样式变量设置 */
page {
  --primary-color: #165dff;
  --primary-color-light: #94bfff;
  --primary-color-dark: #0e3c9b;
  background: #f8f8f8;
}

/* 动态加载小程序主题色的钩子 */
/* 用于通过小程序原生API获取主题色并应用 */
.theme-container {
  display: none;
}

/* 响应式设计 - 当屏幕宽度小于450px时整体缩小而不是挤压元素 */
@media screen and (max-width: 450px) {
  #app {
    width: calc(100% / var(--scale-ratio, 0.9));
    height: auto;
    transform: scale(var(--scale-ratio, 0.9));
    transform-origin: top left;
  }

  /* 动态计算缩放比例 */
  :root {
    --scale-ratio: calc(100vw / 450);
  }
}
</style>
