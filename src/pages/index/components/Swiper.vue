<template>
  <view class="custom-swiper-container">
    <swiper
      class="custom-swiper"
      :indicator-dots="true"
      :autoplay="true"
      :interval="3000"
      :duration="500"
      :circular="true"
      @change="onChange"
    >
      <swiper-item v-for="(item, index) in swiperList" :key="index" @click="handleClick(item)">
        <image :src="item.image" mode="aspectFill" class="swiper-image" />
      </swiper-item>
    </swiper>
    <view class="custom-indicator">
      <view
        v-for="(item, index) in swiperList"
        :key="index"
        :class="['indicator-dot', current === index ? 'active' : '']"
      ></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getIndexData } from "@/utils/auth";
const indexData = ref(getIndexData());
const current = ref<number>(0);
const swiperList = ref(indexData.value.banner);

function addPrefix() {
  return swiperList.value.map((item) => {
    item.image = indexData.value.imagePrefix + item.image;
  });
}
function handleClick(item) {
  console.log("点击了轮播图项目:", item);
  // 这里可以添加跳转逻辑，例如：
  // if (item.url) {
  //   uni.navigateTo({
  //     url: item.url
  //   });
  // }
}

function onChange(e) {
  current.value = e.detail.current;
  console.log("轮播图切换到:", current.value);
}

onMounted(() => {
  addPrefix();
});
</script>

<style lang="scss">
.custom-swiper-container {
  position: relative;
  width: 100%;
  height: 250rpx;
  margin: 20rpx 0;
  overflow: hidden;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.custom-swiper {
  width: 100%;
  height: 250rpx;
}

.swiper-image {
  display: block;
  width: 100%;
  height: 100%;
}

.custom-indicator {
  position: absolute;
  bottom: 20rpx;
  left: 50%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%);
}

.indicator-dot {
  width: 16rpx;
  height: 16rpx;
  margin: 0 8rpx;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 8rpx;
  transition: all 0.3s ease;
}

.indicator-dot.active {
  width: 24rpx;
  background-color: #ffffff;
}
</style>
