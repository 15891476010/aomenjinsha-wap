<template>
  <view class="login-container">
    <!-- 使用渐变背景代替背景图，与注册页面保持一致 -->

    <!-- Logo和标题区域 -->
    <view class="header">
      <image :src="indexData.imagePrefix + indexData.logo" class="logo" mode="aspectFit" />
      <text class="title">{{ indexData.title }}</text>
      <text v-if="indexData.titles" class="subtitle">{{ indexData.titles }}</text>
    </view>

    <!-- 登录表单区域 -->
    <view class="login-card">
      <view class="form-wrap">
        <wd-form ref="loginFormRef" :model="loginFormData">
          <!-- 用户名输入框 -->
          <view class="form-item">
            <wd-icon name="user" size="22" color="#165DFF" class="input-icon" />
            <input v-model="loginFormData.username" class="form-input" placeholder="请输入用户名" />
            <wd-icon
              v-if="loginFormData.username"
              name="close-fill"
              size="18"
              color="#9ca3af"
              class="clear-icon"
              @click="loginFormData.username = ''"
            />
          </view>
          <view class="divider"></view>

          <!-- 密码输入框 -->
          <view class="form-item">
            <wd-icon name="lock-on" size="22" color="#165DFF" class="input-icon" />
            <input
              v-model="loginFormData.password"
              class="form-input"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              placeholder-style="color: #9ca3af; font-weight: normal;"
            />
            <wd-icon
              :name="showPassword ? 'eye-open' : 'eye-close'"
              size="18"
              color="#9ca3af"
              class="eye-icon"
              @click="showPassword = !showPassword"
            />
          </view>
          <view class="divider"></view>

          <!-- 登录按钮 -->
          <button
            class="login-btn"
            :disabled="loading"
            :style="loading ? 'opacity: 0.7;' : ''"
            @click="openNameDialog"
          >
            登录
          </button>
        </wd-form>
        <!-- 底部协议 -->
        <view class="agreement">
          <text class="text">登录即同意</text>
          <text class="link" @click="navigateToUserAgreement">《用户协议》</text>
          <text class="text">和</text>
          <text class="link" @click="navigateToPrivacy">《隐私政策》</text>
        </view>

        <!-- 注册链接 -->
        <view class="register-link">
          <text class="text">没有账号？</text>
          <text class="link" @click="goToRegister">立即注册</text>
        </view>
      </view>
    </view>

    <wd-message-box selector="wd-message-box-slot">
      <wd-input v-model="loginFormData.realName" type="text" placeholder="请输入真实姓名" />
      <wd-input v-model="loginFormData.captchaCode" type="text" placeholder="请输入验证码">
        <template #suffix>
          <wd-img :width="100" :height="50" :src="joy" @click="getCaptcha" />
        </template>
      </wd-input>
    </wd-message-box>

    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app";
import AuthAPI, { type LoginFormData } from "@/api/auth";
import { useUserStore } from "@/store/modules/user";
import { useToast, useMessage } from "wot-design-uni";
import { ref } from "vue";

import { getIndexData } from "@/utils/auth";
const indexData = ref(getIndexData());

const loginFormRef = ref();
const toast = useToast();
const message = useMessage("wd-message-box-slot");
const loading = ref(false);
const userStore = useUserStore();
const showPassword = ref(false);
const joy = ref("https://picsum.photos/200/300");

// 登录表单数据
const loginFormData = ref<LoginFormData>({
  username: "",
  password: "",
});

// 获取重定向参数
const redirect = ref("");
onLoad((options) => {
  if (options) {
    redirect.value = options.redirect ? decodeURIComponent(options.redirect) : "/pages/index/index";
  } else {
    redirect.value = "/pages/index/index";
  }
});

const openNameDialog = async () => {
  await getCaptcha();
  message
    .confirm({
      title: "真实姓名验证",
    })
    .then(() => {
      handleLogin();
    });
};

/**
 * 获取验证码
 */
const getCaptcha = async () => {
  // 发送验证码请求
  const res = await AuthAPI.getCaptcha();
  joy.value = res.captchaBase64;
  loginFormData.value.captchaKey = res.captchaKey;
};

// 登录处理
const handleLogin = () => {
  if (loading.value) return;
  loading.value = true;

  userStore
    .login(loginFormData.value)
    .then(() => userStore.getInfo())
    .then(() => {
      toast.success("登录成功");

      // 检查用户信息是否完整
      setTimeout(() => {
        uni.reLaunch({
          url: redirect.value,
        });
      }, 1000);
    })
    .catch((error) => {
      toast.error(error?.message || "登录失败");
    })
    .finally(() => {
      loading.value = false;
    });
};

// 跳转到用户协议页面
const navigateToUserAgreement = () => {
  uni.navigateTo({
    url: "/pages/mine/user-agreement/index",
  });
};

// 跳转到隐私政策页面
const navigateToPrivacy = () => {
  uni.navigateTo({
    url: "/pages/mine/privacy/index",
  });
};

// 跳转到注册页面
const goToRegister = () => {
  uni.navigateTo({
    url: "/pages/register/index",
  });
};
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
}

.login-bg {
  display: none; /* 隐藏原背景图 */
}

.header {
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50rpx;
}

.logo {
  width: 140px;
  height: 140px;
  margin-bottom: 5px;
}

.title {
  margin-bottom: 10rpx;
  font-size: 48rpx;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 28rpx;
  color: #ffffff;
  text-align: center;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.login-card {
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-top: 80rpx;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.1);
}

.form-wrap {
  padding: 40rpx;
}

.form-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 24rpx 0;
}

.input-icon {
  margin-right: 20rpx;
}

.form-input {
  flex: 1;
  height: 60rpx;
  font-size: 28rpx;
  line-height: 60rpx;
  color: #333;
}

.clear-icon,
.eye-icon {
  padding: 10rpx;
}

.divider {
  height: 1px;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.06);
}

.login-btn {
  width: 100%;
  height: 90rpx;
  margin-top: 60rpx;
  font-size: 32rpx;
  line-height: 90rpx;
  color: #fff;
  background: linear-gradient(90deg, #165dff, #4080ff);
  border: none;
  border-radius: 45rpx;
  box-shadow: 0 8rpx 20rpx rgba(22, 93, 255, 0.3);
  transition: all 0.3s;
}

.login-btn:active {
  box-shadow: 0 4rpx 10rpx rgba(22, 93, 255, 0.2);
  transform: translateY(2rpx);
}

.other-login {
  margin-top: 60rpx;
}

.other-login-title {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.line {
  flex: 1;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.08);
}

.text {
  padding: 0 30rpx;
  font-size: 26rpx;
  color: #9ca3af;
}

.wechat-login {
  display: flex;
  justify-content: center;
  margin-bottom: 30rpx;
}
.wechat-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90rpx;
  height: 90rpx;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.wechat-icon {
  width: 60rpx;
  height: 60rpx;
}

.agreement {
  display: flex;
  justify-content: center;
  margin-top: 30rpx;
  font-size: 24rpx;
}

.agreement .text {
  padding: 0 4rpx;
  color: #9ca3af;
}

.agreement .link {
  color: #165dff;
}

.register-link {
  display: flex;
  justify-content: center;
  margin-top: 20rpx;
  font-size: 24rpx;
}

.register-link .text {
  padding: 0 4rpx;
  color: #9ca3af;
}

.register-link .link {
  color: #165dff;
}
</style>
