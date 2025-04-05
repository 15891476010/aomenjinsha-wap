<template>
  <view class="mine-container">
    <!-- 用户信息卡片 -->
    <view class="user-profile">
      <view class="blur-bg"></view>
      <view class="user-info">
        <view class="avatar-container" @click="navigateToProfile">
          <image
            class="avatar"
            :src="isLogin ? userInfo!.avatar : defaultAvatar"
            mode="aspectFill"
          />
          <view v-if="isLogin" class="avatar-edit">
            <wd-icon name="edit-pen" size="16" color="#fff" />
          </view>
        </view>
        <view class="user-details">
          <block v-if="isLogin">
            <view class="nickname">{{ userInfo!.nickname || "匿名用户" }}</view>
            <view class="user-id">ID: {{ userInfo?.username || "0000000" }}</view>
          </block>
          <block v-else>
            <view class="login-prompt">立即登录获取更多功能</view>
            <wd-button class="login-btn" size="small" type="primary" @click="navigateToLoginPage">
              登录/注册
            </wd-button>
          </block>
        </view>
        <view class="actions">
          <view class="action-btn" @click="navigateToSettings">
            <wd-icon name="setting1" size="22" color="#333" />
          </view>
          <view v-if="isLogin" class="action-btn" @click="navigateToSection('messages')">
            <wd-icon name="message" size="22" color="#333" />
            <view v-if="true" class="badge">2</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 数据统计 -->
    <view class="stats-container">
      <view class="stat-item" @click="navigateToSection('wallet')">
        <view class="stat-value">0.00</view>
        <view class="stat-label">我的余额</view>
      </view>
      <view class="divider"></view>
      <view class="stat-item" @click="navigateToSection('favorites')">
        <view class="stat-value">0</view>
        <view class="stat-label">我的收藏</view>
      </view>
      <view class="divider"></view>
      <view class="stat-item" @click="navigateToSection('history')">
        <view class="stat-value">0</view>
        <view class="stat-label">浏览历史</view>
      </view>
    </view>

    <!-- 我的订单 -->
    <view class="card-container">
      <view class="card-header">
        <view class="card-title">
          <wd-icon name="cart" size="18" :color="themeStore.primaryColor" />
          <text>我的订单</text>
        </view>
        <view class="card-action" @click="navigateToSection('orders')">
          <text>全部订单</text>
          <wd-icon name="arrow-right" size="14" color="#999" />
        </view>
      </view>
      <view class="order-status">
        <view class="status-item" @click="navigateToSection('orders', 'pending')">
          <view class="status-icon">
            <wd-icon name="wallet-pay" size="28" :color="themeStore.primaryColor" />
            <view v-if="true" class="status-badge">2</view>
          </view>
          <view class="status-label">待付款</view>
        </view>
        <view class="status-item" @click="navigateToSection('orders', 'shipping')">
          <view class="status-icon">
            <wd-icon name="shopping" size="28" :color="themeStore.primaryColor" />
          </view>
          <view class="status-label">待发货</view>
        </view>
        <view class="status-item" @click="navigateToSection('orders', 'receiving')">
          <view class="status-icon">
            <wd-icon name="car" size="28" :color="themeStore.primaryColor" />
          </view>
          <view class="status-label">待收货</view>
        </view>
        <view class="status-item" @click="navigateToSection('orders', 'comment')">
          <view class="status-icon">
            <wd-icon name="comment-o" size="28" :color="themeStore.primaryColor" />
          </view>
          <view class="status-label">待评价</view>
        </view>
        <view class="status-item" @click="navigateToSection('orders', 'after-sale')">
          <view class="status-icon">
            <wd-icon name="service" size="28" :color="themeStore.primaryColor" />
          </view>
          <view class="status-label">售后</view>
        </view>
      </view>
    </view>

    <!-- 常用工具 -->
    <view class="card-container">
      <view class="card-header">
        <view class="card-title">
          <wd-icon name="tools" size="18" :color="themeStore.primaryColor" />
          <text>常用工具</text>
        </view>
      </view>
      <view class="tools-grid">
        <view class="tool-item" @click="navigateToProfile">
          <view class="tool-icon">
            <wd-icon name="person" size="24" :color="themeStore.primaryColor" />
          </view>
          <view class="tool-label">个人资料</view>
        </view>
        <view class="tool-item" @click="navigateToSection('address')">
          <view class="tool-icon">
            <wd-icon name="location" size="24" :color="themeStore.primaryColor" />
          </view>
          <view class="tool-label">收货地址</view>
        </view>
        <view class="tool-item" @click="navigateToSection('todos')">
          <view class="tool-icon">
            <wd-icon name="task" size="24" :color="themeStore.primaryColor" />
          </view>
          <view class="tool-label">待办事项</view>
        </view>
        <view class="tool-item" @click="navigateToFAQ">
          <view class="tool-icon">
            <wd-icon name="help-circle" size="24" :color="themeStore.primaryColor" />
          </view>
          <view class="tool-label">常见问题</view>
        </view>
        <view class="tool-item" @click="handleQuestionFeedback">
          <view class="tool-icon">
            <wd-icon name="check-circle" size="24" :color="themeStore.primaryColor" />
          </view>
          <view class="tool-label">问题反馈</view>
        </view>
        <view class="tool-item" @click="navigateToAbout">
          <view class="tool-icon">
            <wd-icon name="info-circle" size="24" :color="themeStore.primaryColor" />
          </view>
          <view class="tool-label">关于我们</view>
        </view>
        <view class="tool-item" @click="navigateToSettings">
          <view class="tool-icon">
            <wd-icon name="setting1" size="24" :color="themeStore.primaryColor" />
          </view>
          <view class="tool-label">设置</view>
        </view>
        <view class="tool-item" @click="navigateToSection('wallet')">
          <view class="tool-icon">
            <wd-icon name="wallet" size="24" :color="themeStore.primaryColor" />
          </view>
          <view class="tool-label">我的钱包</view>
        </view>
      </view>
    </view>

    <!-- 推荐服务 -->
    <view class="card-container">
      <view class="card-header">
        <view class="card-title">
          <wd-icon name="star" size="18" :color="themeStore.primaryColor" />
          <text>推荐服务</text>
        </view>
      </view>
      <view class="services-list">
        <view class="service-item" @click="navigateToSection('services', 'vip')">
          <view class="service-left">
            <view class="service-icon vip-icon">
              <wd-icon name="crown" size="22" color="#FFD700" />
            </view>
            <view class="service-info">
              <view class="service-name">会员中心</view>
              <view class="service-desc">解锁更多特权</view>
            </view>
          </view>
          <wd-icon name="arrow-right" size="14" color="#999" />
        </view>
        <view class="service-item" @click="navigateToSection('services', 'coupon')">
          <view class="service-left">
            <view class="service-icon">
              <wd-icon name="ticket" size="22" :color="themeStore.primaryColor" />
            </view>
            <view class="service-info">
              <view class="service-name">优惠券</view>
              <view class="service-desc">查看我的优惠券</view>
            </view>
          </view>
          <wd-icon name="arrow-right" size="14" color="#999" />
        </view>
        <view class="service-item" @click="navigateToSection('services', 'invite')">
          <view class="service-left">
            <view class="service-icon">
              <wd-icon name="share" size="22" :color="themeStore.primaryColor" />
            </view>
            <view class="service-info">
              <view class="service-name">邀请有礼</view>
              <view class="service-desc">邀请好友得奖励</view>
            </view>
          </view>
          <wd-icon name="arrow-right" size="14" color="#999" />
        </view>
      </view>
    </view>

    <view v-if="isLogin" class="logout-btn-container">
      <wd-button class="logout-btn" @click="handleLogout">退出登录</wd-button>
    </view>

    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { useToast } from "wot-design-uni";
import { useUserStore } from "@/store/modules/user";
import { useThemeStore } from "@/store/modules/theme";
import { computed } from "vue";

const toast = useToast();
const userStore = useUserStore();
const themeStore = useThemeStore();
const userInfo = computed(() => userStore.userInfo);
const isLogin = computed(() => !!userInfo.value);
const defaultAvatar = "/static/images/default-avatar.png";

// 登录
const navigateToLoginPage = () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const currentPagePath = `/${currentPage.route}`;

  uni.navigateTo({
    url: `/pages/login/index?redirect=${encodeURIComponent(currentPagePath)}`,
  });
};

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: "提示",
    content: "确认退出登录吗？",
    success: function (res) {
      if (res.confirm) {
        userStore.logout();
        toast.show("已退出登录");
      }
    },
  });
};

// 个人信息
const navigateToProfile = () => {
  if (!isLogin.value) {
    navigateToLoginPage();
    return;
  }
  uni.navigateTo({ url: "/pages/mine/profile/index" });
};

// 常见问题
const navigateToFAQ = () => {
  uni.navigateTo({ url: "/pages/mine/faq/index" });
};

// 关于我们
const navigateToAbout = () => {
  uni.navigateTo({ url: "/pages/mine/about/index" });
};

// 设置
const navigateToSettings = () => {
  uni.navigateTo({ url: "/pages/mine/settings/index" });
};

// 问题反馈
const handleQuestionFeedback = () => {
  uni.navigateTo({ url: "/pages/mine/feedback/index" });
};

// 导航到各个板块
const navigateToSection = (section: string, subSection?: string) => {
  if (!isLogin.value && section !== "services") {
    navigateToLoginPage();
    return;
  }

  const sections: Record<string, string> = {
    messages: "消息中心",
    todos: "待办事项",
    favorites: "我的收藏",
    history: "浏览历史",
    wallet: "我的钱包",
    orders: "我的订单",
    address: "收货地址",
    services: "增值服务",
  };

  let message = sections[section];
  if (subSection) {
    message += ` - ${subSection}`;
  }

  toast.show(`${message}功能开发中...`);
};
</script>

<style lang="scss" scoped>
.mine-container {
  min-height: 100vh;
  padding-bottom: 100rpx;
  background-color: #f5f7fa;
}

// 用户信息卡片
.user-profile {
  position: relative;
  padding: 30rpx;
  overflow: hidden;

  .blur-bg {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 0;
    height: 240rpx;
    background: linear-gradient(to bottom, var(--primary-color), var(--primary-color-light));
  }

  .user-info {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;

    .avatar-container {
      position: relative;

      .avatar {
        width: 120rpx;
        height: 120rpx;
        border: 4rpx solid rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.1);
      }

      .avatar-edit {
        position: absolute;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36rpx;
        height: 36rpx;
        background-color: var(--primary-color);
        border-radius: 50%;
        box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
      }
    }

    .user-details {
      flex: 1;
      margin-left: 24rpx;

      .nickname {
        margin-bottom: 8rpx;
        font-size: 34rpx;
        font-weight: bold;
        color: #fff;
      }

      .user-id {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
      }

      .login-prompt {
        margin-bottom: 16rpx;
        font-size: 28rpx;
        color: #fff;
      }

      .login-btn {
        width: 160rpx;
        height: 60rpx;
        font-size: 26rpx;
        color: var(--primary-color);
        background-color: #fff;
        border: none;
        border-radius: 30rpx;
      }
    }

    .actions {
      display: flex;

      .action-btn {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 70rpx;
        height: 70rpx;
        margin-left: 16rpx;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

        .badge {
          position: absolute;
          top: -6rpx;
          right: -6rpx;
          z-index: 2;
          min-width: 32rpx;
          height: 32rpx;
          padding: 0 6rpx;
          font-size: 20rpx;
          line-height: 32rpx;
          color: #fff;
          text-align: center;
          background-color: #ff4d4f;
          border: 2rpx solid #fff;
          border-radius: 16rpx;
        }
      }
    }
  }
}

// 数据统计
.stats-container {
  display: flex;
  padding: 30rpx 20rpx;
  margin: 20rpx 30rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);

  .stat-item {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;

    .stat-value {
      margin-bottom: 8rpx;
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
    }

    .stat-label {
      font-size: 26rpx;
      color: #666;
    }
  }

  .divider {
    width: 1px;
    margin: 0 20rpx;
    background-color: #eee;
  }
}

// 卡片容器通用样式
.card-container {
  margin: 24rpx 30rpx;
  overflow: hidden;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 24rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .card-title {
      display: flex;
      align-items: center;

      text {
        margin-left: 12rpx;
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
      }
    }

    .card-action {
      display: flex;
      align-items: center;

      text {
        margin-right: 8rpx;
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

// 订单状态
.order-status {
  display: flex;
  padding: 30rpx 0 20rpx;

  .status-item {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;

    .status-icon {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80rpx;
      height: 80rpx;
      margin-bottom: 12rpx;

      .status-badge {
        position: absolute;
        top: -10rpx;
        right: -10rpx;
        z-index: 2;
        min-width: 32rpx;
        height: 32rpx;
        padding: 0 6rpx;
        font-size: 20rpx;
        line-height: 32rpx;
        color: #fff;
        text-align: center;
        background-color: #ff4d4f;
        border-radius: 16rpx;
      }
    }

    .status-label {
      font-size: 24rpx;
      color: #666;
    }
  }
}

// 工具网格
.tools-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 0 10rpx;

  .tool-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 25%;
    margin-bottom: 30rpx;

    .tool-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 90rpx;
      height: 90rpx;
      margin-bottom: 12rpx;
      background-color: rgba(var(--primary-color-rgb), 0.08);
      border-radius: 18rpx;
      transition: transform 0.2s;

      &:active {
        transform: scale(0.95);
      }
    }

    .tool-label {
      font-size: 24rpx;
      color: #555;
    }
  }
}

// 服务列表
.services-list {
  .service-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 24rpx;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .service-left {
      display: flex;
      align-items: center;

      .service-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 70rpx;
        height: 70rpx;
        background-color: rgba(var(--primary-color-rgb), 0.08);
        border-radius: 16rpx;

        &.vip-icon {
          background: linear-gradient(135deg, #ffd700, #ffa500);
        }
      }

      .service-info {
        margin-left: 20rpx;

        .service-name {
          margin-bottom: 6rpx;
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
        }

        .service-desc {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}

// 退出登录按钮
.logout-btn-container {
  margin: 60rpx 30rpx;

  .logout-btn {
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    color: #666;
    background-color: #f5f5f5;
    border: none;
    border-radius: 40rpx;

    &:active {
      opacity: 0.8;
    }
  }
}
</style>
