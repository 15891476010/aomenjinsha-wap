<template>
  <view class="optimized-image">
    <ProgressiveImage :src="processedSrc" :mode="mode" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ProgressiveImage from "./ProgressiveImage.vue";

// 定义属性
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    default: "aspectFit",
  },
  quality: {
    type: Number,
    default: 80, // 默认质量80%
  },
  format: {
    type: String,
    default: "webp", // 默认转换为webp
  },
  width: {
    type: [Number, String],
    default: 0,
  },
  height: {
    type: [Number, String],
    default: 0,
  },
  useCdn: {
    type: Boolean,
    default: true, // 默认使用CDN
  },
});

const imageCache = ref<Record<string, string>>({});
const processedSrc = computed(() => {
  // 如果缓存中存在，直接返回缓存的URL
  if (imageCache.value[props.src]) {
    return imageCache.value[props.src];
  }

  // 检查是否为网络图片
  if (!props.src || !props.useCdn || !props.src.startsWith("http")) {
    return props.src;
  }

  try {
    // 这里可以根据项目实际情况，添加图片优化参数
    // 例如使用阿里云OSS、腾讯云COS、七牛云等CDN服务的图片处理参数
    // 以下为示例，实际使用时需要根据您使用的CDN服务进行调整
    let optimizedUrl = props.src;

    // 添加格式转换参数（仅作示例，需要根据实际CDN修改）
    if (props.format === "webp") {
      optimizedUrl += "?format=webp";
    }

    // 添加质量压缩参数
    optimizedUrl += `&quality=${props.quality}`;

    // 添加尺寸调整参数
    if (props.width && props.height) {
      optimizedUrl += `&resize=${props.width}x${props.height}`;
    } else if (props.width) {
      optimizedUrl += `&w=${props.width}`;
    } else if (props.height) {
      optimizedUrl += `&h=${props.height}`;
    }

    // 缓存处理后的URL
    imageCache.value[props.src] = optimizedUrl;
    return optimizedUrl;
  } catch (error) {
    console.error("图片URL处理出错:", error);
    return props.src;
  }
});

// 在组件挂载时预加载图片
onMounted(() => {
  if (props.src) {
    const img = new Image();
    img.src = processedSrc.value;
  }
});
</script>

<style lang="scss">
.optimized-image {
  width: 100%;
  height: 100%;
}
</style>
