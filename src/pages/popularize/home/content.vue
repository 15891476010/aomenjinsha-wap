<template>
  <view class="home-content">
    <!-- 代理信息区域 -->
    <view class="agent-info-section">
      <view class="agent-row">
        <view class="agent-item">
          <text class="agent-label">代理账号</text>
          <view class="agent-value-row">
            <wd-icon name="copy" size="16rpx" color="var(--primary-color, #165dff)" @click="copyAgentAccount" />
            <text class="agent-value">{{ agentInfo.account }}</text>
            <wd-icon name="help" size="16rpx" color="var(--text-secondary, #86909c)" @click="showAccountTip" />
          </view>
        </view>
      </view>
      <view class="agent-row">
        <view class="agent-item">
          <text class="agent-label">代理模式</text>
          <text class="agent-value">{{ agentInfo.mode }}</text>
        </view>
      </view>
      <view class="agent-row">
        <view class="agent-item">
          <text class="agent-label">稽核倍数</text>
          <text class="agent-value">{{ agentInfo.auditMultiple }}</text>
        </view>
      </view>
      <view class="agent-row">
        <view class="agent-item">
          <text class="agent-label">结算周期</text>
          <text class="agent-value">{{ agentInfo.settlementCycle }}</text>
        </view>
      </view>
    </view>

    <!-- 邀请好友区域 -->
    <view class="invite-section">
      <view class="invite-header">
        <text class="invite-title">邀请好友</text>
        <view class="invite-code-display">
          <text class="invite-code-label">我的邀请码</text>
          <text class="invite-code-value">{{ agentInfo.account }}</text>
          <wd-icon name="copy" size="16rpx" color="var(--primary-color, #165dff)" @click="copyInviteCode" />
        </view>
      </view>
    </view>

    <!-- 二维码和推广链接区域 -->
    <view class="qr-link-section">
      <!-- 点击保存按钮 -->
      <view class="save-qr-section">
        <wd-button type="primary" @click="saveQRCode" class="save-btn">点击保存</wd-button>
      </view>

      <!-- 推广链接 -->
      <view class="link-section">
        <view class="link-display">
          <view class="link-input-wrapper">
            <text class="promo-link">{{ promoLink }}</text>
            <wd-icon name="copy" size="16rpx" color="var(--primary-color, #165dff)" @click="copyLink" />
          </view>
          <wd-icon name="qr-code" size="32rpx" color="var(--text-secondary, #86909c)" @click="showQRCode" />
        </view>
      </view>

      <!-- 分享按钮 -->
      <view class="share-buttons">
        <view class="share-btn" @click="shareGeneral">
          <wd-icon name="share" size="24rpx" />
          <text>分享</text>
        </view>
        <view class="share-btn" @click="shareToWechat">
          <wd-icon name="wechat" size="24rpx" />
          <text>Wechat</text>
        </view>
        <view class="share-btn" @click="shareToMoments">
          <wd-icon name="moments" size="24rpx" />
          <text>WeChat Moments</text>
        </view>
        <view class="share-btn" @click="shareToQQ">
          <wd-icon name="qq" size="24rpx" />
          <text>QQ</text>
        </view>
        <view class="share-btn" @click="shareToFacebook">
          <wd-icon name="facebook" size="24rpx" />
          <text>Facebook</text>
        </view>
        <view class="share-btn" @click="shareToTelegram">
          <wd-icon name="telegram" size="24rpx" />
          <text>Telegram</text>
        </view>
        <view class="share-btn" @click="shareToWhatsApp">
          <wd-icon name="whatsapp" size="24rpx" />
          <text>WhatsApp</text>
        </view>
        <view class="share-btn" @click="shareToLine">
          <wd-icon name="line" size="24rpx" />
          <text>Line</text>
        </view>
      </view>
    </view>

    <!-- 累计获得和累计邀请区域 -->
    <view class="summary-section">
      <view class="summary-item">
        <text class="summary-label">累计获得</text>
        <text class="summary-value">{{ totalEarnings }}</text>
      </view>
      <view class="summary-item">
        <text class="summary-label">累计邀请人数</text>
        <text class="summary-value invite-count">{{ promotionStats.totalInvites }}</text>
      </view>
    </view>

    <!-- 我的佣金区域 -->
    <view class="commission-section">
      <view class="commission-header">
        <view class="commission-title-row">
          <text class="commission-title">我的佣金</text>
          <view class="countdown-display">
            <text class="countdown-text">(距离下次结算</text>
            <text class="countdown-time">{{ settlementCountdown }}</text>
            <text class="countdown-text">)</text>
          </view>
        </view>
        <wd-icon name="arrow-right" size="16rpx" color="var(--text-secondary, #86909c)" />
      </view>

      <view class="commission-stats">
        <view class="commission-row">
          <view class="commission-item">
            <text class="commission-label">昨日直属业绩</text>
            <text class="commission-value">{{ commissionData.yesterdayPerformance }}</text>
          </view>
          <view class="commission-item">
            <text class="commission-label">累计佣金</text>
            <text class="commission-value">{{ commissionData.totalCommission }}</text>
          </view>
        </view>
        <view class="commission-row">
          <view class="commission-item">
            <text class="commission-label">已领取</text>
            <text class="commission-value">{{ commissionData.claimed }}</text>
          </view>
          <view class="commission-item">
            <text class="commission-label">待领取</text>
            <view class="commission-value-with-btn">
              <text class="commission-value highlight">{{ commissionData.pending }}</text>
              <wd-button
                type="primary"
                size="small"
                class="claim-btn"
                :disabled="commissionData.pending === '0.00'"
                @click="claimCommission"
              >
                领取
              </wd-button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 推广注册区域 -->
    <view class="promotion-register-section">
      <view class="promotion-header">
        <text class="promotion-title">推广注册 开宝箱 每邀请100元/人</text>
        <wd-icon name="arrow-right" size="16rpx" color="var(--text-secondary, #86909c)" />
      </view>

      <view class="promotion-stats">
        <view class="promotion-row">
          <view class="promotion-item">
            <text class="promotion-label">邀请有效人数</text>
            <text class="promotion-value">{{ promotionStats.validInvites }}</text>
          </view>
          <view class="promotion-item">
            <text class="promotion-label">奖励</text>
            <text class="promotion-value">{{ promotionStats.registerReward }}</text>
          </view>
        </view>
        <view class="promotion-row">
          <view class="promotion-item">
            <text class="promotion-label">已领取</text>
            <text class="promotion-value">{{ promotionStats.registerClaimed }}</text>
          </view>
          <view class="promotion-item">
            <text class="promotion-label">待领取</text>
            <view class="promotion-value-with-btn">
              <text class="promotion-value highlight">{{ promotionStats.registerPending }}</text>
              <wd-button
                type="primary"
                size="small"
                class="claim-btn"
                :disabled="promotionStats.registerPending === '0.00'"
                @click="claimRegisterReward"
              >
                领取
              </wd-button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 代理日俸禄区域 -->
    <view class="daily-salary-section">
      <view class="daily-header">
        <text class="daily-title">代理日俸禄</text>
        <wd-icon name="arrow-right" size="16rpx" color="var(--text-secondary, #86909c)" />
      </view>

      <view class="daily-stats">
        <view class="daily-row">
          <view class="daily-item">
            <text class="daily-label">代理返佣</text>
            <text class="daily-value">{{ dailyCommissionData.agentRebate }}</text>
          </view>
          <view class="daily-item">
            <text class="daily-label">奖励</text>
            <text class="daily-value">{{ dailyCommissionData.reward }}</text>
          </view>
        </view>
        <view class="daily-row">
          <view class="daily-item">
            <text class="daily-label">已领取</text>
            <text class="daily-value">{{ dailyCommissionData.claimed }}</text>
          </view>
          <view class="daily-item">
            <text class="daily-label">待领取</text>
            <view class="daily-value-with-btn">
              <text class="daily-value highlight">{{ dailyCommissionData.pending }}</text>
              <wd-button
                type="primary"
                size="small"
                class="claim-btn"
                :disabled="dailyCommissionData.pending === '0.00'"
                @click="claimDailyCommission"
              >
                领取
              </wd-button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 代理等级弹窗 -->
    <wd-popup v-model="showAgentLevelModal" position="center" :close-on-click-modal="true">
      <view class="agent-level-modal">
        <view class="modal-header">
          <text class="modal-title">代理等级</text>
          <wd-icon name="close" size="20rpx" color="var(--text-secondary, #86909c)" @click="closeAgentLevelModal" />
        </view>

        <view class="modal-subtitle">
          <text>晋级条件(晋级条件用户充值金额)</text>
        </view>

        <view class="level-list">
          <view
            v-for="level in agentLevels"
            :key="level.id"
            class="level-item"
            :class="{ 'current-level': level.id === currentAgentLevel }"
          >
            <view class="level-info">
              <view class="level-icon">
                <view class="level-badge" :style="{ backgroundColor: level.color }"></view>
                <text class="level-text">{{ level.name }}</text>
              </view>
              <text class="level-amount">{{ level.amount }}</text>
            </view>
          </view>
        </view>

        <view class="modal-footer">
          <view class="current-progress">
            <text class="progress-text">当前: {{ currentProgress }}</text>
            <text class="progress-text">目标: {{ targetProgress }}</text>
          </view>
          <wd-button type="primary" @click="closeAgentLevelModal" class="confirm-btn">
            确定
          </wd-button>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'wot-design-uni'

const toast = useToast()

// 代理信息
const agentInfo = ref({
  account: '464015851',
  mode: '全民代理',
  auditMultiple: '1.00',
  settlementCycle: '日结'
})

// 推广链接
const promoLink = ref('https://aa1.pg7313.vip/?dl=7o9gx7')

// 累计收益
const totalEarnings = ref('0.00')

// 推广统计数据
const promotionStats = ref({
  totalInvites: 0,
  validInvites: 0,
  registerReward: '0.00',
  registerClaimed: '0.00',
  registerPending: '0.00'
})

// 结算倒计时
const settlementCountdown = ref('0天 06:55:05')

// 佣金数据
const commissionData = ref({
  yesterdayPerformance: '0.00',
  totalCommission: '0.00',
  claimed: '0.00',
  pending: '0.00'
})

// 代理日佣金数据
const dailyCommissionData = ref({
  agentRebate: '0.00',
  reward: '0.00',
  claimed: '0.00',
  pending: '0.00'
})

// 代理等级弹窗相关
const showAgentLevelModal = ref(false)
const currentAgentLevel = ref(1)
const currentProgress = ref('0.00')
const targetProgress = ref('0.00')

// 代理等级数据
const agentLevels = ref([
  { id: 1, name: 'LV1', color: '#bdc3c7', amount: '0.00' },
  { id: 2, name: 'LV2', color: '#3498db', amount: '100.00' },
  { id: 3, name: 'LV3', color: '#2ecc71', amount: '300.00' },
  { id: 4, name: 'LV4', color: '#f39c12', amount: '500.00' },
  { id: 5, name: 'LV5', color: '#e67e22', amount: '800.00' },
  { id: 6, name: 'LV6', color: '#e74c3c', amount: '1,000.00' },
  { id: 7, name: 'LV7', color: '#9b59b6', amount: '10,000.00' },
  { id: 8, name: 'LV8', color: '#8e44ad', amount: '30,000.00' },
  { id: 9, name: 'LV9', color: '#34495e', amount: '50,000.00' },
  { id: 10, name: 'LV10', color: '#f1c40f', amount: '80,000.00' }
])

// 复制代理账号
const copyAgentAccount = () => {
  uni.setClipboardData({
    data: agentInfo.value.account,
    success: () => {
      toast.success('代理账号已复制到剪贴板')
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

// 复制推广链接
const copyLink = () => {
  uni.setClipboardData({
    data: promoLink.value,
    success: () => {
      toast.success('推广链接已复制到剪贴板')
    }
  })
}

// 保存二维码
const saveQRCode = () => {
  toast.info('二维码保存功能开发中')
}

// 显示二维码
const showQRCode = () => {
  toast.info('二维码显示功能开发中')
}

// 分享功能
const shareGeneral = () => {
  toast.info('分享功能开发中')
}

const shareToWechat = () => {
  toast.info('微信分享功能开发中')
}

const shareToMoments = () => {
  toast.info('朋友圈分享功能开发中')
}

const shareToQQ = () => {
  toast.info('QQ分享功能开发中')
}

const shareToFacebook = () => {
  toast.info('Facebook分享功能开发中')
}

const shareToTelegram = () => {
  toast.info('Telegram分享功能开发中')
}

const shareToWhatsApp = () => {
  toast.info('WhatsApp分享功能开发中')
}

const shareToLine = () => {
  toast.info('Line分享功能开发中')
}

// 领取佣金
const claimCommission = () => {
  toast.info('领取佣金功能开发中')
}

// 领取注册奖励
const claimRegisterReward = () => {
  toast.info('领取注册奖励功能开发中')
}

// 领取日佣金
const claimDailyCommission = () => {
  toast.info('领取日佣金功能开发中')
}

// 显示代理等级弹窗
const showAccountTip = () => {
  showAgentLevelModal.value = true
}

// 关闭代理等级弹窗
const closeAgentLevelModal = () => {
  showAgentLevelModal.value = false
}

onMounted(() => {
  // 初始化数据
})
</script>

<style lang="scss" scoped>
.home-content {
  background-color: var(--bg-gray, #f5f7fa);
  min-height: 100vh;
  padding-bottom: 40rpx;
}

/* 代理信息区域 */
.agent-info-section {
  background-color: #ffffff;
  margin: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.agent-row {
  padding: 24rpx;
  border-bottom: 1rpx solid var(--border-light, #f2f3f5);

  &:last-child {
    border-bottom: none;
  }
}

.agent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.agent-label {
  font-size: 28rpx;
  color: var(--text-primary, #1d2129);
}

.agent-value {
  font-size: 28rpx;
  color: var(--primary-color, #165dff);
  font-weight: 500;
}

.agent-value-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

/* 邀请好友区域 */
.invite-section {
  background-color: #ffffff;
  margin: 0 20rpx 20rpx;
  border-radius: 12rpx;
  padding: 24rpx;
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
}

.invite-code-label {
  font-size: 24rpx;
  color: var(--text-secondary, #86909c);
}

.invite-code-value {
  font-size: 28rpx;
  font-weight: bold;
  color: var(--primary-color, #165dff);
}

/* 二维码和推广链接区域 */
.qr-link-section {
  background-color: #ffffff;
  margin: 0 20rpx 20rpx;
  border-radius: 12rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.save-qr-section {
  margin-bottom: 24rpx;
}

.save-btn {
  width: 100%;
}

.link-section {
  margin-bottom: 24rpx;
}

.link-display {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  background-color: var(--bg-light, #f2f3f5);
  border-radius: 8rpx;
}

.link-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.promo-link {
  flex: 1;
  font-size: 26rpx;
  color: var(--text-primary, #1d2129);
  word-break: break-all;
}

.share-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.share-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 8rpx;
  background-color: var(--bg-light, #f2f3f5);
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
    background-color: var(--primary-color, #165dff);

    text {
      color: #ffffff;
    }
  }

  text {
    font-size: 22rpx;
    color: var(--text-primary, #1d2129);
    margin-top: 8rpx;
    text-align: center;
  }
}

/* 累计获得和累计邀请区域 */
.summary-section {
  display: flex;
  gap: 20rpx;
  margin: 0 20rpx 20rpx;
}

.summary-item {
  flex: 1;
  background-color: #ffffff;
  padding: 32rpx 24rpx;
  border-radius: 12rpx;
  text-align: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.summary-label {
  display: block;
  font-size: 26rpx;
  color: var(--text-secondary, #86909c);
  margin-bottom: 12rpx;
}

.summary-value {
  font-size: 40rpx;
  font-weight: bold;
  color: var(--warning-color, #ff7d00);

  &.invite-count {
    color: var(--primary-color, #165dff);
  }
}

/* 我的佣金区域 */
.commission-section {
  background-color: #ffffff;
  margin: 0 20rpx 20rpx;
  border-radius: 12rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.commission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.commission-title-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.commission-title {
  font-size: 28rpx;
  font-weight: bold;
  color: var(--text-primary, #1d2129);
}

.countdown-display {
  display: flex;
  align-items: center;
}

.countdown-text {
  font-size: 22rpx;
  color: var(--text-secondary, #86909c);
}

.countdown-time {
  font-size: 22rpx;
  color: var(--primary-color, #165dff);
  font-weight: 500;
}

.commission-stats {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.commission-row {
  display: flex;
  gap: 20rpx;
}

.commission-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.commission-label {
  font-size: 24rpx;
  color: var(--text-secondary, #86909c);
  margin-bottom: 8rpx;
}

.commission-value {
  font-size: 28rpx;
  color: var(--text-primary, #1d2129);
  font-weight: 500;

  &.highlight {
    color: var(--warning-color, #ff7d00);
    font-weight: bold;
  }
}

.commission-value-with-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.claim-btn {
  font-size: 22rpx !important;
  padding: 6rpx 12rpx !important;
  height: auto !important;
  min-height: auto !important;
}

/* 推广注册区域 */
.promotion-register-section {
  background-color: #ffffff;
  margin: 0 20rpx 20rpx;
  border-radius: 12rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.promotion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.promotion-title {
  font-size: 28rpx;
  font-weight: bold;
  color: var(--text-primary, #1d2129);
}

.promotion-stats {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.promotion-row {
  display: flex;
  gap: 20rpx;
}

.promotion-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.promotion-label {
  font-size: 24rpx;
  color: var(--text-secondary, #86909c);
  margin-bottom: 8rpx;
}

.promotion-value {
  font-size: 28rpx;
  color: var(--text-primary, #1d2129);
  font-weight: 500;

  &.highlight {
    color: var(--warning-color, #ff7d00);
    font-weight: bold;
  }
}

.promotion-value-with-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

/* 代理日俸禄区域 */
.daily-salary-section {
  background-color: #ffffff;
  margin: 0 20rpx 20rpx;
  border-radius: 12rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.daily-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.daily-title {
  font-size: 28rpx;
  font-weight: bold;
  color: var(--text-primary, #1d2129);
}

.daily-stats {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.daily-row {
  display: flex;
  gap: 20rpx;
}

.daily-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.daily-label {
  font-size: 24rpx;
  color: var(--text-secondary, #86909c);
  margin-bottom: 8rpx;
}

.daily-value {
  font-size: 28rpx;
  color: var(--text-primary, #1d2129);
  font-weight: 500;

  &.highlight {
    color: var(--warning-color, #ff7d00);
    font-weight: bold;
  }
}

.daily-value-with-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

/* 响应式优化 */
@media (max-width: 750rpx) {
  .share-buttons {
    grid-template-columns: repeat(3, 1fr);
  }

  .summary-section {
    flex-direction: column;
    gap: 16rpx;
  }

  .commission-row,
  .promotion-row,
  .daily-row {
    flex-direction: column;
    gap: 16rpx;
  }
}

/* 动画效果 */
.agent-info-section,
.invite-section,
.qr-link-section,
.summary-section > *,
.commission-section,
.promotion-register-section,
.daily-salary-section {
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

/* 代理等级弹窗样式 */
.agent-level-modal {
  width: 640rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 40rpx;
  overflow: hidden;
  color: #ffffff;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 32rpx 20rpx;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10rpx);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 32rpx;
    right: 32rpx;
    height: 1rpx;
    background: rgba(255, 255, 255, 0.2);
  }
}

.modal-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.modal-subtitle {
  padding: 24rpx 32rpx;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);

  text {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.4;
  }
}

.level-list {
  max-height: 480rpx;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.05);
  margin: 0 20rpx;
  border-radius: 24rpx;

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 6rpx;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3rpx;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3rpx;

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
}

.level-item {
  padding: 24rpx 28rpx;
  margin: 12rpx 16rpx;
  border-radius: 20rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10rpx);

  &.current-level {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    transform: scale(1.02);
    box-shadow: 0 8rpx 25rpx rgba(79, 172, 254, 0.4);

    .level-text {
      color: #ffffff;
      font-weight: 600;
    }

    .level-amount {
      color: #ffffff;
      text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
    }

    .level-badge {
      border-color: rgba(255, 255, 255, 0.8);
      box-shadow: 0 0 0 4rpx rgba(255, 255, 255, 0.2);
    }

    &::before {
      content: '✓';
      position: absolute;
      right: 20rpx;
      top: 50%;
      transform: translateY(-50%);
      font-size: 24rpx;
      color: #ffffff;
      font-weight: bold;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2rpx);
  }

  &:active {
    transform: scale(0.98);
  }
}

.level-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.level-icon {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.level-badge {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  border: 3rpx solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 6rpx;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.8;
  }
}

.level-text {
  font-size: 30rpx;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  letter-spacing: 1rpx;
}

.level-amount {
  font-size: 30rpx;
  color: #ffd700;
  font-weight: 600;
  text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.3);
}

.modal-footer {
  padding: 32rpx;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10rpx);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 32rpx;
    right: 32rpx;
    height: 1rpx;
    background: rgba(255, 255, 255, 0.2);
  }
}

.current-progress {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32rpx;
  padding: 20rpx 24rpx;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 24rpx;
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    pointer-events: none;
  }
}

.progress-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  position: relative;
  z-index: 1;

  &:last-child {
    color: #ffd700;
    font-weight: 600;
    text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
  }
}

.confirm-btn {
  width: 100%;
  height: 88rpx !important;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
  border: none !important;
  border-radius: 24rpx !important;
  font-size: 32rpx !important;
  font-weight: 600 !important;
  color: #ffffff !important;
  box-shadow: 0 8rpx 25rpx rgba(79, 172, 254, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 15rpx rgba(79, 172, 254, 0.6);

    &::before {
      left: 100%;
    }
  }
}

/* 弹窗遮罩层样式调整 */
:deep(.wd-popup) {
  border-radius: 50rpx !important;
  .wd-popup__modal {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4rpx);
  }
}

/* 关闭按钮样式优化 */
:deep(.wd-icon) {
  color: rgba(255, 255, 255, 0.8) !important;
  transition: all 0.3s ease;

  &:active {
    color: #ffffff !important;
    transform: scale(1.1);
  }
}

/* 弹窗动画效果 */
.agent-level-modal {
  animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalSlideIn {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(40rpx);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 等级项目动画 */
.level-item {
  animation: levelItemFadeIn 0.5s ease-out;
  animation-fill-mode: both;

  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.05}s;
    }
  }
}

@keyframes levelItemFadeIn {
  0% {
    opacity: 0;
    transform: translateX(-20rpx);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 渐变背景动画 */
.agent-level-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%,
    rgba(255, 255, 255, 0.1) 100%);
  background-size: 200% 200%;
  animation: shimmer 3s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes shimmer {
  0%, 100% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
}

/* 确保内容在动画层之上 */
.modal-header,
.modal-subtitle,
.level-list,
.modal-footer {
  position: relative;
  z-index: 1;
}
</style>
