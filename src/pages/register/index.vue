<template>
  <view class="register-container">
    <!-- Logo和标题区域 -->
    <view class="header">
      <image :src="indexData.imagePrefix + indexData.logo" class="logo" mode="aspectFit" />
      <text class="website">{{ indexData.title }}</text>
    </view>

    <!-- 注册表单区域 -->
    <view class="register-card">
      <view class="tab-header">
        <view class="tab-item" @click="goToLogin">会员登入</view>
        <view class="tab-item active">注册账号</view>
      </view>
      <view class="form-wrap">
        <wd-form ref="formRef" :model="formData">
          <!-- 用户名输入框 -->
          <view class="form-item">
            <view class="input-icon-wrapper">
              <wd-icon name="user" size="22" color="#666" class="input-icon" />
            </view>
            <input
              v-model="formData.username"
              class="form-input"
              placeholder="账号"
              placeholder-style="color: #999;"
            />
            <view v-if="formData.username" class="eye-icon-wrapper" @click="formData.username = ''">
              <wd-icon name="close-fill" size="18" color="#999" />
            </view>
          </view>

          <!-- 密码输入框 -->
          <view class="form-item">
            <view class="input-icon-wrapper">
              <wd-icon name="lock-on" size="22" color="#666" class="input-icon" />
            </view>
            <input
              v-model="formData.password"
              class="form-input"
              :type="showPassword ? 'text' : 'password'"
              placeholder="密码"
              placeholder-style="color: #999;"
            />
            <view class="eye-icon-wrapper" @click="showPassword = !showPassword">
              <wd-icon :name="showPassword ? 'eye-open' : 'eye-close'" size="18" color="#999" />
            </view>
          </view>

          <!-- 确认密码输入框 -->
          <view class="form-item">
            <view class="input-icon-wrapper">
              <wd-icon name="lock-on" size="22" color="#666" class="input-icon" />
            </view>
            <input
              v-model="formData.confirmPassword"
              class="form-input"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="确认密码"
              placeholder-style="color: #999;"
            />
            <view class="eye-icon-wrapper" @click="showConfirmPassword = !showConfirmPassword">
              <wd-icon
                :name="showConfirmPassword ? 'eye-open' : 'eye-close'"
                size="18"
                color="#999"
              />
            </view>
          </view>

          <!-- 昵称输入框 -->
          <view class="form-item">
            <view class="input-icon-wrapper">
              <wd-icon name="account-circle" size="22" color="#666" class="input-icon" />
            </view>
            <input
              v-model="formData.nickName"
              class="form-input"
              placeholder="昵称（选填）"
              placeholder-style="color: #999;"
            />
            <view v-if="formData.nickName" class="eye-icon-wrapper" @click="formData.nickName = ''">
              <wd-icon name="close-fill" size="18" color="#999" />
            </view>
          </view>

          <!-- 真实姓名输入框 -->
          <view class="form-item">
            <view class="input-icon-wrapper">
              <wd-icon name="account-box" size="22" color="#666" class="input-icon" />
            </view>
            <input
              v-model="formData.realName"
              class="form-input"
              placeholder="真实姓名"
              placeholder-style="color: #999;"
            />
            <view v-if="formData.realName" class="eye-icon-wrapper" @click="formData.realName = ''">
              <wd-icon name="close-fill" size="18" color="#999" />
            </view>
          </view>

          <!-- 手机号输入框 -->
          <view class="form-item">
            <view class="input-icon-wrapper">
              <wd-icon name="phone" size="22" color="#666" class="input-icon" />
            </view>
            <input
              v-model="formData.phone"
              class="form-input"
              type="number"
              placeholder="手机号"
              placeholder-style="color: #999;"
            />
            <view v-if="formData.phone" class="eye-icon-wrapper" @click="formData.phone = ''">
              <wd-icon name="close-fill" size="18" color="#999" />
            </view>
          </view>

          <!-- 邮箱输入框 -->
          <view class="form-item">
            <view class="input-icon-wrapper">
              <wd-icon name="email" size="22" color="#666" class="input-icon" />
            </view>
            <input
              v-model="formData.email"
              class="form-input"
              placeholder="邮箱（选填）"
              placeholder-style="color: #999;"
            />
            <view v-if="formData.email" class="eye-icon-wrapper" @click="formData.email = ''">
              <wd-icon name="close-fill" size="18" color="#999" />
            </view>
          </view>

          <!-- 验证码输入框 -->
          <view class="form-item">
            <view class="input-icon-wrapper">
              <wd-icon name="shield-check" size="22" color="#666" class="input-icon" />
            </view>
            <input
              v-model="formData.captchaCode"
              class="form-input"
              placeholder="图片验证码"
              placeholder-style="color: #999;"
            />
            <image
              class="verify-code-img"
              :src="captchaUrl"
              mode="aspectFit"
              @click="refreshCaptcha"
            />
          </view>

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

        <!-- 底部下载区域 -->
        <view class="download-area">
          <view class="download-btn" @click="downloadApp">
            <text>原生app下载</text>
          </view>
          <view class="download-btn" @click="openBrowser">
            <text>赛手浏览器</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部链接 -->
    <view class="bottom-links">
      <view class="link-item" @click="justBrowse">
        <wd-icon name="link" size="18" color="#fff" />
        <text>随便逛逛</text>
      </view>
      <view class="link-item" @click="goToDesktop">
        <wd-icon name="computer" size="18" color="#fff" />
        <text>去电脑版</text>
      </view>
    </view>

    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, onShow } from "vue";
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

// 下载APP
const downloadApp = () => {
  // 实现APP下载功能
  uni.showToast({
    title: "正在前往下载页面",
    icon: "none",
  });
};

// 打开赛手浏览器
const openBrowser = () => {
  // 实现打开浏览器功能
  uni.showToast({
    title: "正在打开赛手浏览器",
    icon: "none",
  });
};

// 随便逛逛
const justBrowse = () => {
  uni.navigateTo({
    url: "/pages/index/index",
  });
};

// 去电脑版
const goToDesktop = () => {
  uni.showToast({
    title: "正在前往电脑版",
    icon: "none",
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
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa, #e4e7eb);
}

.header {
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50rpx;
}

.logo {
  width: 120px;
  height: 120px;
  margin-bottom: 5px;
}

.website {
  font-size: 32rpx;
  font-weight: bold;
  color: #0052d9;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
}

.register-card {
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-top: 40rpx;
  margin-bottom: 120rpx;
  overflow: hidden;
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.tab-header {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #eee;
}

.tab-item {
  flex: 1;
  padding: 30rpx 0;
  font-size: 32rpx;
  color: #666;
  text-align: center;
}

.tab-item.active {
  color: #0052d9;
  border-bottom: 3px solid #0052d9;
}

.form-wrap {
  padding: 40rpx;
}

.form-item {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  background-color: #f5f7fa;
  border-radius: 10rpx;
}

.input-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
}

.form-input {
  flex: 1;
  height: 80rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  color: #333;
  background-color: transparent;
}

.eye-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
}

.verify-code-img {
  width: 120rpx;
  height: 80rpx;
  margin-right: 10rpx;
  cursor: pointer;
  border-radius: 8rpx;
}

.register-btn {
  width: 100%;
  height: 90rpx;
  margin-top: 20rpx;
  font-size: 32rpx;
  line-height: 90rpx;
  color: #fff;
  background: linear-gradient(90deg, #0052d9, #2979ff);
  border: none;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 10rpx rgba(41, 121, 255, 0.3);
  transition: all 0.3s;
}

.register-btn:active {
  box-shadow: 0 2rpx 5rpx rgba(41, 121, 255, 0.2);
  transform: translateY(2rpx);
}

.download-area {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
}

.download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48%;
  height: 80rpx;
  font-size: 28rpx;
  color: #666;
  background-color: #f5f7fa;
  border-radius: 10rpx;
}

.bottom-links {
  position: absolute;
  bottom: 40rpx;
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.link-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
}

.link-item text {
  margin-left: 10rpx;
  font-size: 28rpx;
  color: #fff;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}
</style>
