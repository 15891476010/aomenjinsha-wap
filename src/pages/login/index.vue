<template>
  <view class="login-container">
    <!-- Logo和标题区域 -->
    <view class="header">
      <image :src="indexData.imagePrefix + indexData.logo" class="logo" mode="aspectFit" />
      <text class="website">{{ indexData.title }}</text>
    </view>

    <!-- 登录表单区域 -->
    <view class="login-card">
      <view class="tab-header">
        <view class="tab-item" :class="{ active: !showRegister }" @click="showRegister = false">
          会员登入
        </view>
        <view class="tab-item" :class="{ active: showRegister }" @click="showRegister = true">
          注册账号
        </view>
      </view>
      <!-- 登录表单 -->
      <view v-if="!showRegister" class="form-wrap">
        <wd-form ref="loginFormRef" :model="loginFormData">
          <!-- 用户名输入框 -->
          <view class="form-item">
            <view class="input-icon-wrapper">
              <wd-icon name="user" size="22" color="#666" class="input-icon" />
            </view>
            <input
              v-model="loginFormData.username"
              class="form-input"
              placeholder="账号"
              placeholder-style="color: #999;"
            />
            <view
              v-if="loginFormData.username"
              class="eye-icon-wrapper"
              @click="loginFormData.username = ''"
            >
              <wd-icon name="close-fill" size="18" color="#999" />
            </view>
          </view>

          <!-- 密码输入框 -->
          <view class="form-item">
            <view class="input-icon-wrapper">
              <wd-icon name="lock-on" size="22" color="#666" class="input-icon" />
            </view>
            <input
              v-model="loginFormData.password"
              class="form-input"
              :type="showPassword ? 'text' : 'password'"
              placeholder="密码"
              placeholder-style="color: #999;"
            />
            <view class="eye-icon-wrapper" @click="showPassword = !showPassword">
              <wd-icon :name="showPassword ? 'eye-open' : 'eye-close'" size="18" color="#999" />
            </view>
          </view>

          <!-- 记住账号 & 忘记密码 -->
          <view class="account-options">
            <view class="remember-account">
              <checkbox
                :checked="rememberAccount"
                color="#2979ff"
                style="transform: scale(0.7)"
                @click="rememberAccount = !rememberAccount"
              />
              <text>储存账号</text>
            </view>
            <text class="forgot-password" @click="handleForgotPassword">忘记密码?</text>
          </view>

          <!-- 登录按钮 -->
          <button
            class="login-btn"
            :disabled="loading"
            :style="loading ? 'opacity: 0.7;' : ''"
            @click="openNameDialog"
          >
            登入
          </button>
        </wd-form>

        <!-- 底部下载区域 -->
        <view class="download-area">
          <view class="download-btn" @click="downloadApp">
            <text>原生app下载</text>
          </view>
          <!-- <view class="download-btn" @click="openBrowser">
            <text>赛手浏览器</text>
          </view> -->
        </view>
      </view>

      <!-- 注册表单 -->
      <view v-else class="form-wrap">
        <register-form
          @register-success="handleRegisterSuccess"
          @switch-to-login="showRegister = false"
        />
      </view>
    </view>

    <!-- 底部链接 -->
    <view class="bottom-links">
      <view class="link-item" @click="justBrowse">
        <wd-icon name="link" size="18" color="#fff" />
        <text>随便逛逛</text>
      </view>
      <!-- <view class="link-item" @click="goToDesktop">
        <wd-icon name="computer" size="18" color="#fff" />
        <text>去电脑版</text>
      </view> -->
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

    <view class="h-80px"></view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app";
import AuthAPI, { type LoginFormData } from "@/api/auth";
import { useUserStore } from "@/store/modules/user";
import { useToast, useMessage } from "wot-design-uni";
import { ref } from "vue";
import RegisterForm from "@/components/RegisterForm.vue";

import { getIndexData } from "@/utils/auth";
const indexData = ref(getIndexData());

const loginFormRef = ref();
const toast = useToast();
const message = useMessage("wd-message-box-slot");
const loading = ref(false);
const userStore = useUserStore();
const showPassword = ref(false);
const joy = ref("https://picsum.photos/200/300");
const rememberAccount = ref(false);
const showRegister = ref(false); // 控制显示登录还是注册表单

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

// 处理忘记密码
const handleForgotPassword = () => {
  // 实现忘记密码功能
  uni.navigateTo({
    url: "/pages/mine/forgot-password/index",
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
// const openBrowser = () => {
//   // 实现打开浏览器功能
//   uni.showToast({
//     title: "正在打开赛手浏览器",
//     icon: "none",
//   });
// };

// 随便逛逛
const justBrowse = () => {
  uni.navigateTo({
    url: "/pages/index/index",
  });
};

// 去电脑版
// const goToDesktop = () => {
//   uni.showToast({
//     title: "正在前往电脑版",
//     icon: "none",
//   });
// };

// 处理注册成功
const handleRegisterSuccess = () => {
  toast.success("注册成功，请登录");
};
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
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
}

.website {
  font-size: 32rpx;
  font-weight: bold;
  color: #0052d9;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
}

.login-card {
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-top: 40rpx;
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

.account-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.remember-account {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #666;
}

.forgot-password {
  font-size: 24rpx;
  color: #0052d9;
}

.login-btn {
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

.login-btn:active {
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
  justify-content: space-around;
  width: 100%;
  height: 100rpx;
  margin-top: 20rpx;
  background-color: #666;
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
