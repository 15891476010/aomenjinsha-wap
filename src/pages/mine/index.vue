<template>
  <view class="mine-page page-animation">
    <!-- 顶部导航栏 -->
    <view class="top-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-item">
        <wd-icon name="dong" size="20" color="#666666" />
        <text>客服</text>
      </view>
      <view class="navbar-item">
        <wd-icon name="notification" size="20" color="#666666" />
        <text>消息</text>
        <view class="notification-badge">50</view>
      </view>
      <view class="navbar-item" @click="navigateToProfile">
        <wd-icon name="note" size="20" color="#666666" />
        <text>个人资料</text>
      </view>
    </view>

    <!-- 用户信息区 -->
    <view class="user-header">
      <view class="user-info">
        <view class="avatar-container">
          <image class="avatar" :src="userAvatar ? userAvatar : defaultAvatar" mode="aspectFill" />
        </view>
        <view class="user-details">
          <view class="nickname">
            <text v-if="userInfo?.username">{{ userInfo?.username }}</text>
            <wd-button v-else type="primary" size="small" @click="goLogin">登录/注册</wd-button>
          </view>
          <view class="user-level">
            <image class="level-icon" src="/static/icons/CNY.avif" mode="aspectFill" />
            <text>
              {{ userInfo?.balance ? userInfo?.balance || userInfo?.balance : "0.00" }} CNY
            </text>
            <wd-icon name="question-circle" size="16" color="#666666" />
          </view>
        </view>
      </view>
    </view>

    <!-- 功能按钮区 -->
    <view class="function-buttons">
      <view
        v-for="(button, index) in functionButtons"
        :key="index"
        class="function-button"
        @click="navigateToSection(button.subSection)"
      >
        <view :class="['icon-wrapper', button.colorClass]">
          <wd-icon :name="button.icon" size="24" color="#ffffff" />
        </view>
        <text>{{ button.text }}</text>
        <view v-if="button.badge" :class="['badge', button.badgeClass]">
          {{ button.badgeValue }}
        </view>
      </view>
    </view>

    <!-- VIP信息区 -->
    <view class="vip-info-card" @click="navigateToSection('vip')">
      <view class="vip-left">
        <wd-tag custom-class="vip-tag" type="danger">
          VIP
          <text>0</text>
        </wd-tag>
      </view>
      <view class="vip-right">
        <view class="vip-balance">
          距离
          <span class="vip-balance-text">VIP 1</span>
          还需投注
          <span class="vip-balance-text">1000</span>
        </view>
        <wd-icon name="arrow-right" size="16" color="#ffffff" />
      </view>
    </view>

    <!-- 资金信息区 -->
    <view class="balance-info">
      <view v-for="(item, index) in balanceItems" :key="index" class="balance-item">
        <text class="balance-label">{{ item.label }}</text>
        <view class="balance-progress">
          <view class="progress-bar" :style="{ width: item.progressWidth }"></view>
          <text class="balance-value">{{ item.value }}</text>
        </view>
      </view>
    </view>

    <!-- 菜单列表 -->
    <view class="menu-list">
      <view
        v-for="(item, index) in menuItems"
        :key="index"
        class="menu-item"
        @click="navigateToSection(item.section)"
      >
        <view :class="['menu-icon']">
          <wd-img :width="30" :height="30" :src="indexData.imagePrefix + item.icon" mode="aspectFill" />
        </view>
        <text class="menu-text">{{ item.title }}</text>
        <wd-icon name="arrow-right" size="16" color="#999999" />
      </view>
    </view>

    <!-- 底部菜单 -->
    <view class="bottom-menu">
      <view
        v-for="(item, index) in bottomMenuItems"
        :key="index"
        class="menu-item"
        @click="navigateToSection(item.section)"
      >
        <view :class="['menu-icon', item.iconColorClass]">
          <wd-img :width="30" :height="30" :src="indexData.imagePrefix + item.icon" mode="aspectFill" />
        </view>
        <text class="menu-text">{{ item.title }}</text>
        <text v-if="item.extraText" class="extra-text">{{ item.extraText }}</text>
        <wd-icon name="arrow-right" size="16" color="#999999" />
      </view>
    </view>

    <wd-toast />
    <view class="h-70px" />
    <TabbarCom />
  </view>
</template>

<script lang="ts" setup>
import {useToast} from "wot-design-uni";
import {useUserStore} from "@/store/modules/user";
import {computed, onMounted, ref} from "vue";
import PublicApi from "@/api/public";
import TabbarCom from "@/components/Tabbar";

import {getIndexData} from "@/utils/auth";

const indexData = ref(getIndexData());

const toast = useToast();
const userStore = useUserStore();
const userInfo = ref(userStore.userInfo);
const defaultAvatar = "/static/images/default-avatar.png";
const userAvatar = computed(() =>
  userInfo.value?.avatar ? indexData.value.imagePrefix + userInfo.value?.avatar : defaultAvatar
);

// 获取状态栏高度
const statusBarHeight = ref(0);
onMounted(async () => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 0;
  const res = await userStore.getInfo();
  userInfo.value = res as any;
});

// 功能按钮数组
const functionButtons = ref([
  {
    text: "提现",
    icon: "money-wallet",
    colorClass: "blue",
    section: "wallet",
    subSection: "withdraw",
  },
  {
    text: "充值",
    icon: "add-circle",
    colorClass: "orange",
    section: "wallet",
    subSection: "recharge",
  },
  {
    text: "利息宝",
    icon: "trending-up",
    colorClass: "blue",
    section: "wallet",
    subSection: "interest",
    badge: true,
    badgeClass: "rate-badge",
    badgeValue: "88.00%",
  },
  {
    text: "公积金",
    icon: "safe",
    colorClass: "orange",
    section: "wallet",
    subSection: "fund",
    badge: true,
    badgeClass: "amount-badge",
    badgeValue: "200.00",
  },
]);

// 资金信息数组
const balanceItems = ref([
  {
    label: "晋级再充值",
    progressWidth: "100%",
    value: "800,000.00",
    percentage: 100,
    color: "#34d399",
  },
  {
    label: "晋级再投注",
    progressWidth: "60%",
    value: "3,014.90/5,000.00",
    percentage: 60,
    color: "#34d399",
  },
]);

// 菜单列表数组
const menuItems = ref([]);

// 底部菜单数组
const bottomMenuItems = ref([]);

// 导航功能
const navigateToCustomerService = () => {
  toast.show("客服功能正在开发中...");
};

const navigateToMessages = () => {
  toast.show("消息功能正在开发中...");
};

// 登录
const navigateToLoginPage = () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const currentPagePath = `/${currentPage.route}`;

  uni.navigateTo({
    url: `/pages/login/index?redirect=${encodeURIComponent(currentPagePath)}`,
  });
};

// 个人信息
const navigateToProfile = () => {
  if (!userInfo.value) {
    navigateToLoginPage();
    return;
  }
  uni.navigateTo({ url: "/pages/mine/profile/index" });
};

// 导航到各个板块
const navigateToSection = (section: string) => {
  console.log(section);
  switch (section) {
    case "fund":
      uni.navigateTo({ url: `/pages/home/index?type=${section}` });
      break;
    case "PromoteToMakeMoney":
      uni.navigateTo({ url: `/pages/popularize/index`});
      break;
    case "safeLogout":
      navigateToSafeLogout();
      break;
  }
};
async function goLogin() {
  uni.navigateTo({
    url: "/pages/login/index",
  });
}
// 安全退出
const navigateToSafeLogout = () => {
  // 检查用户是否已登录
  if (!userInfo.value) {
    // 未登录，引导用户去登录页面
    toast.show("请先登录");
    navigateToLoginPage();
    return;
  }

  // 已登录，显示确认弹窗
  uni.showModal({
    title: "安全退出",
    content: "确定要安全退出吗？",
    success: (res) => {
      if (res.confirm) {
        userStore.logout();
        // 刷新当前页面
        uni.reLaunch({ url: "/pages/mine/index" });
      }
    },
  });
};

const getMinePagesList = async () => {
  menuItems.value = await PublicApi.getMinePagesListApi()
}
const getMinePagesBottomList = async () => {
  bottomMenuItems.value = await PublicApi.getMinePagesBottomListApi()
}
onMounted(async () => {
  await getMinePagesList();
  await getMinePagesBottomList();
});

</script>

<style lang="scss" scoped>
.mine-page {
  min-height: 100vh;
  padding-bottom: 100rpx;
  color: #333333;
  background-color: #f5f7fa;
}

// 顶部导航栏
.top-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  padding: 20rpx 30rpx;
  background-color: #ffffff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .navbar-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 40rpx;

    text {
      margin-top: 4rpx;
      font-size: 22rpx;
      color: #666666;
    }

    .notification-badge {
      position: absolute;
      top: -8rpx;
      right: -12rpx;
      min-width: 32rpx;
      height: 32rpx;
      padding: 0 6rpx;
      font-size: 20rpx;
      line-height: 32rpx;
      color: #fff;
      text-align: center;
      background: #f43f5e;
      border-radius: 16rpx;
      box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
    }
  }
}

// 调试信息
.debug-info {
  padding: 10rpx 20rpx;
  margin: 10rpx 20rpx;
  font-size: 24rpx;
  color: #666666;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 10rpx;
}

// 用户信息卡片
.user-header {
  position: relative;
  padding: 30rpx;
  margin: 20rpx;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);

  &::before {
    position: absolute;
    top: -100rpx;
    right: -100rpx;
    width: 300rpx;
    height: 300rpx;
    content: "";
    background: radial-gradient(circle, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0) 70%);
    border-radius: 50%;
  }

  &::after {
    position: absolute;
    bottom: -80rpx;
    left: -80rpx;
    width: 200rpx;
    height: 200rpx;
    content: "";
    background: radial-gradient(circle, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0) 70%);
    border-radius: 50%;
  }

  .user-info {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;

    .avatar-container {
      position: relative;

      .avatar {
        width: 96rpx;
        height: 96rpx;
        border: 3rpx solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
      }
    }

    .user-details {
      flex: 1;
      margin-left: 24rpx;

      .nickname {
        display: flex;
        align-items: center;
        margin-bottom: 8rpx;
        font-size: 32rpx;
        font-weight: 600;
        color: #333333;

        .wd-icon {
          margin-left: 8rpx;
          opacity: 0.7;
        }
      }

      .user-id {
        display: flex;
        align-items: center;
        margin-bottom: 8rpx;
        font-size: 24rpx;
        color: #666666;

        .wd-icon {
          margin-left: 8rpx;
          opacity: 0.6;
        }
      }

      .user-level {
        display: flex;
        align-items: center;

        .level-icon {
          width: 28rpx;
          height: 28rpx;
          margin-right: 8rpx;
        }

        text {
          font-size: 24rpx;
          font-weight: 500;
          color: #666666;
        }

        .wd-icon {
          margin-left: 8rpx;
          opacity: 0.6;
        }
      }
    }
  }
}

// 功能按钮区
.function-buttons {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  padding: 30rpx 20rpx;
  margin: 20rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);

  .function-button {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    padding: 15rpx 0;

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80rpx;
      height: 80rpx;
      margin-bottom: 12rpx;
      border-radius: 50%;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);

      &.blue {
        background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
      }

      &.orange {
        background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
      }
    }

    text {
      font-size: 24rpx;
      color: #666666;
    }

    .badge {
      position: absolute;
      top: -5rpx;
      right: 10rpx;
      padding: 4rpx 12rpx;
      font-size: 20rpx;
      font-weight: bold;
      color: #fff;
      border-radius: 20rpx;
      box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
      transform: scale(0.9);
    }

    .rate-badge {
      background: linear-gradient(90deg, #ef4444, #f87171);
    }

    .amount-badge {
      background: linear-gradient(90deg, #f97316, #fb923c);
    }
  }
}

// VIP信息区
.vip-info-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  margin: 20rpx 20rpx 0;
  overflow: hidden;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  border-radius: 16rpx 16rpx 0 0;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);

  .vip-left {
    display: flex;
    align-items: center;
  }

  .vip-tag {
    display: flex !important;
    align-items: center;
    height: 40rpx;
    padding: 0 14rpx;
    margin-right: 16rpx;
    font-size: 24rpx;
    font-weight: bold;
    color: #fff !important;
    background-color: #f43f5e !important;
    border-radius: 8rpx;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);

    text {
      margin-left: 2rpx;
    }
  }

  .vip-level {
    font-size: 30rpx;
    font-weight: bold;
    color: #ffffff;
  }

  .vip-right {
    display: flex;
    align-items: center;
  }

  .vip-balance {
    margin-right: 14rpx;
    font-size: 26rpx;
    font-weight: 500;
    color: #e3e3e3e3;

    .vip-balance-text {
      font-size: 30rpx;
      font-weight: 800;
      color: #ffffff;
    }
  }
}

// 资金信息区
.balance-info {
  padding: 20rpx 0;
  margin: 0 20rpx 20rpx;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  border-radius: 0 0 16rpx 16rpx;

  .balance-item {
    display: flex;
    align-items: center;
    padding: 12rpx 30rpx;

    &:last-child {
      padding-bottom: 24rpx;
    }

    .balance-label {
      display: flex;
      align-items: center;
      width: 160rpx;
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.9);

      &::before {
        display: inline-block;
        width: 6rpx;
        height: 6rpx;
        margin-right: 6rpx;
        content: "";
        background: #fff;
        border-radius: 50%;
      }
    }

    .balance-progress {
      position: relative;
      flex: 1;
      height: 25rpx;
      margin-right: 20rpx;
      overflow: hidden;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 30rpx;

      .progress-bar {
        height: 100%;
        background: #34d399;
        border-radius: 30rpx;
      }

      .balance-value {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 20rpx;
        font-weight: bold;
        color: #fff;
        white-space: nowrap;
        transform: translate(-50%, -50%);
      }
    }
  }
}

// 菜单列表
.menu-list {
  padding: 10rpx 0;
  margin: 20rpx 20rpx;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);

  .menu-item {
    position: relative;
    display: flex;
    align-items: center;
    padding: 30rpx 24rpx;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);

    &:last-child {
      border-bottom: none;
    }

    .menu-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56rpx;
      height: 56rpx;
      margin-right: 20rpx;
      border-radius: 12rpx;
      box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.15);

      &.blue {
        background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
      }

      &.orange {
        background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
      }

      &.green {
        background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      }

      &.red {
        background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
      }

      &.purple {
        background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
      }
    }

    .menu-text {
      flex: 1;
      font-size: 28rpx;
      color: #333333;
    }
  }
}

// 底部菜单
.bottom-menu {
  padding: 10rpx 0;
  margin: 20rpx 20rpx;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);

  .menu-item {
    position: relative;
    display: flex;
    align-items: center;
    padding: 30rpx 24rpx;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);

    &:last-child {
      border-bottom: none;
    }

    .menu-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56rpx;
      height: 56rpx;
      margin-right: 20rpx;
      border-radius: 12rpx;
      box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.15);

      &.blue {
        background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
      }

      &.orange {
        background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
      }

      &.green {
        background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      }

      &.purple {
        background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
      }
    }

    .menu-text {
      flex: 1;
      font-size: 28rpx;
      color: #333333;
    }

    .extra-text {
      margin-right: 15rpx;
      font-size: 24rpx;
      color: #3b82f6;
    }
  }
}

/* 页面动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-animation {
  animation: fadeIn 0.3s ease-out;
}
</style>

<style>
/* 全局样式 */
page {
  color: #333333;
  background-color: #f5f7fa;
}

/* wot-design-uni标签样式覆盖 */
.wd-tag {
  height: 40rpx !important;
  padding: 0 14rpx !important;
  font-size: 24rpx !important;
  line-height: 40rpx !important;
  border: none !important;
}
</style>
