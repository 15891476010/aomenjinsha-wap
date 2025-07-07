<template>
  <view class="share-page">
    <!-- 代理信息区域 -->
    <view class="agent-info-section">
      <view class="info-row">
        <view class="info-item">
          <text class="info-label">代理账号</text>
          <view class="info-value-with-icon">
            <text class="info-value">{{ agentInfo.account }}</text>
            <wd-icon name="help" size="24rpx" color="#86909c" @click="showAccountHelp" />
          </view>
        </view>
        <view class="info-item">
          <text class="info-label">代理模式</text>
          <text class="info-value">{{ agentInfo.mode }}</text>
        </view>
      </view>
      <view class="info-row">
        <view class="info-item">
          <text class="info-label">稽核倍数</text>
          <text class="info-value">{{ agentInfo.auditMultiple }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">结算周期</text>
          <text class="info-value">{{ agentInfo.settlementCycle }}</text>
        </view>
      </view>
    </view>

    <!-- 推广链接区域 -->
    <view class="promo-link-section">
      <wd-button
        type="primary"
        size="large"
        class="save-btn"
        @click="savePromoLink"
      >
        点击保存
      </wd-button>

      <view class="link-container">
        <view class="link-display">
          <text class="link-text">{{ promoLink }}</text>
          <wd-icon name="copy" size="32rpx" color="var(--primary-color)" @click="copyLink" />
        </view>
        <view class="qr-code">
          <canvas
            canvas-id="qrcode"
            class="qr-canvas"
            @tap="saveQRCode"
          ></canvas>
        </view>
      </view>

      <!-- 社交分享按钮 -->
      <view class="social-share-grid">
        <view
          class="share-item"
          v-for="platform in socialPlatforms"
          :key="platform.type"
          @click="shareToSocial(platform)"
        >
          <wd-icon :name="platform.icon" size="48rpx" :color="platform.color" />
          <text class="share-name">{{ platform.name }}</text>
        </view>
      </view>
    </view>

    <!-- 推广教程区域 -->
    <view class="tutorial-section">
      <view class="tutorial-header">
        <text class="tutorial-title">推广教程</text>
      </view>

      <view class="tutorial-content">
        <!-- 佣金计算图表 -->
        <view class="commission-chart">
          <view class="chart-level level-a">
            <view class="user-node">
              <view class="user-avatar">
                <wd-icon name="user" size="32rpx" color="#165dff" />
              </view>
              <text class="user-name">A</text>
            </view>
            <view class="commission-info">
              <text class="performance-text">直属业绩 500+3000+2000=5500</text>
              <text class="commission-text">直属佣金 5500*10%=<text class="highlight">550</text></text>
              <text class="commission-text">其他佣金<text class="highlight">30</text>+<text class="highlight">60</text>+<text class="highlight">600</text>=<text class="highlight">690</text></text>
              <text class="commission-text">本期佣金<text class="highlight">550</text>+<text class="highlight">690</text>=<text class="highlight">1240</text></text>
            </view>
          </view>

          <view class="chart-connections">
            <view class="connection-line"></view>
          </view>

          <view class="chart-level level-b">
            <view class="user-group">
              <view class="user-node">
                <view class="user-avatar">
                  <wd-icon name="user" size="28rpx" color="#52c41a" />
                </view>
                <text class="user-name">B1</text>
                <text class="bet-amount">有效投注 500</text>
              </view>
              <view class="user-node">
                <view class="user-avatar">
                  <wd-icon name="user" size="28rpx" color="#52c41a" />
                </view>
                <text class="user-name">B2</text>
                <text class="bet-amount">有效投注 3000</text>
              </view>
              <view class="user-node">
                <view class="user-avatar">
                  <wd-icon name="user" size="28rpx" color="#52c41a" />
                </view>
                <text class="user-name">B3</text>
                <text class="bet-amount">有效投注 2000</text>
              </view>
            </view>
          </view>

          <view class="chart-level level-c">
            <view class="user-group">
              <view class="user-node">
                <view class="user-avatar">
                  <wd-icon name="user" size="24rpx" color="#faad14" />
                </view>
                <text class="user-name">C1</text>
                <text class="bet-amount">有效投注 1000</text>
              </view>
              <view class="user-node">
                <view class="user-avatar">
                  <wd-icon name="user" size="24rpx" color="#faad14" />
                </view>
                <text class="user-name">C2</text>
                <text class="bet-amount">有效投注 2000</text>
              </view>
              <view class="user-node">
                <view class="user-avatar">
                  <wd-icon name="user" size="24rpx" color="#faad14" />
                </view>
                <text class="user-name">C3</text>
                <text class="bet-amount">有效投注 20000</text>
              </view>
            </view>
          </view>

          <view class="chart-level level-n">
            <view class="user-node">
              <view class="user-avatar">
                <wd-icon name="user" size="20rpx" color="#86909c" />
              </view>
              <text class="user-name">N</text>
              <text class="unlimited-text">(无数下级)</text>
              <text class="description-text">每一级都可给A贡献业绩和佣金，且不限下级层数，越多越好</text>
            </view>
          </view>
        </view>

        <!-- 详细说明文档 -->
        <view class="tutorial-document">
          <view class="doc-title">
            <text class="title-text">举例说明如下：</text>
          </view>

          <view class="doc-content">
            <text class="doc-paragraph">
              假设当前有效投注的返佣比例为10%(即来自直属下级)，跨级部分额外佣金为比例中的比例(站长额外赠送)，赠送比例为30%，A是第一个发现商机的，马上发展了B1、B2和B3；B1又往下发展了C1和C2；B2无下级；B3往下发展了C3，第二天B1的有效投注为500，B2的有效投注为3000，B3的有效投注为2000，C1的有效投注为1000，C2的有效投注为2000，C3的有效投注为20000。那么他们之间的收益计算方式如下：
            </text>

            <view class="calculation-section">
              <view class="calc-title">
                <text class="calc-title-text">1、A的收益计算方式如下：</text>
              </view>

              <view class="calc-items">
                <view class="calc-item">
                  <text class="calc-label">(1)A说明：</text>
                  <text class="calc-desc">A的佣金来源除了直属下级B1、B2和B3贡献，还有来自其他下级C1、C2和C3贡献;</text>
                </view>

                <view class="calc-item">
                  <text class="calc-label">(2)A的直属业绩：</text>
                  <text class="calc-desc">即A的直属下级B1、B2和B3给A贡献的业绩，计算公式为：直属业绩=B1有效投注+B2有效投注+B3有效投注=500+3000+2000=5500；</text>
                </view>

                <view class="calc-item">
                  <text class="calc-label">(3)A的直属佣金：</text>
                  <text class="calc-desc">直属佣金=直属业绩*返佣比例=5500*10%=<text class="highlight">550</text>；</text>
                </view>

                <view class="calc-item">
                  <text class="calc-label">(4)A的其他佣金：</text>
                  <text class="calc-desc">即来自C1、C2和C3以及D1贡献佣金，计算公式为：其他佣金=(C1有效投注+C2有效投注+C3有效投注)*返佣比例*赠送比例=(1000+2000+20000)*10%*30%=690；</text>
                </view>

                <view class="calc-item">
                  <text class="calc-label">(5)A的本期佣金：</text>
                  <text class="calc-desc">本期佣金=直属佣金+其他佣金=<text class="highlight">550</text>+<text class="highlight">690</text>=<text class="highlight">1240</text>。</text>
                </view>
              </view>
            </view>

            <view class="calculation-section">
              <view class="calc-title">
                <text class="calc-title-text">2、B1的收益计算方式如下：</text>
              </view>

              <view class="calc-items">
                <view class="calc-item">
                  <text class="calc-label">(1)B1说明：</text>
                  <text class="calc-desc">B1的佣金来源于其直属下级C1和C2贡献；</text>
                </view>

                <view class="calc-item">
                  <text class="calc-label">(2)B1的直属业绩：</text>
                  <text class="calc-desc">即B1的直属下级C1、C2给A贡献的业绩，计算公式为：直属业绩=C1有效投注+C2有效投注=1000+2000=3000；</text>
                </view>

                <view class="calc-item">
                  <text class="calc-label">(3)B1的直属佣金：</text>
                  <text class="calc-desc">直属佣金=直属业绩*返佣比例=3000*10%=<text class="highlight">300</text>；</text>
                </view>

                <view class="calc-item">
                  <text class="calc-label">(4)B1的其他佣金：</text>
                  <text class="calc-desc">因C1和C2没有发展下级，故B1没有其他佣金；即其他佣金=<text class="highlight">0</text>；</text>
                </view>

                <view class="calc-item">
                  <text class="calc-label">(5)B1的本期佣金：</text>
                  <text class="calc-desc">本期佣金=直属佣金+其他佣金=300+0=300。</text>
                </view>
              </view>
            </view>

            <view class="calculation-section">
              <view class="calc-title">
                <text class="calc-title-text">3、B2的收益计算方式如下：</text>
              </view>

              <view class="calc-items">
                <view class="calc-item">
                  <text class="calc-label">(1)B2说明：</text>
                  <text class="calc-desc">因为B2没有下级，所以B2没有佣金，即B2的本期佣金=0。</text>
                </view>
              </view>
            </view>

            <view class="calculation-section">
              <view class="calc-title">
                <text class="calc-title-text">4、B3的收益计算方式如下：</text>
              </view>

              <view class="calc-items">
                <view class="calc-item">
                  <text class="calc-label">(1)B3说明：</text>
                  <text class="calc-desc">B3的佣金来源于其直属下级C3贡献；</text>
                </view>

                <view class="calc-item">
                  <text class="calc-label">(2)B3的直属业绩：</text>
                  <text class="calc-desc">即B3的直属下级C3给B3贡献的业绩，计算公式为：直属业绩=C3有效投注=20000=20000；</text>
                </view>

                <view class="calc-item">
                  <text class="calc-label">(3)B3的直属佣金：</text>
                  <text class="calc-desc">直属佣金=直属业绩*返佣比例=20000*10%=<text class="highlight">2000</text>；</text>
                </view>

                <view class="calc-item">
                  <text class="calc-label">(4)B3的其他佣金：</text>
                  <text class="calc-desc">因C3没有发展下级，故B3没有其他佣金；即其他佣金=<text class="highlight">0</text>；</text>
                </view>

                <view class="calc-item">
                  <text class="calc-label">(5)B3的本期佣金：</text>
                  <text class="calc-desc">本期佣金=直属佣金+其他佣金=<text class="highlight">2000</text>+<text class="highlight">0</text>=<text class="highlight">2000</text>。</text>
                </view>
              </view>
            </view>

            <view class="calculation-section">
              <view class="calc-title">
                <text class="calc-title-text">5、全民代理补充说明：</text>
              </view>

              <view class="calc-items">
                <view class="calc-item">
                  <text class="calc-desc">因全民代理代理模式可以发展无限下级，即N代表无限级，即可横向发展同时也可以纵向发展；为了便于解说，本文只取2层结构作为例子阐述。</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'wot-design-uni'

// Toast 实例
const toast = useToast()

// 代理信息
const agentInfo = ref({
  account: '464015851',
  mode: '全民代理',
  auditMultiple: '1.00',
  settlementCycle: '日结'
})

// 推广链接
const promoLink = ref('https://e1.pg1513.vip')

// 社交媒体平台
const socialPlatforms = ref([
  { name: '分享', icon: 'share', type: 'share', color: '#165dff' },
  { name: 'Wechat', icon: 'wechat', type: 'wechat', color: '#07c160' },
  { name: '朋友圈', icon: 'wechat-moments', type: 'moments', color: '#07c160' },
  { name: 'QQ', icon: 'qq', type: 'qq', color: '#12b7f5' },
  { name: 'Facebook', icon: 'facebook', type: 'facebook', color: '#1877f2' },
  { name: 'Telegram', icon: 'telegram', type: 'telegram', color: '#0088cc' },
  { name: 'WhatsApp', icon: 'whatsapp', type: 'whatsapp', color: '#25d366' },
  { name: 'Line', icon: 'line', type: 'line', color: '#00c300' }
])

/**
 * 显示代理账号帮助
 */
const showAccountHelp = () => {
  uni.showModal({
    title: '代理账号说明',
    content: '这是您的专属代理账号，用于推广和获取佣金。通过此账号推广的用户将成为您的下级，您可以获得相应的佣金收益。',
    showCancel: false,
    confirmText: '我知道了'
  })
}

/**
 * 保存推广链接
 */
const savePromoLink = () => {
  uni.setClipboardData({
    data: promoLink.value,
    success: () => {
      toast.success('推广链接已保存到剪贴板')
    },
    fail: () => {
      toast.error('保存失败，请重试')
    }
  })
}

/**
 * 复制链接
 */
const copyLink = () => {
  uni.setClipboardData({
    data: promoLink.value,
    success: () => {
      toast.success('推广链接已复制')
    }
  })
}

/**
 * 保存二维码
 */
const saveQRCode = () => {
  toast.success('二维码已保存到相册')
}

/**
 * 分享到社交媒体
 */
const shareToSocial = (platform: any) => {
  switch (platform.type) {
    case 'share':
      uni.share({
        provider: 'system',
        type: 0,
        href: promoLink.value,
        title: '邀请您一起来玩游戏',
        summary: '精彩游戏等你来体验！',
        success: () => {
          toast.success('分享成功')
        }
      })
      break
    case 'wechat':
      toast.success('正在分享到微信')
      break
    case 'moments':
      toast.success('正在分享到朋友圈')
      break
    case 'qq':
      toast.success('正在分享到QQ')
      break
    case 'facebook':
      toast.success('正在分享到Facebook')
      break
    case 'telegram':
      toast.success('正在分享到Telegram')
      break
    case 'whatsapp':
      toast.success('正在分享到WhatsApp')
      break
    case 'line':
      toast.success('正在分享到Line')
      break
    default:
      toast.success(`正在分享到${platform.name}`)
  }
}

/**
 * 生成二维码
 */
const generateQRCode = () => {
  // 这里应该使用二维码生成库，暂时用canvas模拟
  const ctx = uni.createCanvasContext('qrcode')
  ctx.setFillStyle('#000000')
  ctx.fillRect(0, 0, 100, 100)
  ctx.draw()
}

// 页面加载时生成二维码
onMounted(() => {
  generateQRCode()
})
</script>

<style lang="scss" scoped>
.share-page {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 20rpx;
}

/* 代理信息区域 */
.agent-info-section {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.info-item {
  flex: 1;
  display: flex;
  flex-direction: column;

  &:not(:last-child) {
    margin-right: 40rpx;
  }
}

.info-label {
  font-size: 24rpx;
  color: var(--text-secondary, #86909c);
  margin-bottom: 8rpx;
}

.info-value {
  font-size: 28rpx;
  color: var(--text-primary, #1d2129);
  font-weight: 500;
}

.info-value-with-icon {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

/* 推广链接区域 */
.promo-link-section {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.save-btn {
  width: 100%;
  margin-bottom: 24rpx;
  height: 80rpx !important;
  font-size: 28rpx !important;
}

.link-container {
  display: flex;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.link-display {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx;
  background-color: #f8f9fa;
  border-radius: 8rpx;
  border: 1rpx solid #e9ecef;
}

.link-text {
  flex: 1;
  font-size: 24rpx;
  color: var(--text-primary, #1d2129);
  margin-right: 16rpx;
  word-break: break-all;
}

.qr-code {
  width: 120rpx;
  height: 120rpx;
  background-color: #f8f9fa;
  border-radius: 8rpx;
  border: 1rpx solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-canvas {
  width: 100rpx;
  height: 100rpx;
}

/* 社交分享网格 */
.social-share-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.share-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx;
  background-color: #f8f9fa;
  border-radius: 8rpx;
  transition: background-color 0.3s;

  &:active {
    background-color: #e9ecef;
  }
}



.share-name {
  font-size: 22rpx;
  color: var(--text-primary, #1d2129);
  text-align: center;
}

/* 推广教程区域 */
.tutorial-section {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.tutorial-header {
  margin-bottom: 24rpx;
}

.tutorial-title {
  font-size: 32rpx;
  font-weight: bold;
  color: var(--text-primary, #1d2129);
}

.tutorial-content {
  padding: 20rpx 0;
}

/* 佣金计算图表 */
.commission-chart {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.chart-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.level-a {
  .user-node {
    margin-bottom: 16rpx;
  }

  .commission-info {
    background-color: #f0f8ff;
    padding: 16rpx;
    border-radius: 8rpx;
    border: 1rpx solid #e6f7ff;
  }
}

.user-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12rpx;
  background-color: #f8f9fa;
  border-radius: 8rpx;
  border: 1rpx solid #e9ecef;
  min-width: 120rpx;
}

.user-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  margin-bottom: 8rpx;
  background-color: #f0f8ff;
  border: 1rpx solid #e6f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 24rpx;
  font-weight: bold;
  color: var(--text-primary, #1d2129);
  margin-bottom: 4rpx;
}

.bet-amount {
  font-size: 20rpx;
  color: var(--text-secondary, #86909c);
}

.user-group {
  display: flex;
  gap: 20rpx;
  justify-content: center;
  flex-wrap: wrap;
}

.commission-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.performance-text,
.commission-text {
  font-size: 24rpx;
  color: var(--text-primary, #1d2129);
  line-height: 1.4;
}

.highlight {
  color: var(--warning-color, #ff7d00);
  font-weight: bold;
}

.unlimited-text {
  font-size: 20rpx;
  color: var(--text-secondary, #86909c);
  margin-bottom: 8rpx;
}

.description-text {
  font-size: 22rpx;
  color: var(--text-regular, #4e5969);
  text-align: center;
  line-height: 1.4;
  max-width: 400rpx;
}

.chart-connections {
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.connection-line {
  width: 2rpx;
  height: 30rpx;
  background-color: #d9d9d9;
}

/* 教程文档样式 */
.tutorial-document {
  margin-top: 40rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #e9ecef;
}

.doc-title {
  margin-bottom: 20rpx;
}

.title-text {
  font-size: 28rpx;
  font-weight: bold;
  color: var(--text-primary, #1d2129);
}

.doc-content {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.doc-paragraph {
  font-size: 26rpx;
  color: var(--text-regular, #4e5969);
  line-height: 1.6;
  text-align: justify;
}

.calculation-section {
  background-color: #f8f9fa;
  border-radius: 8rpx;
  padding: 20rpx;
  border: 1rpx solid #e9ecef;
}

.calc-title {
  margin-bottom: 16rpx;
}

.calc-title-text {
  font-size: 26rpx;
  font-weight: bold;
  color: var(--text-primary, #1d2129);
}

.calc-items {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.calc-item {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.calc-label {
  font-size: 24rpx;
  font-weight: bold;
  color: var(--text-primary, #1d2129);
}

.calc-desc {
  font-size: 24rpx;
  color: var(--text-regular, #4e5969);
  line-height: 1.5;
  text-align: justify;
}
</style>
