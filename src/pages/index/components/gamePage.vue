<template>
  <view class="game-container">
    <!-- 内嵌页面内容区域 -->
    <web-view :src="gameUrl" class="game-webview"></web-view>

    <!-- 悬浮返回按钮 -->
    <view class="float-back-btn" @click="goBack">
      <text class="iconfont icon-back">返回</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { onLoad, onReady, onShow } from "@dcloudio/uni-app";

// 游戏URL，这里使用示例URL，实际使用时需要替换为真实的游戏URL
const gameUrl = ref(null);

onLoad((options) => {
  // 解码并设置游戏URL
  if (options.url) {
    try {
      const decodedUrl = decodeURIComponent(options.url);
      gameUrl.value = decodedUrl;
      console.log("游戏URL:", decodedUrl);
    } catch (error) {
      console.error("URL解码错误:", error);
      gameUrl.value = options.url; // 如果解码失败，使用原始URL
    }
  } else {
    console.error("未提供游戏URL");
  }

  // #ifdef APP-PLUS
  // 设置全屏显示
  setTimeout(() => {
    setFullScreen();
  }, 200);
  // #endif
});

// 返回主界面方法
const goBack = () => {
  // #ifdef APP-PLUS
  // 退出全屏
  plus.navigator.setFullscreen(false);
  // #endif

  uni.navigateBack({
    delta: 1,
  });
};

// 设置全屏方法
function setFullScreen() {
  // #ifdef APP-PLUS
  try {
    // 设置全屏显示
    plus.navigator.setFullscreen(true);
    // 隐藏状态栏
    plus.navigator.setStatusBarStyle("dark");
    // 隐藏系统导航栏（如果有）
    if (plus.navigator.hideSystemNavigation) {
      plus.navigator.hideSystemNavigation();
    }
    console.log("已设置全屏模式");
  } catch (error) {
    console.error("设置全屏出错:", error);
  }
  // #endif
}

onReady(() => {
  // #ifdef APP-PLUS
  setFullScreen();
  // #endif
});

onShow(() => {
  // #ifdef APP-PLUS
  setFullScreen();
  // #endif
});

onMounted(() => {
  // 设置页面全屏显示
  uni.setNavigationBarColor({
    frontColor: "#ffffff",
    backgroundColor: "#000000",
  });

  // #ifdef APP-PLUS
  setFullScreen();
  // #endif

  // #ifdef H5
  // 在H5环境中确保返回按钮在最上层
  setTimeout(() => {
    const backBtn = document.querySelector(".float-back-btn");
    if (backBtn) {
      backBtn.style.zIndex = "9999";
    }
  }, 500);
  // #endif
});

onBeforeUnmount(() => {
  // #ifdef APP-PLUS
  // 退出全屏
  plus.navigator.setFullscreen(false);
  // #endif
});
</script>

<style lang="scss" scoped>
.game-webview {
  width: 100%;
  height: 100%;
}

.float-back-btn {
  position: fixed;
  top: 40px;
  left: 15px;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 15px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  /* 确保按钮可见 */
  pointer-events: auto;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.float-back-btn:active {
  opacity: 0.8;
}
</style>
