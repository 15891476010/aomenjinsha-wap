<template>
  <view class="register-container">
    <view class="register-header">
      <image class="logo" :src="indexData.imagePrefix + indexData.logo" mode="aspectFit"></image>
      <!-- <text class="title">用户注册</text> -->
    </view>

    <view class="register-form">
      <wd-form ref="formRef" :model="formData">
        <!-- 用户名输入框 -->
        <view class="form-item required">
          <wd-icon name="user" size="22" color="#165DFF" class="input-icon" />
          <input v-model="formData.username" class="form-input" placeholder="请输入用户名" />
          <wd-icon
            v-if="formData.username"
            name="close-fill"
            size="18"
            color="#9ca3af"
            class="clear-icon"
            @click="formData.username = ''"
          />
        </view>
        <view class="divider"></view>

        <!-- 密码输入框 -->
        <view class="form-item required">
          <wd-icon name="lock-on" size="22" color="#165DFF" class="input-icon" />
          <input
            v-model="formData.password"
            class="form-input"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
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

        <!-- 确认密码输入框 -->
        <view class="form-item required">
          <wd-icon name="lock-on" size="22" color="#165DFF" class="input-icon" />
          <input
            v-model="formData.confirmPassword"
            class="form-input"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="请再次输入密码"
          />
          <wd-icon
            :name="showConfirmPassword ? 'eye-open' : 'eye-close'"
            size="18"
            color="#9ca3af"
            class="eye-icon"
            @click="showConfirmPassword = !showConfirmPassword"
          />
        </view>
        <view class="divider"></view>

        <!-- 昵称输入框 -->
        <view class="form-item">
          <wd-icon name="account-circle" size="22" color="#165DFF" class="input-icon" />
          <input v-model="formData.nickName" class="form-input" placeholder="请输入昵称（选填）" />
          <wd-icon
            v-if="formData.nickName"
            name="close-fill"
            size="18"
            color="#9ca3af"
            class="clear-icon"
            @click="formData.nickName = ''"
          />
        </view>
        <view class="divider"></view>

        <!-- 真实姓名输入框 -->
        <view class="form-item required">
          <wd-icon name="account-box" size="22" color="#165DFF" class="input-icon" />
          <input v-model="formData.realName" class="form-input" placeholder="请输入真实姓名" />
          <wd-icon
            v-if="formData.realName"
            name="close-fill"
            size="18"
            color="#9ca3af"
            class="clear-icon"
            @click="formData.realName = ''"
          />
        </view>
        <view class="divider"></view>

        <!-- 手机号输入框 -->
        <view class="form-item required">
          <wd-icon name="phone" size="22" color="#165DFF" class="input-icon" />
          <input
            v-model="formData.phone"
            class="form-input"
            type="number"
            placeholder="请输入手机号"
          />
          <wd-icon
            v-if="formData.phone"
            name="close-fill"
            size="18"
            color="#9ca3af"
            class="clear-icon"
            @click="formData.phone = ''"
          />
        </view>
        <view class="divider"></view>

        <!-- 邮箱输入框 -->
        <view class="form-item">
          <wd-icon name="email" size="22" color="#165DFF" class="input-icon" />
          <input v-model="formData.email" class="form-input" placeholder="请输入邮箱（选填）" />
          <wd-icon
            v-if="formData.email"
            name="close-fill"
            size="18"
            color="#9ca3af"
            class="clear-icon"
            @click="formData.email = ''"
          />
        </view>
        <view class="divider"></view>

        <!-- 验证码输入框 -->
        <view class="form-item required">
          <wd-icon name="shield-check" size="22" color="#165DFF" class="input-icon" />
          <input v-model="formData.captchaCode" class="form-input" placeholder="请输入图片验证码" />
          <image
            class="verify-code-img"
            :src="captchaUrl"
            mode="aspectFit"
            @click="refreshCaptcha"
          />
        </view>
        <view class="divider"></view>

        <!-- 注册按钮 -->
        <button
          class="register-btn"
          :disabled="loading"
          :style="loading ? 'opacity: 0.7;' : ''"
          @click="submitForm"
        >
          注册
        </button>
      </wd-form>

      <!-- 底部链接 -->
      <view class="login-link">
        <text class="text">已有账号？</text>
        <text class="link" @click="goToLogin">立即登录</text>
      </view>
    </view>

    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useToast } from "wot-design-uni";
import AuthAPI from "@/api/auth";

import { getIndexData } from "@/utils/auth";
const indexData = ref(getIndexData());

// 表单数据
const formData = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  nickName: "",
  realName: "",
  phone: "",
  email: "",
  captchaCode: "",
  captchaKey: "",
});

const formRef = ref();
const loading = ref(false);
const toast = useToast();
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const captchaUrl = ref("/api/captcha");

// 刷新验证码
const refreshCaptcha = async () => {
  // 发送验证码请求
  const res = await AuthAPI.getCaptcha();
  captchaUrl.value = res.captchaBase64;
  formData.captchaKey = res.captchaKey;
};

// 表单验证
const validateForm = () => {
  // 用户名验证
  if (!formData.username) {
    toast.error("请输入用户名");
    return false;
  }
  if (formData.username.length > 255) {
    toast.error("用户名长度不能超过255个字符");
    return false;
  }

  // 密码验证
  if (!formData.password) {
    toast.error("请输入密码");
    return false;
  }
  if (formData.password.length > 255) {
    toast.error("密码长度不能超过255个字符");
    return false;
  }

  // 确认密码验证
  if (formData.password !== formData.confirmPassword) {
    toast.error("两次输入的密码不一致");
    return false;
  }

  // 昵称验证
  if (formData.nickName && formData.nickName.length > 255) {
    toast.error("昵称长度不能超过255个字符");
    return false;
  }

  // 真实姓名验证
  if (!formData.realName) {
    toast.error("请输入真实姓名");
    return false;
  }
  if (formData.realName.length > 255) {
    toast.error("真实姓名长度不能超过255个字符");
    return false;
  }

  // 手机号验证
  if (!formData.phone) {
    toast.error("请输入手机号");
    return false;
  }
  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    toast.error("请输入正确的手机号");
    return false;
  }

  // 邮箱验证
  if (formData.email && !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(formData.email)) {
    toast.error("请输入正确的邮箱格式");
    return false;
  }

  // 验证码验证
  if (!formData.captchaCode) {
    toast.error("请输入图片验证码");
    return false;
  }
  return true;
};

// 提交表单
const submitForm = () => {
  if (loading.value) return;

  if (!validateForm()) return;

  loading.value = true;

  // 移除确认密码字段，准备提交数据
  const submitData = { ...formData };
  delete submitData.confirmPassword;

  AuthAPI.register(submitData)
    .then(() => {
      toast.success("注册成功");
      setTimeout(() => {
        uni.navigateTo({
          url: "/pages/login/index",
        });
      }, 1000);
    })
    .catch((error) => {
      toast.error(error?.message || "注册失败");
    })
    .finally(() => {
      loading.value = false;
    });
};

// 跳转到登录页
const goToLogin = () => {
  uni.navigateTo({
    url: "/pages/login/index",
  });
};

onShow(() => {
  // 页面加载时的逻辑
  refreshCaptcha();
});
</script>

<style lang="scss" scoped>
.register-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 130vh;
  padding: 0 30rpx;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
}

.register-header {
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50rpx;
  margin-bottom: 60rpx;

  .logo {
    width: 140px;
    height: 140px;
    margin-bottom: 20rpx;
  }

  .title {
    font-size: 48rpx;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
  }
}

.register-form {
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: 90%;
  padding: 40rpx;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.1);
}

.register-btn {
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

.register-btn:active {
  box-shadow: 0 4rpx 10rpx rgba(22, 93, 255, 0.2);
  transform: translateY(2rpx);
}

.login-link {
  display: flex;
  justify-content: center;
  margin-top: 30rpx;
  font-size: 28rpx;

  .text {
    padding: 0 4rpx;
    color: #9ca3af;
  }

  .link {
    color: #165dff;
  }
}

.verify-code-btn {
  height: 60rpx;
  padding: 0 20rpx;
  font-size: 24rpx;
  line-height: 60rpx;
  color: #165dff;
  white-space: nowrap;
  background: rgba(22, 93, 255, 0.1);
  border: none;
  border-radius: 30rpx;
}

.verify-code-btn:disabled {
  color: #9ca3af;
  background: rgba(156, 163, 175, 0.1);
}

.form-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 24rpx 0;

  &.required::before {
    position: absolute;
    left: -16rpx;
    color: #ff4d4f;
    content: "*";
  }
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

.verify-code-img {
  width: 100px;
  height: 60px;
  cursor: pointer;
  border-radius: 8rpx;
}
</style>
