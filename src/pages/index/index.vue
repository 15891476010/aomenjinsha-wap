<template>
  <view style="width: 100%; height: var(--status-bar-height)" />
  <NavBarCom style="z-index: 9999" />
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
</script>

<style setup lang="scss">
.layout {
  width: 95%;
  margin: 70px auto;
}
</style>
