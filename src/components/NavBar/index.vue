<template>
  <wd-navbar left-text="返回" class="navbar" fixed>
    <template #title>
      <wd-img
        v-if="topNav.img_title"
        :width="150"
        :height="40"
        :src="indexData.imagePrefix + topNav.image_title_url"
        class="logo"
      />
      <view v-else :style="{ color: topNav.title_color }" class="title_box">
        <wd-img :width="40" :height="40" :src="indexData.imagePrefix + topNav.logo" class="logo" />
        <view class="title">
          {{ topNav.title }}
          <span v-if="topNav.nav_title" class="nav_title">{{ topNav.nav_title }}</span>
        </view>
      </view>
    </template>
    <template #left>
      <wd-img
        v-if="topNav.left_btn"
        :width="20"
        :height="20"
        :src="indexData.imagePrefix + topNav.left_btn"
        class="logo"
      />
    </template>
    <template #right>
      <wd-img
        v-if="topNav.download_btn"
        :width="20"
        :height="20"
        :src="indexData.imagePrefix + topNav.download_btn"
        class="logo mr-30"
      />
      <wd-tag v-if="topNav.right_btn" round type="primary">{{ topNav.right_btn }}</wd-tag>
    </template>
  </wd-navbar>
</template>

<script setup lang="ts">
import { getIndexData } from "@/utils/auth";
const indexData = getIndexData();
const topNav = ref(indexData.topNav[0]);
</script>

<style setup lang="scss">
.navbar {
  :deep(.wd-navbar) {
    height: 60px;
  }

  .title_box {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;

    .title {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      font-weight: bold;

      .nav_title {
        width: 100%;
        margin-top: -25px;
        font-size: 12px;
      }
    }
  }
}
</style>
