<template>
  <wd-swiper
    v-model:current="current"
    :list="swiperList"
    class="swiper-container"
    customItemClass="swiper-item"
    value-key="image"
    autoplay
    :indicator="{ type: 'dots-bar' }"
    imageMode="scaleToFill"
    @click="handleClick"
    @change="onChange"
  ></wd-swiper>
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
function handleClick(e) {
  console.log(e);
}
function onChange(e) {
  console.log(e);
}

onMounted(() => {
  addPrefix();
});
</script>

<style lang="scss">
.swiper-container {
  height: 250rpx;
}

.swiper-item {
  position: absolute !important;
  top: 0 !important;
  height: 250rpx !important;
  overflow: hidden !important;
  border: 1px solid #e5e5e5e5 !important;
}
</style>
