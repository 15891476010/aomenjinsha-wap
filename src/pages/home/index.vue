<template>
  <view class="layout">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-left" @click="goBack">
        <wd-icon name="thin-arrow-left" size="18px"></wd-icon>
      </view>
      <wd-tabs v-model="type" animated swipeable>
        <block v-for="(item, index) in tabs" :key="index">
          <wd-tab :title="`${item.text}`" :name="item.subSection"></wd-tab>
        </block>
      </wd-tabs>
    </view>
    <view class="content" :style="{ top: statusBarHeight + 70 + 'px' }"></view>
  </view>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";

const type = ref<string>("");
// 获取状态栏高度
const statusBarHeight = ref(0);
const tabs = ref<any[]>([
  {
    text: "反水",
    icon: "safe",
    colorClass: "orange",
    section: "wallet",
    subSection: "cashback",
    badge: true,
    badgeClass: "amount-badge",
    badgeValue: "200.00",
  },
  {
    text: "利息宝",
    icon: "trending-up",
    colorClass: "blue",
    section: "wallet",
    subSection: "interest",
    badge: true,
    badgeClass: "rate-badge",
    badgeValue: "88.00%",
  },
  {
    text: "公积金",
    icon: "safe",
    colorClass: "orange",
    section: "wallet",
    subSection: "fund",
    badge: true,
    badgeClass: "amount-badge",
    badgeValue: "200.00",
  },
]);

/**
 * 返回上一页
 */
const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  // #ifdef APP-PLUS
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 0;
  // #endif
});
onLoad((options) => {
  type.value = options.type;
});
</script>
<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
  .header {
    position: fixed;
    z-index: 9999;
    display: flex;
    align-items: center;
    width: 100%;
    background-color: #ffffff;
    border-bottom: 1px solid #000000;
    .header-left {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100rpx;
      height: 100rpx;
    }
  }

  .content {
    position: absolute;
    left: 50%;
    width: 95%;
    height: 100vh;
    border: 1px solid red;
    transform: translateX(-50%);
  }
}
</style>
