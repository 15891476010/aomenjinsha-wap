<template>
  <view v-if="visible" class="finger-popup-mask" @click.stop="handleCancelClick">
    <view class="finger-popup-content" @click.stop>
      <view class="finger-popup-logo">
        <image :src="logo" mode="aspectFit" class="logo-image" />
      </view>
      <view class="finger-popup-title">
        {{ title }}
      </view>
      <view class="finger-popup-subtitle">请验证指纹</view>

      <view class="finger-icon">
        <image src="/static/images/fingerprint.png" mode="aspectFit" class="fingerprint-image" />
      </view>

      <view class="finger-popup-tips">请触摸指纹传感器</view>

      <view class="finger-popup-action">
        <view class="cancel-btn" @click="handleCancelClick">
          如果需要取消指纹登录，请按手机的返回键
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, watch } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "火币",
  },
  logo: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["cancel", "verify"]);

// 处理取消点击
const handleCancelClick = () => {
  emit("cancel");
};

// 在组件挂载时，如果visible为true则自动开始指纹验证
onMounted(() => {
  if (props.visible) {
    startVerify();
  }
});

// 监听visible变化，当变为true时开始验证
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      startVerify();
    }
  }
);

// 开始指纹验证
const startVerify = () => {
  // 仅在APP环境下执行
  // #ifdef APP-PLUS
  try {
    const osName = uni.getSystemInfoSync().platform;
    if (osName === "android") {
      // Android平台尝试使用无提示模式
      uni.startSoterAuthentication({
        requestAuthModes: ["fingerPrint"],
        challenge: "123456",
        authContent: "",
        disableAlert: true, // 尝试禁用系统提示
        success(_authRes) {
          // 指纹验证成功
          emit("verify", { success: true });
        },
        fail(err) {
          console.error("指纹验证失败:", err);
          // 指纹验证失败
          emit("verify", { success: false, error: err });
        },
      });
    } else {
      // iOS平台使用标准方法并尝试最小化提示
      uni.startSoterAuthentication({
        requestAuthModes: ["fingerPrint"],
        challenge: "123456",
        authContent: "", // 设置为空
        hideAlertBeforeAuthorize: true, // 尝试隐藏授权前的提示
        success(_authRes) {
          // 指纹验证成功
          emit("verify", { success: true });
        },
        fail(err) {
          console.error("指纹验证失败:", err);
          // 指纹验证失败
          emit("verify", { success: false, error: err });
        },
      });
    }
  } catch (e) {
    console.error("启动指纹验证失败:", e);
    // 降级处理
    uni.startSoterAuthentication({
      requestAuthModes: ["fingerPrint"],
      challenge: "123456",
      authContent: "",
      success(_authRes) {
        emit("verify", { success: true });
      },
      fail(err) {
        emit("verify", { success: false, error: err });
      },
    });
  }
  // #endif
};
</script>

<style lang="scss" scoped>
.finger-popup-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

.finger-popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  padding: 60rpx 40rpx;
  background: linear-gradient(135deg, rgba(20, 30, 48, 0.85) 0%, rgba(36, 59, 85, 0.9) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30rpx;
  box-shadow: 0 25rpx 50rpx -12rpx rgba(0, 0, 0, 0.25);
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: transl ateY(50rpx);
  }
  to {
    opacity: 1;
    transform: tr anslateY(0);
  }
}

.finger-popup-logo {
  position: relative;
  margin-bottom: 30rpx;
}

.logo-image {
  width: 120rpx;
  height: 120rpx;
  filter: drop-shadow(0 10rpx 15rpx rgba(0, 0, 0, 0.2));
}

.finger-popup-title {
  margin-bottom: 15rpx;
  font-size: 42rpx;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
  letter-spacing: 2rpx;
}

.finger-popup-subtitle {
  margin-bottom: 50rpx;
  font-size: 30rpx;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 1rpx;
}

.finger-icon {
  position: relative;
  margin: 20rpx 0 50rpx;
}

.fingerprint-image {
  width: 180rpx;
  height: 180rpx;
  filter: drop-shadow(0 10rpx 20rpx rgba(41, 121, 255, 0.3));
  opacity: 0.9;
  animation: pulseGlow 2s infinite;
}

.finger-popup-tips {
  margin-bottom: 60rpx;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 1rpx;
}

.finger-popup-action {
  width: 100%;
  margin-top: 20rpx;
}

.cancel-btn {
  padding: 24rpx;
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  letter-spacing: 2rpx;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 0 30rpx 30rpx;
  transition: all 0.3s ease;
}

.cancel-btn:active {
  color: rgba(255, 255, 255, 1);
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
