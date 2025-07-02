<template>
  <view class="detail-container">
    <!-- 活动头部信息 -->
    <view class="activity-header glass-effect">
      <view class="activity-header-info">
        <view class="activity-title">{{ activity.title }}</view>
        <view class="activity-status">
          <wd-tag v-if="activity.canApply" type="success">
            <text>可申请</text>
          </wd-tag>
          <wd-tag v-else type="danger">
            <text>已结束</text>
          </wd-tag>
          <text class="activity-date">{{ activity.createTime }}</text>
        </view>
      </view>
    </view>

    <!-- 活动详情 -->
    <div class="activity-content glass-effect" v-html="activity.content" />

    <!-- 底部操作按钮 -->
    <view v-if="activity.canApply" class="footer-actions glass-effect">
      <wd-button type="warning" size="small" class="action-button" @click="handleParticipate">
        立即参与
      </wd-button>
    </view>

    <!-- Toast提示 -->
    <wd-toast />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import FrontApi from "@/api/front/index";
import { onLoad } from "@dcloudio/uni-app";

// 活动ID
const activityId = ref(1);
const activity = ref<any>({});

onLoad((options) => {
  activityId.value = Number(options?.id);
  // 获取活动详情
  getActivityDetail();
});

// 参与活动
async function handleParticipate() {
  // uni.showToast({
  //   title: "您已成功参与活动 ",
  //   icon: "success",
  // });
  FrontApi.applyActiviteApi(activityId.value).then((res) => {
    uni.showToast({
      title: "您已成功参与活动 ",
      icon: "success",
    });
  });
}

// 获取活动详情
function getActivityDetail() {
  FrontApi.getActiviteApi(activityId.value).then((res) => {
    console.log(res);
    activity.value = res;
  });
}
</script>

<style lang="scss">
.detail-container {
  position: relative;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.activity-header {
  display: flex;
  align-items: center;
  padding: 30rpx;
  margin: 30rpx 20rpx;
  background: linear-gradient(to right, #3175ea, #287fea, #1891ec, #109aec, #02aaee);

  .activity-header-info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    .activity-title {
      width: 100%;
      margin-bottom: 20rpx;
      font-size: 40rpx;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
    }

    .activity-status {
      display: flex;
      align-items: center;

      .activity-date {
        margin-left: 20rpx;
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}

.activity-content {
  padding: 30rpx;
  margin: 0 20rpx;

  .cell-group-custom {
    background: transparent;

    :deep(.wd-cell) {
      background: transparent;
      --cell-title-color: #ffffff;
      --cell-value-color: rgba(255, 255, 255, 0.7);
      --cell-arrow-color: #ffd700;

      &::after {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }
    }

    :deep(.wd-icon) {
      color: #ffd700;
    }
  }

  .section-title {
    position: relative;
    padding-left: 20rpx;
    margin: 40rpx 0 20rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #ffd700;

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: 8rpx;
      height: 30rpx;
      content: "";
      background: #ffd700;
      border-radius: 4rpx;
      transform: translateY(-50%);
    }
  }

  .description-text {
    font-size: 28rpx;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.9);
    text-align: justify;
  }

  .activity-steps {
    margin-top: 40rpx;

    :deep(.wd-steps) {
      --step-title-color: #ffffff;
      --step-title-finish-color: #ffd700;
      --step-description-color: rgba(255, 255, 255, 0.7);
      --step-line-color: rgba(255, 255, 255, 0.3);
      --step-line-finish-color: #ffd700;
      --step-circle-color: rgba(255, 255, 255, 0.5);
      --step-circle-finish-color: #ffd700;
      --step-icon-finish-color: #1a2a6c;
    }
  }
}

.footer-actions {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx 20rpx;

  .action-button {
    background: linear-gradient(90deg, #ffd700, #ffa500);
    border: none;
    box-shadow: 0 4rpx 15rpx rgba(255, 215, 0, 0.5);

    &:active {
      transform: scale(0.98);
    }
  }
}

.mr-5 {
  margin-right: 10rpx;
}
</style>
