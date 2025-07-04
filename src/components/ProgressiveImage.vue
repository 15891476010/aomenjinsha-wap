<template>
  <view class="progressive-image-container">
    <!-- 加载中的骨架屏 -->
    <view class="image-placeholder" :style="{ opacity: imageLoaded ? 0 : 1 }"></view>

    <!-- 实际图片 -->
    <image
      class="progressive-image"
      :src="src"
      :mode="mode || 'aspectFit'"
      :style="{ opacity: imageLoaded ? 1 : 0 }"
      :lazy-load="true"
      @load="onImageLoad"
      @error="onImageError"
    />

    <!-- 加载错误显示 -->
    <view v-if="loadError" class="image-error">
      <text class="error-text">图片加载失败</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 定义组件属性
defineProps({
  src: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    default: "aspectFit",
  },
});

// 图片加载状态
const imageLoaded = ref(false);
const loadError = ref(false);

// 图片加载完成的处理函数
function onImageLoad() {
  // 使用setTimeout增加一点延迟，让骨架屏过渡更平滑
  setTimeout(() => {
    imageLoaded.value = true;
  }, 100);
}

// 图片加载失败的处理函数
function onImageError() {
  loadError.value = true;
}
</script>

<style lang="scss">
.progressive-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: transparent;

  .image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0);
    background-size: 200% 100%;
    transition: opacity 0.3s ease;
    animation: shimmer 1.5s infinite;
  }

  .progressive-image {
    width: 100%;
    height: 100%;
    transition: opacity 0.5s ease;
  }

  .image-error {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #f8f8f8;

    .error-text {
      font-size: 22rpx;
      color: #999;
    }
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
