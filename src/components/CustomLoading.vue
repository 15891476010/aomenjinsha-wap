<template>
  <view v-if="isShow" class="custom-loading">
    <view v-if="isMask" class="custom-loading-mask"></view>
    <view class="custom-loading-container">
      <image class="custom-loading-icon" :src="iconSrc" mode="aspectFit" />
      <text class="custom-loading-text">{{ titleText }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { loadingState } from "@/utils/request";
import { watch, computed } from "vue";

// 使用计算属性来获取最新的状态
const isShow = computed(() => loadingState.value.show);
const titleText = computed(() => loadingState.value.title);
const iconSrc = computed(() => loadingState.value.customIcon);
const isMask = computed(() => loadingState.value.mask);

// 添加状态监听以便调试
watch(
  isShow,
  (newVal) => {
    console.log("CustomLoading组件: show变化为", newVal);
    console.log("CustomLoading组件: 当前完整状态", {
      show: isShow.value,
      title: titleText.value,
      icon: iconSrc.value,
      mask: isMask.value,
    });
  },
  { immediate: true }
);
</script>

<style scoped>
.custom-loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99999; /* 确保在最上层 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-loading-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.custom-loading-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 240rpx;
  height: 240rpx;
  padding: 30rpx;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 16rpx;
}

.custom-loading-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 20rpx;
}

.custom-loading-text {
  font-size: 28rpx;
  color: #ffffff;
  text-align: center;
}
</style>
