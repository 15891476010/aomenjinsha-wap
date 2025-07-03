<template>
  <view class="layout">
    <view v-if="isShow" class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-content">
        <!-- 左侧按钮 -->
        <view class="left-area" @click="backToIndex">
          <image
            v-if="topNav && topNav.left_btn"
            :src="indexData.imagePrefix + topNav.left_btn"
            class="nav-icon"
            mode="aspectFit"
          />
          <text v-else class="back-text">返回</text>
        </view>

        <!-- 中间标题 -->
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

        <!-- 右侧按钮 -->
        <view class="right-area">
          <image
            v-if="topNav && topNav.download_btn"
            :src="indexData.imagePrefix + topNav.download_btn"
            class="nav-icon mr-10"
            mode="aspectFit"
          />
          <view v-if="topNav && topNav.right_btn" class="right-btn">{{ topNav.right_btn }}</view>
        </view>
      </view>
    </view>
    <view v-if="isShow" class="main">
      <view class="h-10"></view>
      <SwiperCom />
      <NoticeBarCom />
      <TargetUrlCom />
      <GameIndexCom />
    </view>
    <view class="h-70px" />
    <TabbarCom />
  </view>
</template>

<script setup lang="ts">
import SwiperCom from "@/pages/index/components/Swiper";
import NoticeBarCom from "@/pages/index/components/NoticeBar";
import TargetUrlCom from "@/pages/index/components/TargetUrl";
import GameIndexCom from "@/pages/index/components/GameIndex";
import TabbarCom from "@/components/Tabbar";
import { getIndexData } from "@/utils/auth";
import { useGameStore } from "@/store";
import { onPullDownRefresh, onShow } from "@dcloudio/uni-app";
const indexData = ref(getIndexData());
const topNav = ref(indexData.value.topNav[0]);
const statusBarHeight = ref(0);

const gameStore = useGameStore();
const isShow = ref(true);

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

// 返回首页方法
const backToIndex = () => {
  uni.reLaunch({
    url: "/pages/index/index",
  });
};

onShow(() => {
  gameStore.getUserTransfer();
});

onPullDownRefresh(() => {
  isShow.value = false;
  setTimeout(() => {
    uni.stopPullDownRefresh();
    isShow.value = true;
  }, 500);
});
</script>

<style setup lang="scss">
.layout {
  width: 100vw;
  overflow: hidden;
  animation: fadeIn 0.3s ease-out;

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
      justify-content: space-between;
      height: 44px;
      padding: 0 15px;

      .left-area {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 44px;
        height: 44px;

        .nav-icon {
          width: 20px;
          height: 20px;
        }

        .back-text {
          font-size: 14px;
          color: #333;
        }
      }

      .title-container {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;

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

      .right-area {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 44px;
        height: 44px;

        .nav-icon {
          width: 20px;
          height: 20px;
        }

        .mr-10 {
          margin-right: 10px;
        }

        .right-btn {
          padding: 4px 8px;
          font-size: 12px;
          color: #fff;
          background-color: #007aff;
          border-radius: 12px;
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
