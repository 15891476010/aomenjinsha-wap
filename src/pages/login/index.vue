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
        <!-- 指纹登录按钮，仅当支持指纹且已启用指纹登录时显示 -->
        <view v-if="isSoterSupported && isSoterEnabled" class="finger-login-area">
          <view class="finger-login-btn" @click="showFingerLoginPopup = true">
            <wd-icon name="fingerprint" size="36" color="#2979ff" />
            <text>指纹登录</text>
          </view>
        </view>

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
          <view style="width: 100px; height: 50px" @click="getCaptcha">
            <image v-if="joy" :src="joy" style="width: 100px; height: 50px" mode="aspectFit" />
            <text v-else style="font-size: 12px; color: #999">点击加载验证码</text>
          </view>
        </template>
      </wd-input>
    </wd-message-box>
    <!-- 指纹登录确认框 -->
    <wd-message-box selector="soter-confirm-box"></wd-message-box>
    <wd-toast />

    <!-- 自定义指纹登录弹窗 -->
    <finger-login-popup
      :visible="showFingerLoginPopup"
      :logo="indexData.imagePrefix + indexData.logo"
      :title="indexData.title"
      @cancel="handleCancelFingerLogin"
      @verify="handleFingerVerify"
    />

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
import FingerLoginPopup from "@/components/FingerLoginPopup.vue";

import { getIndexData } from "@/utils/auth";
const indexData = ref(getIndexData());

const loginFormRef = ref();
const toast = useToast();
const message = useMessage("wd-message-box-slot");
const soterMessage = useMessage("soter-confirm-box");
const loading = ref(false);
const userStore = useUserStore();
const showPassword = ref(false);
const joy = ref("https://picsum.photos/200/300");
const rememberAccount = ref(false);
const showRegister = ref(false); // 控制显示登录还是注册表单
const showFingerLoginPopup = ref(false); // 控制显示指纹登录弹窗

// 指纹登录相关状态
const isSoterSupported = ref(false); // 是否支持指纹登录
const isSoterEnabled = ref(false); // 是否已启用指纹登录

// 登录表单数据
const loginFormData = ref<
  LoginFormData & {
    realName?: string;
    captchaCode?: string;
    captchaKey?: string;
  }
>({
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

  // 检查是否支持和启用指纹登录
  checkSoterSupport();
});

// 检查是否支持指纹识别
const checkSoterSupport = () => {
  // #ifdef APP-PLUS
  uni.checkIsSupportSoterAuthentication({
    success(res) {
      if (res.supportMode && res.supportMode.includes("fingerPrint")) {
        isSoterSupported.value = true;
        // 检查是否已启用指纹登录
        checkSoterEnabled();
      }
    },
  });
  // #endif
};

// 检查是否已启用指纹登录
const checkSoterEnabled = () => {
  try {
    const soterLoginData = uni.getStorageSync("soterLoginData");
    if (soterLoginData) {
      isSoterEnabled.value = true;
      // 预填充用户名（如果存储了的话）
      const userData = JSON.parse(soterLoginData);
      if (userData.username) {
        loginFormData.value.username = userData.username;
      }

      // 如果已经启用了指纹登录，自动显示指纹登录弹窗
      showFingerLoginPopup.value = true;
    }
  } catch (e) {
    console.error("获取指纹登录状态失败", e);
  }
};

// 处理取消指纹登录
const handleCancelFingerLogin = () => {
  showFingerLoginPopup.value = false;
};

// 处理指纹验证结果
const handleFingerVerify = (result: { success: boolean; error?: any }) => {
  showFingerLoginPopup.value = false;

  if (result.success) {
    // 指纹验证成功，尝试自动登录
    autoLoginWithSoter();
  } else {
    console.error("指纹验证失败:", result.error);
    toast.error("指纹验证失败，请使用账号密码登录");
  }
};

// 使用指纹登录数据自动登录
const autoLoginWithSoter = () => {
  try {
    const soterLoginData = uni.getStorageSync("soterLoginData");
    if (soterLoginData) {
      const userData = JSON.parse(soterLoginData);
      loginFormData.value = {
        ...loginFormData.value,
        username: userData.username,
        password: userData.password,
      };

      // 直接登录，跳过验证码
      loading.value = true;
      userStore
        .login(loginFormData.value)
        .then(() => {
          userStore.getInfo();
          toast.success("指纹登录成功");
          setTimeout(() => {
            uni.reLaunch({
              url: redirect.value,
            });
          }, 1000);
        })
        .catch((error) => {
          toast.error(error?.message || "指纹登录失败，请使用账号密码登录");
          // 指纹登录失败，可能是服务器凭据已过期，清除存储的指纹登录数据
          uni.removeStorageSync("soterLoginData");
          isSoterEnabled.value = false;
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      toast.error("未找到指纹登录数据，请使用账号密码登录");
      isSoterEnabled.value = false;
    }
  } catch (e) {
    console.error("指纹登录失败", e);
    toast.error("指纹登录出错，请使用账号密码登录");
  }
};

const openNameDialog = async () => {
  // 先获取验证码
  await getCaptcha();

  // 打开对话框
  message
    .confirm({
      title: "真实姓名验证",
    })
    .then(() => {
      handleLogin();
    })
    .catch(() => {
      // 取消时可能需要重新获取验证码，以防过期
      getCaptcha();
    });
};

/**
 * 获取验证码
 */
const getCaptcha = async () => {
  try {
    // 发送验证码请求
    const res = await AuthAPI.getCaptcha();
    console.log("验证码返回数据:", res); // 打印返回数据查看结构

    // 确保返回的数据包含验证码图片
    if (res && res.img) {
      joy.value = res.img;
      loginFormData.value.captchaKey = res.code;
    } else {
      // 如果返回格式不符合预期，尝试通过动态访问获取值
      const data = res as any;
      if (data && (data.captchaBase64 || data.img)) {
        joy.value = data.captchaBase64 || data.img;
        loginFormData.value.captchaKey = data.captchaKey || data.code;
      } else {
        console.error("验证码返回数据格式异常:", res);
        toast.error("获取验证码失败");
      }
    }
  } catch (error) {
    console.error("获取验证码出错:", error);
    toast.error("获取验证码失败，请重试");
  }
};

// 登录处理
const handleLogin = () => {
  if (loading.value) return;
  loading.value = true;

  userStore
    .login(loginFormData.value)
    .then(async () => {
      await userStore.getInfo();
      toast.success("登录成功");

      // #ifdef APP-PLUS
      // 先不跳转，等待处理完指纹登录再跳转
      await handleSoterAuthentication();
      // #endif

      // 登录成功后跳转
      // uni.reLaunch({
      //   url: redirect.value,
      // });
      uni.navigateBack();
    })
    .catch((error) => {
      toast.error(error?.message || "登录失败");
    })
    .finally(() => {
      loading.value = false;
    });
};

/**
 * 处理生物识别
 */
const handleSoterAuthentication = async (): Promise<void> => {
  // 非APP环境直接返回
  if (typeof uni.checkIsSupportSoterAuthentication !== "function") {
    return Promise.resolve();
  }

  // 创建一个Promise来等待用户操作完成
  return new Promise<void>((resolve) => {
    // 首先查询是否支持生物识别
    uni.checkIsSupportSoterAuthentication({
      success(res) {
        if (res.supportMode && res.supportMode.includes("fingerPrint")) {
          // 检查用户手机是否已经有指纹
          uni.checkIsSoterEnrolledInDevice({
            checkAuthMode: "fingerPrint",
            success(res1) {
              if (res1.isEnrolled) {
                // 支持指纹，使用指纹登录确认框
                soterMessage
                  .confirm({
                    title: "是否开启指纹快速登陆",
                    showCancelButton: true,
                    cancelButtonText: "暂不开启",
                    confirmButtonText: "开启",
                  })
                  .then(() => {
                    // 用户确认启用指纹登录，先进行一次指纹验证
                    uni.showLoading({
                      title: "请验证您的指纹",
                    });

                    // 启动指纹验证
                    uni.startSoterAuthentication({
                      requestAuthModes: ["fingerPrint"],
                      challenge: "123456",
                      authContent: "请验证您的指纹以启用指纹登录",
                      success(_authRes) {
                        // 指纹验证成功，保存登录信息
                        uni.hideLoading();
                        const soterLoginData = {
                          username: loginFormData.value.username,
                          password: loginFormData.value.password,
                          timestamp: new Date().getTime(),
                        };
                        try {
                          uni.setStorageSync("soterLoginData", JSON.stringify(soterLoginData));
                          isSoterEnabled.value = true;
                          toast.success("指纹登录已开启");
                        } catch (e) {
                          console.error("存储指纹登录数据失败", e);
                          toast.error("开启指纹登录失败");
                        } finally {
                          resolve(); // 完成Promise
                        }
                      },
                      fail(err) {
                        uni.hideLoading();
                        console.error("指纹验证失败:", err);
                        toast.error("指纹验证失败，未启用指纹登录");
                        resolve(); // 完成Promise
                      },
                    });
                  })
                  .catch(() => {
                    // 用户取消，不做操作
                    resolve(); // 完成Promise
                  });
              } else {
                resolve(); // 设备没有录入指纹，直接完成
              }
            },
            fail() {
              resolve(); // 失败时直接完成
            },
          });
        } else {
          resolve(); // 不支持指纹时直接完成
        }
      },
      fail() {
        resolve(); // 失败时直接完成
      },
    });
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

// 随便逛逛
const justBrowse = () => {
  uni.navigateTo({
    url: "/pages/index/index",
  });
};

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

.finger-login-area {
  display: flex;
  justify-content: center;
  margin-bottom: 30rpx;
}

.finger-login-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  cursor: pointer;
  background-color: rgba(41, 121, 255, 0.05);
  border-radius: 10rpx;
}

.finger-login-btn text {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #2979ff;
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
