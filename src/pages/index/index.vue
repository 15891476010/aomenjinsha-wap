<template>
  <view style="width: 100%; height: var(--status-bar-height)" />
  <NavBarCom v-if="topNav" style="z-index: 9999" :top-nav="topNav" />
  <view class="layout">
    <SwiperCom />
    <NoticeBarCom />
    <TargetUrlCom />
    <GameIndexCom />
  </view>
  <view style="height: 80px"></view>
  <TabbarCom />
</template>

<script setup lang="ts">
import TabbarCom from "@/components/Tabbar";
import NavBarCom from "@/components/NavBar";
import SwiperCom from "@/pages/index/components/Swiper";
import NoticeBarCom from "@/pages/index/components/NoticeBar";
import TargetUrlCom from "@/pages/index/components/TargetUrl";
import GameIndexCom from "@/pages/index/components/GameIndex";
import { getIndexData } from "@/utils/auth";
const indexData = ref(getIndexData());
const topNav = ref(indexData.value.topNav[0]);
</script>

<style setup lang="scss">
.layout {
  width: 95%;
  margin: 70px auto;
}
</style>
