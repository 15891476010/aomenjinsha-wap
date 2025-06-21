<template>
  <view class="layout">
    <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content">
        <view v-if="topNav" class="title-container">
          <image
            v-if="topNav.img_title"
            :src="indexData.imagePrefix + topNav.image_title_url"
            class="title-image"
            mode="aspectFit"
          />
          <view v-else class="title-text-container" :style="{ color: topNav.title_color }">
            <image
              v-if="topNav.logo"
              :src="indexData.imagePrefix + topNav.logo"
              class="logo-image"
              mode="aspectFit"
            />
            <view class="title-text">
              {{ topNav.title }}
              <text v-if="topNav.nav_title" class="subtitle">{{ topNav.nav_title }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="main">
      <SwiperCom />
      <NoticeBarCom />
      <TargetUrlCom />
      <GameIndexCom />
    </view>
    <view style="height: 80px"></view>
    <TabbarCom />
  </view>
</template>

<script setup lang="ts">
import TabbarCom from "@/components/Tabbar";
import SwiperCom from "@/pages/index/components/Swiper";
import NoticeBarCom from "@/pages/index/components/NoticeBar";
import TargetUrlCom from "@/pages/index/components/TargetUrl";
import GameIndexCom from "@/pages/index/components/GameIndex";
import { getIndexData } from "@/utils/auth";
const indexData = ref(getIndexData());
const topNav = ref(indexData.value.topNav[0]);
const statusBarHeight = ref(0);

// 获取状态栏高度
uni.getSystemInfo({
  success: (res) => {
    statusBarHeight.value = res.statusBarHeight || 0;
    // 设置CSS变量
    // #ifdef H5
    document.documentElement.style.setProperty("--status-bar-height", `${statusBarHeight.value}px`);
    // #endif
  },
});
</script>

<style setup lang="scss">
.layout {
  width: 100vw;
  overflow: hidden;

  .custom-navbar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);

    .navbar-content {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 44px;
      padding: 0 15px;

      .title-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;

        .title-image {
          width: 150px;
          height: 40px;
        }

        .title-text-container {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;

          .logo-image {
            width: 40px;
            height: 40px;
            margin-right: 8px;
          }

          .title-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-weight: bold;

            .subtitle {
              margin-top: 2px;
              font-size: 12px;
              font-weight: normal;
            }
          }
        }
      }
    }
  }

  .main {
    width: 97%;
    margin: 0 auto;
    margin-top: calc(44px + var(--status-bar-height, 0px));
  }
}
</style>
