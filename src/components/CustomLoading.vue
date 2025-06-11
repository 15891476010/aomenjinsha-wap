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
import { watch } from "vue";

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

// 监听显示状态变化，便于调试
watch(
  () => props.show,
  (newVal) => {
    console.log("Loading component visibility changed:", newVal);
  }
);
</script>

<style scoped>
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
  border: 10px solid red;
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
  background: (0, 0, 0, 0.7);
  border-radius: 10rpx;
}

.custom-icon {
  width: 80rpx;
  height: 80rpx;
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
