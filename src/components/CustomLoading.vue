<template>
  <view v-if="show" class="custom-loading-mask" :class="{ mask: mask }">
    <view class="custom-loading">
      <image v-if="customIcon" class="custom-icon" :src="customIcon" mode="aspectFit"></image>
      <view v-else class="default-icon"></view>
      <text class="loading-text">{{ title || "加载中..." }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { watch, onMounted, ref } from "vue";

// 定义props
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "加载中...",
  },
  customIcon: {
    type: String,
    default: "",
  },
  mask: {
    type: Boolean,
    default: true,
  },
});

// 内部状态，用于强制更新
const forceUpdate = ref(0);

// 监听显示状态变化，便于调试
watch(
  () => props.show,
  (newVal) => {
    console.log("Loading component visibility changed:", newVal);
    console.log("Loading component customIcon:", props.customIcon);

    // 强制触发视图更新
    if (newVal) {
      forceUpdate.value++;
      setTimeout(() => {
        console.log("Loading component should be visible now");
        console.log("Current customIcon:", props.customIcon);
        forceUpdate.value++; // 再次更新以确保渲染
      }, 100);
    }
  }
);

// 监听图标变化
watch(
  () => props.customIcon,
  (newVal) => {
    console.log("Loading component customIcon changed:", newVal);
    forceUpdate.value++; // 强制更新
  }
);

onMounted(() => {
  console.log("CustomLoading component mounted");
  console.log("Initial props:", {
    show: props.show,
    title: props.title,
    customIcon: props.customIcon,
    mask: props.mask,
  });
});
</script>

<style>
/* 全局样式，确保在所有平台上都能正确显示 */
.custom-loading-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mask {
  background-color: rgba(0, 0, 0, 0.4);
}

.custom-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200rpx;
  min-height: 200rpx;
  padding: 30rpx;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10rpx;
}

.custom-icon {
  width: 80rpx;
  height: 80rpx;
  animation: spin 1s linear infinite; /* 添加旋转动画 */
}

.default-icon {
  width: 60rpx;
  height: 60rpx;
  border: 5rpx solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #ffffff;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
