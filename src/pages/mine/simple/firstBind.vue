<template>
  <view class="bind-account-container">
    <!-- <view class="header">
      <image class="logo" src="/static/images/logo.png" mode="aspectFit"></image>
      <text class="title">绑定出款账号</text>
    </view> -->

    <view class="notice-box">
      <text class="notice-text">为了保障资金安全，交易前请确定您的出款资讯！</text>
    </view>

    <view class="form-container">
      <view class="form-item">
        <text class="label">真实姓名</text>
        <input v-model="formData.realName" class="input" placeholder="请输入真实姓名" />
      </view>

      <view class="form-item">
        <text class="label">取款密码</text>
        <input
          v-model="formData.withdrawPassword"
          class="input"
          type="password"
          password
          placeholder="• • • •"
        />
      </view>

      <view class="form-item">
        <text class="label">出款账号</text>
        <view class="payment-methods">
          <view
            class="payment-method"
            :class="{ active: formData.paymentType === 'bankCard' }"
            @click="selectPaymentMethod('bankCard')"
          >
            <text>银行卡</text>
          </view>
          <view
            class="payment-method"
            :class="{ active: formData.paymentType === 'wallet' }"
            @click="selectPaymentMethod('wallet')"
          >
            <text>钱包</text>
          </view>
          <view
            class="payment-method"
            :class="{ active: formData.paymentType === 'crypto' }"
            @click="selectPaymentMethod('crypto')"
          >
            <text>加密货币</text>
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="label">请选择</text>
        <picker class="picker" :range="bankOptions" @change="onBankChange">
          <view class="picker-value">{{ selectedBank || "请选择" }}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">支行</text>
        <input v-model="formData.branchBank" class="input" placeholder="请输入支行名称" />
      </view>

      <view class="form-item">
        <text class="label">省</text>
        <input v-model="formData.province" class="input" placeholder="请输入省份" />
      </view>

      <view class="form-item">
        <text class="label">县/市</text>
        <input v-model="formData.city" class="input" placeholder="请输入县/市" />
      </view>

      <view class="form-item">
        <text class="label">银行账号</text>
        <input v-model="formData.bankAccount" class="input" placeholder="请输入银行账号" />
      </view>

      <view class="button-group">
        <button class="btn reset-btn" @click="resetForm">重设</button>
        <button class="btn confirm-btn" @click="submitForm">确定</button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";

// 表单数据
const formData = reactive({
  realName: "",
  withdrawPassword: "",
  paymentType: "bankCard", // 默认选择银行卡
  bankId: "",
  branchBank: "",
  province: "",
  city: "",
  bankAccount: "",
});

// 银行选项
const bankOptions = ref(["工商银行", "建设银行", "农业银行", "中国银行", "交通银行", "招商银行"]);
const selectedBank = ref("");

// 选择支付方式
function selectPaymentMethod(type: string) {
  formData.paymentType = type;
}

// 银行选择变化
function onBankChange(e: any) {
  const index = e.detail.value;
  selectedBank.value = bankOptions.value[index];
  formData.bankId = index.toString();
}

// 重置表单
function resetForm() {
  Object.assign(formData, {
    realName: "",
    withdrawPassword: "",
    paymentType: "bankCard",
    bankId: "",
    branchBank: "",
    province: "",
    city: "",
    bankAccount: "",
  });
  selectedBank.value = "";
}

// 提交表单
function submitForm() {
  // 表单验证
  if (!formData.realName) {
    uni.showToast({
      title: "请输入真实姓名",
      icon: "none",
    });
    return;
  }

  if (!formData.withdrawPassword) {
    uni.showToast({
      title: "请输入取款密码",
      icon: "none",
    });
    return;
  }

  if (!selectedBank.value) {
    uni.showToast({
      title: "请选择银行",
      icon: "none",
    });
    return;
  }

  if (!formData.bankAccount) {
    uni.showToast({
      title: "请输入银行账号",
      icon: "none",
    });
    return;
  }

  // TODO: 调用API绑定账号
  console.log("提交表单数据", formData);
  uni.showLoading({ title: "提交中..." });

  // 模拟API调用
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({
      title: "绑定成功",
      icon: "success",
    });
    // 绑定成功后返回上一页
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }, 2000);
}

onLoad(() => {});
</script>
<style lang="scss" scoped>
.bind-account-container {
  padding: 20rpx;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    margin-top: 10rpx;
    font-size: 32rpx;
    font-weight: bold;
  }
}

.notice-box {
  padding: 20rpx;
  margin: 20rpx 0;
  background-color: #fff5f5;
  border-radius: 8rpx;

  .notice-text {
    font-size: 26rpx;
    color: #ff6b6b;
  }
}

.form-container {
  padding: 20rpx;
  background-color: #ffffff;
  border-radius: 12rpx;

  .form-item {
    margin-bottom: 24rpx;

    .label {
      display: block;
      margin-bottom: 10rpx;
      font-size: 28rpx;
      color: #333;
    }

    .input {
      box-sizing: border-box;
      width: 100%;
      height: 80rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      border: 1px solid #e0e0e0;
      border-radius: 8rpx;
    }

    .picker {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      width: 100%;
      height: 80rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      border: 1px solid #e0e0e0;
      border-radius: 8rpx;

      .picker-value {
        color: #333;
      }
    }
  }

  .payment-methods {
    display: flex;
    margin-bottom: 10rpx;

    .payment-method {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      height: 80rpx;
      margin-right: 10rpx;
      font-size: 28rpx;
      border: 1px solid #e0e0e0;
      border-radius: 8rpx;

      &:last-child {
        margin-right: 0;
      }

      &.active {
        color: #ffffff;
        background-color: #007aff;
        border-color: #007aff;
      }
    }
  }
  .button-group {
    display: flex;
    margin-top: 40rpx;

    .btn {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      height: 80rpx;
      font-size: 28rpx;
      border-radius: 8rpx;
    }

    .reset-btn {
      margin-right: 20rpx;
      color: #666;
      background-color: #f2f2f2;
    }

    .confirm-btn {
      color: #ffffff;
      background-color: #007aff;
    }
  }
}
</style>
