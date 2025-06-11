<template>
  <view class="withdraw-page">
    <!-- 顶部选项卡 -->
    <!-- <wd-segmented v-model:value="current" :options="list" size="large"></wd-segmented> -->
    <wd-tabs v-model="current">
      <block v-for="(item, index) in list" :key="index">
        <wd-tab :title="`${item.label}`"></wd-tab>
      </block>
    </wd-tabs>

    <template v-if="current === 1">
      <!-- 提现到 -->
      <view class="withdraw-section">
        <view class="section-title">提现到</view>
        <view class="add-method" @click="addWithdrawMethod">
          <view class="add-icon">+</view>
          <view class="add-text">
            <view>添加取款方式</view>
            <view class="add-subtext">添加USDT地址</view>
          </view>
        </view>
      </view>

      <!-- 金额 -->
      <view class="amount-section">
        <view class="section-title">金额</view>
        <view class="amount-input-container">
          <input class="amount-input" type="number" placeholder="请输入转账金额" />
          <view class="currency-label">CNY</view>
        </view>
      </view>

      <!-- 支付密码 -->
      <view class="password-section">
        <view class="section-title">支付密码</view>
        <input class="password-input" type="password" placeholder="请输入支付密码" />
      </view>

      <!-- USDT换算 -->
      <view class="usdt-section">
        <view class="usdt-row">
          <view class="usdt-label">USDT换算:</view>
          <view class="usdt-value">0.00</view>
          <view class="usdt-rate">参考汇率: 7.1</view>
        </view>
        <view class="usdt-row">
          <view class="usdt-label">实际到账:</view>
          <view class="usdt-value">0.00</view>
        </view>
      </view>
    </template>

    <template v-else>
      <!-- 人民币取款界面 -->
      <!-- 提现到 -->
      <view class="withdraw-section">
        <view class="section-title">提现到</view>
        <!-- 银行卡列表 -->
        <view v-if="bankCards.length > 0">
          <view
            v-for="(card, index) in bankCards"
            :key="index"
            class="bank-card"
            :class="{ active: selectedBankIndex === index }"
            @click="selectBankCard(index)"
          >
            <view class="bank-icon">🏦</view>
            <view class="bank-info">
              <view>{{ card.bankName }}-{{ card.userName }}</view>
              <view class="bank-number">{{ card.cardNumber }}</view>
            </view>
          </view>
        </view>
        <!-- 添加银行卡 -->
        <view class="add-method" @click="addBankCard">
          <view class="add-icon">+</view>
          <view class="add-text">
            <view>添加取款方式</view>
            <view class="add-subtext">添加银行卡</view>
          </view>
        </view>
      </view>

      <!-- 金额 -->
      <view class="amount-section">
        <view class="section-title">金额</view>
        <view class="amount-input-container">
          <input v-model="amount" class="amount-input" type="number" placeholder="请输入转账金额" />
          <view class="currency-label">CNY</view>
        </view>
      </view>

      <!-- 支付密码 -->
      <view class="password-section">
        <view class="section-title">支付密码</view>
        <input
          v-model="password"
          class="password-input"
          type="password"
          placeholder="请输入支付密码"
        />
      </view>
    </template>

    <!-- 温馨提示 -->
    <view class="tips-section">
      <view class="tips-icon">!</view>
      <view class="tips-text">
        温馨提示: 如有疑问请联系客服
        <text class="contact-link" @click="contactService">联系客服</text>
      </view>
    </view>

    <!-- 确认按钮 -->
    <button class="confirm-btn" @click="confirmWithdraw">确认</button>

    <view style="height: 80px"></view>
    <TabbarCom />
  </view>
</template>

<script setup lang="ts">
import TabbarCom from "@/components/Tabbar";
import { DictCodeEnum } from "@/enums/DictCodeEnum";
import DictAPI from "@/api/system/dict";
import { onMounted, ref, watch } from "vue";

const list = ref<string[]>([]);
const current = ref(1); // 默认显示人民币取款
const amount = ref("");
const password = ref("");

// 银行卡数据
const bankCards = ref([
  {
    bankName: "建设银行",
    userName: "张泽",
    cardNumber: "621700415001041328",
  },
]);
const selectedBankIndex = ref(0); // 默认选中第一张银行卡

// 选择银行卡
function selectBankCard(index: number) {
  selectedBankIndex.value = index;
  console.log(`选择了银行卡: ${bankCards.value[index].bankName}`);
}

function addWithdrawMethod() {
  uni.navigateTo({
    url: "/pages/mine/simple/firstBind",
  });
}

function addBankCard() {
  uni.navigateTo({
    url: "/pages/mine/simple/firstBind",
  });
}

function contactService() {
  // 联系客服的逻辑
  console.log("联系客服");
}

function confirmWithdraw() {
  // 确认提现的逻辑
  if (current.value === "虚拟币取款") {
    console.log("确认虚拟币提现");
  } else {
    if (bankCards.value.length === 0) {
      console.log("请先添加银行卡");
      return;
    }
    if (!amount.value) {
      console.log("请输入提现金额");
      return;
    }
    if (!password.value) {
      console.log("请输入支付密码");
      return;
    }

    const selectedCard = bankCards.value[selectedBankIndex.value];
    console.log(`确认人民币提现到: ${selectedCard.bankName}, 金额: ${amount.value}`);
  }
}

async function getDictItems() {
  const res = await DictAPI.getDictItems(DictCodeEnum.WITHDRAW_TYPE_DICT);
  console.log("res", res);
  list.value = res;
}

onMounted(() => {
  getDictItems();
});

// 监听标签切换
watch(current, (newValue) => {
  console.log(`切换到${newValue}`);
});
</script>

<style scoped>
.withdraw-page {
  width: 95%;
  min-height: 100vh;
  padding: 10px;
  margin: 0 auto;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  background: #f7f8fa;
}

.withdraw-section,
.amount-section,
.password-section,
.usdt-section,
.tips-section {
  padding: 15px;
  margin-top: 20px;
  background: #fff;
  border-radius: 10px;
}

.section-title {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.add-method {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.add-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 15px;
  font-size: 24px;
  color: #666;
  background: #f0f0f0;
  border-radius: 50%;
}

.add-text {
  font-size: 15px;
  color: #333;
}

.add-subtext {
  margin-top: 5px;
  font-size: 12px;
  color: #999;
}

/* 银行卡样式 */
.bank-card {
  display: flex;
  align-items: center;
  padding: 10px 0;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* 选中的银行卡样式 */
.bank-card.active {
  padding-left: 10px;
  background-color: #f5f7fa;
  border-left: 4px solid #ffc107;
}

.bank-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 15px;
  font-size: 24px;
  color: #fff;
  background: #1e88e5;
  border-radius: 50%;
}

.bank-info {
  font-size: 15px;
  color: #333;
}

.bank-number {
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

.amount-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.amount-input,
.password-input {
  width: 100%;
  height: 45px;
  padding: 0 15px;
  font-size: 15px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
}

.currency-label {
  position: absolute;
  right: 15px;
  font-size: 15px;
  color: #666;
}

.usdt-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.usdt-label {
  margin-right: 10px;
  font-size: 14px;
  color: #333;
}

.usdt-value {
  margin-right: 10px;
  font-size: 14px;
  color: #333;
}

.usdt-rate {
  font-size: 14px;
  color: #666;
}

.tips-section {
  display: flex;
  align-items: flex-start;
}

.tips-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 10px;
  font-size: 12px;
  color: #fff;
  background: #ffc107;
  border-radius: 50%;
}

.tips-text {
  flex: 1;
  font-size: 13px;
  color: #666;
}

.contact-link {
  color: #2a5298;
}

.confirm-btn {
  width: 100%;
  height: 45px;
  margin-top: 30px;
  font-size: 16px;
  color: #fff;
  background: #ffc107;
  border: none;
  border-radius: 8px;
}
</style>
