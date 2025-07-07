<template>
  <view class="home-content">
    <!-- 代理信息区域 -->
    <view class="agent-info-section">
      <view class="agent-header">
        <view class="agent-id">
          <wd-icon name="user" size="20rpx" color="#4A9EFF" />
          <text class="id-text">{{ agentInfo.account }}</text>
          <wd-icon name="help" size="16rpx" color="#666" @click="showAccountTip" />
        </view>
        <view class="agent-level">
          <text class="level-text">代理等级</text>
          <text class="level-value">{{ agentInfo.level }}</text>
        </view>
      </view>

      <view class="agent-details">
        <view class="detail-item">
          <text class="detail-label">审核倍数</text>
          <text class="detail-value">{{ agentInfo.auditMultiple }}</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">结算周期</text>
          <text class="detail-value">{{ agentInfo.settlementCycle }}</text>
        </view>
      </view>
    </view>

    <!-- 邀请好友区域 -->
    <view class="invite-section">
      <view class="invite-header">
        <view class="invite-code-display">
          <text class="invite-code-label">我的邀请码</text>
          <text class="invite-code-value">{{ agentInfo.account }}</text>
          <wd-icon name="copy" size="16rpx" color="#4A9EFF" @click="copyInviteCode" />
        </view>
      </view>
    </view>

    <!-- 二维码和链接区域 -->
    <view class="qr-link-section">
      <view class="qr-container">
        <view class="qr-code">
          <text>二维码占位</text>
        </view>
      </view>

      <view class="link-container">
        <view class="link-input-wrapper">
          <wd-input
            v-model="promoLink"
            readonly
            placeholder="推广链接"
            class="promo-input"
          />
          <wd-icon name="copy" size="20rpx" color="#4A9EFF" @click="copyLink" />
        </view>

        <!-- 分享按钮组 -->
        <view class="share-buttons">
          <view class="share-btn" @click="saveQRCode">
            <wd-icon name="download" size="24rpx" color="#4A9EFF" />
            <text>点击保存</text>
          </view>
          <view class="share-btn" @click="shareToSocial('wechat')">
            <wd-icon name="chat" size="24rpx" color="#07c160" />
            <text>分享</text>
          </view>
          <view class="share-btn" @click="shareToSocial('wechat')">
            <text>WeChat</text>
          </view>
          <view class="share-btn" @click="shareToSocial('moments')">
            <text>WeChat Moments</text>
          </view>
          <view class="share-btn" @click="shareToSocial('qq')">
            <text>QQ</text>
          </view>
          <view class="share-btn" @click="shareToSocial('facebook')">
            <text>Facebook</text>
          </view>
          <view class="share-btn" @click="shareToSocial('telegram')">
            <text>Telegram</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 收益统计区域 -->
    <view class="earnings-section">
      <view class="earnings-header">
        <view class="earnings-stats">
          <view class="earnings-item">
            <text class="earnings-title">累计佣金</text>
            <text class="earnings-amount">{{ totalEarnings }}</text>
          </view>
          <view class="earnings-item">
            <text class="earnings-title">累计邀请</text>
            <text class="earnings-amount invite-count">{{ promotionStats.totalInvites }}</text>
          </view>
        </view>
      </view>

      <!-- 我的佣金详情 -->
      <view class="commission-details">
        <view class="commission-item" @click="navigateToSection('commission')">
          <view class="commission-info">
            <text class="commission-label">累计直属业绩</text>
            <text class="commission-value">{{ commissionData.directPerformance }}</text>
          </view>
          <view class="commission-info">
            <text class="commission-label">奖励</text>
            <text class="commission-value">{{ commissionData.directReward }}</text>
          </view>
          <view class="commission-info">
            <text class="commission-label">已领取</text>
            <text class="commission-value">{{ commissionData.directClaimed }}</text>
          </view>
          <view class="commission-info">
            <text class="commission-label">待领取</text>
            <text class="commission-value highlight">{{ commissionData.directPending }}</text>
          </view>
          <wd-button size="small" type="primary" class="claim-btn">领取</wd-button>
        </view>
      </view>

      <!-- 推广注册 -->
      <view class="promotion-register">
        <view class="promotion-header">
          <text class="promotion-title">推广注册 开奖满100万人</text>
          <wd-icon name="arrow-right" size="16rpx" color="#666" />
        </view>
        <view class="promotion-stats">
          <view class="stat-group">
            <text class="stat-label">邀请有效人数</text>
            <text class="stat-value">{{ promotionStats.validInvites }}</text>
          </view>
          <view class="stat-group">
            <text class="stat-label">奖励</text>
            <text class="stat-value">{{ promotionStats.registerReward }}</text>
          </view>
          <view class="stat-group">
            <text class="stat-label">已领取</text>
            <text class="stat-value">{{ promotionStats.registerClaimed }}</text>
          </view>
          <view class="stat-group">
            <text class="stat-label">待领取</text>
            <text class="stat-value highlight">{{ promotionStats.registerPending }}</text>
          </view>
        </view>
        <wd-button size="small" type="primary" class="claim-btn">领取</wd-button>
      </view>

      <!-- 代理日佣金 -->
      <view class="daily-commission">
        <view class="daily-header">
          <text class="daily-title">代理日佣金</text>
          <wd-icon name="arrow-right" size="16rpx" color="#666" />
        </view>
        <view class="daily-stats">
          <view class="stat-group">
            <text class="stat-label">代理总数</text>
            <text class="stat-value">{{ dailyCommission.totalAgents }}</text>
          </view>
          <view class="stat-group">
            <text class="stat-label">奖励</text>
            <text class="stat-value">{{ dailyCommission.reward }}</text>
          </view>
          <view class="stat-group">
            <text class="stat-label">已领取</text>
            <text class="stat-value">{{ dailyCommission.claimed }}</text>
          </view>
          <view class="stat-group">
            <text class="stat-label">待领取</text>
            <text class="stat-value highlight">{{ dailyCommission.pending }}</text>
          </view>
        </view>
        <wd-button size="small" type="primary" class="claim-btn">领取</wd-button>
      </view>
    </view>

    <wd-toast />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'wot-design-uni'

const toast = useToast()

// 代理信息
const agentInfo = ref({
  account: '464015851',
  level: '全民代理',
  auditMultiple: '1.00',
  settlementCycle: '日结'
})

// 推广统计数据
const promotionStats = ref({
  totalInvites: 156, // 累计邀请人数
  validInvites: 0,
  registerReward: '0.00',
  registerClaimed: '0.00',
  registerPending: '0.00'
})

// 佣金数据
const totalEarnings = ref('0.00')
const commissionData = ref({
  directPerformance: '0.00',
  directReward: '0.00',
  directClaimed: '0.00',
  directPending: '0.00'
})

// 代理日佣金
const dailyCommission = ref({
  totalAgents: '0.00',
  reward: '0.00',
  claimed: '0.00',
  pending: '0.00'
})

// 推广链接
const promoLink = ref('https://aa1.pg7313.vip/?id=7o9gx7')

// 显示账号提示
const showAccountTip = () => {
  uni.showModal({
    title: '代理账号说明',
    content: '这是您的专属代理账号，用于推广和获取佣金。',
    showCancel: false
  })
}

// 复制推广链接
const copyLink = () => {
  uni.setClipboardData({
    data: promoLink.value,
    success: () => {
      toast.success('推广链接已复制到剪贴板')
    }
  })
}

// 复制邀请码
const copyInviteCode = () => {
  uni.setClipboardData({
    data: agentInfo.value.account,
    success: () => {
      toast.success('邀请码已复制到剪贴板')
    }
  })
}

// 保存二维码
const saveQRCode = () => {
  toast.success('二维码保存功能开发中')
}

// 分享到社交媒体
const shareToSocial = (platform: string) => {
  const platformNames = {
    wechat: '微信',
    moments: '朋友圈',
    qq: 'QQ',
    facebook: 'Facebook',
    telegram: 'Telegram'
  }
  toast.success(`分享到${platformNames[platform]}功能开发中`)
}

// 导航到其他页面
const navigateToSection = (section: string) => {
  uni.$emit('switchTab', section)
}
</script>

<style lang="scss" scoped>
.home-content {
  background-color: #f5f7fa;
  min-height: 100vh;
  color: #1d2129;
}

/* 代理信息区域 */
.agent-info-section {
  padding: 24rpx;
  background-color: #ffffff;
  margin: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.agent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.agent-id {
  display: flex;
  align-items: center;
  gap: 8rpx;

  .id-text {
    font-size: 32rpx;
    font-weight: bold;
    color: var(--primary-color, #165dff);
  }
}

.agent-level {
  text-align: right;

  .level-text {
    display: block;
    font-size: 24rpx;
    color: var(--text-secondary, #86909c);
    margin-bottom: 4rpx;
  }

  .level-value {
    font-size: 28rpx;
    color: var(--primary-color, #165dff);
    font-weight: 500;
  }
}

.agent-details {
  display: flex;
  justify-content: space-between;
}

.detail-item {
  text-align: center;

  .detail-label {
    display: block;
    font-size: 24rpx;
    color: var(--text-secondary, #86909c);
    margin-bottom: 8rpx;
  }

  .detail-value {
    font-size: 28rpx;
    color: var(--text-primary, #1d2129);
    font-weight: 500;
  }
}

/* 邀请好友区域 */
.invite-section {
  display: flex;
  justify-content: space-around;
  padding: 24rpx;
  background-color: #ffffff;
  margin: 0 20rpx 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.invite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.invite-title {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--text-primary, #1d2129);
}

.invite-code-display {
  display: flex;
  align-items: center;
  gap: 8rpx;

  .invite-code-label {
    font-size: 24rpx;
    color: var(--text-secondary, #86909c);
  }

  .invite-code-value {
    font-size: 28rpx;
    font-weight: bold;
    color: var(--primary-color, #165dff);
    margin-right: 8rpx;
  }
}

/* 二维码和链接区域 */
.qr-link-section {
  padding: 24rpx;
  background-color: #ffffff;
  margin: 0 20rpx 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.qr-container {
  text-align: center;
  margin-bottom: 30rpx;
}

.qr-code {
  width: 200rpx;
  height: 200rpx;
  background-color: var(--bg-light, #f2f3f5);
  border: 2rpx dashed var(--border-color, #e5e6eb);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

  text {
    color: var(--text-secondary, #86909c);
    font-size: 24rpx;
  }
}

.link-container {
  .link-input-wrapper {
    display: flex;
    align-items: center;
    background-color: var(--bg-light, #f2f3f5);
    border-radius: 8rpx;
    padding: 0 16rpx;
    margin-bottom: 20rpx;
    border: 1rpx solid var(--border-color, #e5e6eb);

    .promo-input {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-primary, #1d2129);
    }
  }
}

.share-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  justify-content: center;
}

.share-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 20rpx;
  background-color: var(--bg-light, #f2f3f5);
  border: 1rpx solid var(--border-color, #e5e6eb);
  border-radius: 8rpx;
  min-width: 120rpx;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
    background-color: var(--primary-color, #165dff);
    border-color: var(--primary-color, #165dff);

    text {
      color: #ffffff;
    }
  }

  text {
    font-size: 22rpx;
    color: var(--text-primary, #1d2129);
    margin-top: 8rpx;
  }
}

/* 收益统计区域 */
.earnings-section {
  padding: 0 20rpx;
}

.earnings-header {
  padding: 40rpx 24rpx;
  background-color: #ffffff;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.earnings-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.earnings-item {
  text-align: center;
  flex: 1;

  .earnings-title {
    display: block;
    font-size: 28rpx;
    color: var(--text-secondary, #86909c);
    margin-bottom: 12rpx;
  }

  .earnings-amount {
    font-size: 48rpx;
    font-weight: bold;
    color: var(--warning-color, #ff7d00);

    &.invite-count {
      color: var(--primary-color, #165dff);
    }
  }
}

/* 佣金详情 */
.commission-details {
  margin-bottom: 20rpx;
}

.commission-item {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  position: relative;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.commission-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;

  &:last-of-type {
    margin-bottom: 20rpx;
  }

  .commission-label {
    font-size: 26rpx;
    color: var(--text-secondary, #86909c);
  }

  .commission-value {
    font-size: 26rpx;
    color: var(--text-primary, #1d2129);

    &.highlight {
      color: var(--warning-color, #ff7d00);
      font-weight: bold;
    }
  }
}

.claim-btn {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
}

/* 推广注册 */
.promotion-register {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  position: relative;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.promotion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;

  .promotion-title {
    font-size: 28rpx;
    color: var(--text-primary, #1d2129);
    font-weight: 500;
  }
}

.promotion-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.stat-group {
  display: flex;
  justify-content: space-between;

  .stat-label {
    font-size: 24rpx;
    color: var(--text-secondary, #86909c);
  }

  .stat-value {
    font-size: 24rpx;
    color: var(--text-primary, #1d2129);

    &.highlight {
      color: var(--warning-color, #ff7d00);
      font-weight: bold;
    }
  }
}

/* 代理日佣金 */
.daily-commission {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  position: relative;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.daily-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;

  .daily-title {
    font-size: 28rpx;
    color: var(--text-primary, #1d2129);
    font-weight: 500;
  }
}

.daily-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

/* 响应式优化 */
@media (max-width: 750rpx) {
  .promotion-stats,
  .daily-stats {
    grid-template-columns: 1fr;
    gap: 12rpx;
  }

  .agent-details {
    flex-direction: column;
    gap: 16rpx;
  }

  .share-buttons {
    justify-content: space-between;
  }

  .agent-info-section,
  .invite-section,
  .qr-link-section {
    margin: 0 10rpx 20rpx;
  }

  .earnings-section {
    padding: 0 10rpx;
  }
}

/* 动画效果 */
.agent-info-section,
.invite-section,
.qr-link-section,
.earnings-header,
.commission-item,
.promotion-register,
.daily-commission {
  animation: fadeIn 0.3s ease-out;
}

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

/* 按钮样式优化 */
.claim-btn {
  background-color: var(--primary-color, #165dff) !important;
  border-color: var(--primary-color, #165dff) !important;
  color: #ffffff !important;
  border-radius: 8rpx;
  transition: opacity 0.3s;

  &:active {
    opacity: 0.8;
  }
}

/* 图标颜色优化 */
:deep(.wd-icon) {
  color: var(--text-secondary, #86909c);
}

/* 输入框样式优化 */
:deep(.wd-input) {
  background-color: transparent;
}

:deep(.wd-input__inner) {
  background-color: transparent;
  color: var(--text-primary, #1d2129);
}
</style>
