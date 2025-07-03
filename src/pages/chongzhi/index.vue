<template>
  <view class="deposit-page">
    <!-- 顶部栏 -->
    <view class="header">
      <view class="user-info">
        <text class="user-name">
          {{ userInfo && userInfo.username ? userInfo.username : "未登录" }}
        </text>
        <text class="balance">余额: {{ userInfo ? userInfo.balance : 0.0 }} RMB</text>
      </view>
      <text class="title">线上存款</text>
    </view>

    <!-- 第一层：支付方式Tab -->
    <view class="pay-tabs">
      <view
        v-for="(tab, idx) in payTabs"
        :key="tab.id"
        :class="['tab', { active: idx === activeTab }]"
        @click="
          () => {
            activeTab = idx;
            activeChannel = 0;
            activeSecond = 0;
          }
        "
      >
        <view v-if="tab.isHot" class="hot-badge">推荐</view>
        <view v-if="tab.tag" class="tag-badge">{{ tab.tag }}</view>
        {{ tab.name }}
      </view>
    </view>

    <!-- 第二层：渠道卡片 -->
    <view class="pay-channels">
      <view
        v-for="(item, idx) in currentChannels"
        :key="item.id"
        :class="['channel-card', { selected: idx === activeChannel }]"
        @click="
          () => {
            activeChannel = idx;
            activeSecond = 0;
          }
        "
      >
        <view v-if="item.isHot" class="hot-badge">推荐</view>
        <view v-if="item.tag" class="tag-badge">{{ item.tag }}</view>
        <image :src="indexData.imagePrefix + item.icon" class="channel-icon" />
        <text class="channel-name">{{ item.name }}</text>
      </view>
    </view>

    <!-- 第三层：子渠道卡片 -->
    <view v-if="currentSeconds.length > 0" class="pay-seconds">
      <view
        v-for="(item, idx) in currentSeconds"
        :key="item.id"
        :class="['second-card', { selected: idx === activeSecond }]"
        @click="activeSecond = idx"
      >
        <view v-if="item.isHot" class="hot-badge">推荐</view>
        <view v-if="item.tag" class="tag-badge">{{ item.tag }}</view>
        {{ item.name }}
      </view>
    </view>

    <!-- 第四层：金额选择 -->
    <view
      v-if="
        currentSeconds[activeSecond] &&
        currentSeconds[activeSecond].three &&
        currentSeconds[activeSecond].three.length > 0
      "
      class="amount-section"
    >
      <view class="amount-title">
        存款金额 ({{ currentSeconds[activeSecond].minPrice || 30 }}元 -
        {{ currentSeconds[activeSecond].maxPrice || 100000 }}元)
      </view>
      <view class="amount-btns">
        <view
          v-for="item in currentSeconds[activeSecond].three"
          :key="item.id"
          :class="['amount-btn', { selected: selectedAmount === item.amount }]"
          @click="selectAmount(item.amount)"
        >
          <view v-if="item.isHot" class="hot-badge">推荐</view>
          <view v-if="item.tag" class="tag-badge">{{ item.tag }}</view>
          {{ item.amount }}
        </view>
        <input
          v-if="currentSeconds[activeSecond]?.isOnlySetting"
          v-model="customAmount"
          class="amount-input"
          placeholder="自定义金额"
          type="number"
          @focus="selectedAmount = null"
        />
      </view>
    </view>
    <view class="common">{{ currentSeconds[activeSecond]?.common || "" }}</view>

    <!-- 优惠信息 -->
    <view class="promo-section">
      <view class="promo-title">首存优惠</view>
      <view class="promo-detail">尚差存款 1 元</view>
      <view class="promo-desc">存款优惠0.5%</view>
    </view>

    <!-- 确认按钮 -->
    <button class="submit-btn" :disabled="!canSubmit" @click="handleSubmit">确认提交</button>

    <!-- 底部提示 -->
    <view class="tips">
      <view>1. 强烈建议使用USDT/电子钱包充值，无限秒到帐，极致体验！</view>
      <view>2. 参与USDT/电子钱包充值专属优惠，乐享优越金融体验！</view>
    </view>
    <wd-toast />
  </view>
  <view class="h-70px" />
  <TabbarCom />
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import TabbarCom from "@/components/Tabbar";
import { useUserStore } from "@/store/modules/user";
import RechargeApi from "@/api/recharge";
import { getIndexData } from "@/utils/auth";
const indexData = ref(getIndexData());

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

const payTabs = ref<any[]>([]);
const activeTab = ref(0);
const activeChannel = ref(0);
const activeSecond = ref(0);
const selectedAmount = ref<number | null>(null);
const customAmount = ref("");
const canSubmit = ref(false);

// 当前渠道（第二层）
const currentChannels = computed(() => {
  if (!payTabs.value.length) return [];
  return payTabs.value[activeTab.value]?.config || [];
});
// 当前second（第三层）
const currentSeconds = computed(() => {
  if (!currentChannels.value.length) return [];
  return currentChannels.value[activeChannel.value]?.second || [];
});

function selectAmount(amt: number) {
  selectedAmount.value = amt;
  customAmount.value = "";
  canSubmit.value = true;
}

async function getRecharge() {
  const res = await RechargeApi.getRecharge();
  payTabs.value = res;
}

function handleSubmit() {
  // 获取当前 three 层级的对象
  const currentSecond = currentSeconds.value[activeSecond.value];
  let selectedThree = null;
  if (currentSecond && currentSecond.three && currentSecond.three.length > 0) {
    selectedThree = currentSecond.three.find((item: any) => item.amount === selectedAmount.value);
  }
  // 如果是自定义金额
  const amount = selectedAmount.value || customAmount.value;
  console.log("当前金额对象：", selectedThree);
  console.log("提交金额：", amount);
  window.open(selectedThree.targer + "?amount=" + amount, selectedThree.openType);
}

onMounted(() => {
  getRecharge();
});
</script>

<style scoped>
.deposit-page {
  width: 95%;
  min-height: 100vh;
  margin: 0 auto;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  background: #f7f8fa;
  animation: fadeIn 0.3s ease-out;
}
.header {
  position: relative;
  padding: 24px 16px 12px 16px;
  color: #fff;
  background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
  border-radius: 0 0 18px 18px;
}
.user-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  opacity: 0.85;
}
.title {
  margin-top: 8px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}
.pay-tabs {
  display: flex;
  margin: 16px 0 10px 0;
  overflow-x: auto;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px #e0e6ed33;
}
.tab {
  position: relative;
  flex: 1;
  padding: 14px 0;
  font-size: 16px;
  color: #888;
  text-align: center;
  cursor: pointer;
  background: #fff;
  border-bottom: 2px solid transparent;
  transition: 0.2s;
}
.common {
  padding: 14px 0;
  margin-bottom: 10px;
  font-size: 14px;
  color: red;
  text-align: center;
  cursor: pointer;
  background: #fff;
  border-radius: 5px;
  transition: 0.2s;
}
.tab.active {
  font-weight: bold;
  color: #2a5298;
  background: #f0f6ff;
  border-bottom: 2px solid #2a5298;
}
.pay-channels {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 18px 0 10px 0;
}
.channel-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  cursor: pointer;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 12px;
  box-shadow: 0 2px 8px #e0e6ed33;
  transition:
    box-shadow 0.2s,
    border 0.2s;
}
.channel-card.selected {
  border: 2px solid #2a5298;
  box-shadow: 0 4px 12px #2a529822;
}
.channel-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 6px;
}
.channel-name {
  font-size: 14px;
  font-weight: 500;
  color: #222;
  text-align: center;
}
.pay-seconds {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 12px 0;
}
.second-card {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 90px;
  padding: 10px 0 10px 18px;
  padding: 10px;
  font-size: 14px;
  color: #222;
  cursor: pointer;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 10px;
  box-shadow: 0 2px 8px #e0e6ed33;
  transition: border 0.2s;
}
.second-card.selected {
  font-weight: bold;
  color: #2a5298;
  border: 2px solid #2a5298;
}
.amount-section {
  padding: 14px 16px;
  margin: 0 0 18px 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #e0e6ed33;
}
.amount-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}
.amount-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}
.amount-btn {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 50px;
  padding: 10px 0 10px 18px;
  font-size: 15px;
  color: #2a5298;
  cursor: pointer;
  background: #f0f6ff;
  border: 1.5px solid #e0e6ed;
  border-radius: 8px;
  transition: 0.2s;
}
.amount-btn.selected {
  color: #fff;
  background: #2a5298;
  border: 1.5px solid #2a5298;
}
.amount-input {
  flex: 1;
  min-width: 80px;
  padding: 8px 12px;
  font-size: 15px;
  border: 1.5px solid #e0e6ed;
  border-radius: 8px;
  outline: none;
}
.rate-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
.rate-btn {
  padding: 4px 12px;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
  background: #2a5298;
  border: none;
  border-radius: 6px;
}
.promo-section {
  padding: 14px 16px;
  margin: 0 0 18px 0;
  font-size: 15px;
  color: #2a5298;
  background: linear-gradient(90deg, #f0f6ff 0%, #e0e6ed 100%);
  border-radius: 12px;
}
.promo-title {
  margin-bottom: 4px;
  font-weight: bold;
}
.promo-detail {
  margin-bottom: 2px;
  font-size: 14px;
}
.promo-desc {
  font-size: 13px;
  color: #888;
}
.submit-btn {
  width: 100%;
  padding: 14px 0;
  margin: 18px 0 10px 0;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 8px #2a529822;
  transition: 0.2s;
}
.submit-btn:disabled {
  color: #fff;
  background: #ccc;
}
.tips {
  padding: 20px;
  margin: 0 0 18px 0;
  font-size: 13px;
  color: #e74c3c;
}
.hot-badge,
.tag-badge {
  position: absolute;
  top: -6px;
  left: 0px;
  z-index: 10;
  padding: 0 6px;
  font-size: 12px;
  color: #fff;
  border-radius: 8px;
}
.hot-badge {
  background: #ff4d4f;
}
.tag-badge {
  top: -6px;
  left: 70px;
  background: #ff4d4f;
}
</style>
