<template>
  <view class="home-content">
    <view class="content">
      <!-- 代理信息卡片 -->
      <wd-card title="代理信息" class="agent-info-card">
        <template #extra>
          <wd-button size="small" type="info" @click="showAccountTip">
            <wd-icon name="help" size="16rpx" />
          </wd-button>
        </template>
        <wd-cell-group border>
          <wd-cell title="代理账号" :value="agentInfo.account" />
          <wd-cell title="代理模式" :value="agentInfo.mode" />
          <wd-cell title="审核倍数" :value="agentInfo.auditMultiple" />
          <wd-cell title="结算周期" :value="agentInfo.settlementCycle" />
        </wd-cell-group>
      </wd-card>

      <!-- 推广链接卡片 -->
      <wd-card title="推广链接" class="promo-link-card">
        <template #extra>
          <wd-button size="small" @click="savePromoLink">保存</wd-button>
        </template>
        <wd-input 
          v-model="promoLink" 
          readonly 
          placeholder="推广链接"
          suffix-icon="copy"
          @click-suffix-icon="copyLink"
        />
        <view class="qr-code-section">
          <text class="qr-title">推广二维码</text>
          <view class="qr-code">
            <text>二维码占位</text>
          </view>
          <wd-button type="primary" size="small" @click="saveQRCode">保存二维码</wd-button>
        </view>
      </wd-card>

      <!-- 社交媒体分享 -->
      <wd-card title="分享到社交媒体" class="social-share-card">
        <wd-grid :column="3" border>
          <wd-grid-item 
            v-for="platform in socialPlatforms" 
            :key="platform.type"
            @click="shareToSocial(platform)"
          >
            <wd-icon :name="platform.icon" size="48rpx" :color="platform.color" />
            <text class="platform-name">{{ platform.name }}</text>
          </wd-grid-item>
        </wd-grid>
      </wd-card>

      <!-- 快捷操作 -->
      <wd-card title="快捷操作" class="quick-actions-card">
        <wd-grid :column="2" border>
          <wd-grid-item @click="navigateToSection('data')">
            <wd-icon name="chart" size="48rpx" color="#409eff" />
            <text class="platform-name">我的数据</text>
          </wd-grid-item>
          <wd-grid-item @click="navigateToSection('performance')">
            <wd-icon name="trophy" size="48rpx" color="#67c23a" />
            <text class="platform-name">我的业绩</text>
          </wd-grid-item>
          <wd-grid-item @click="navigateToSection('commission')">
            <wd-icon name="money" size="48rpx" color="#e6a23c" />
            <text class="platform-name">我的佣金</text>
          </wd-grid-item>
          <wd-grid-item @click="navigateToSection('subordinates')">
            <wd-icon name="group" size="48rpx" color="#f56c6c" />
            <text class="platform-name">下级信息</text>
          </wd-grid-item>
        </wd-grid>
      </wd-card>
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
  account: 'AG123456',
  mode: '占成代理',
  auditMultiple: '1倍',
  settlementCycle: '日结'
})

// 推广链接
const promoLink = ref('https://e1.pg1513.vip/register?code=AG1234')

// 社交平台配置
const socialPlatforms = ref([
  { type: 'wechat', name: '微信', icon: 'chat', color: '#07c160' },
  { type: 'qq', name: 'QQ', icon: 'qq', color: '#12b7f5' },
  { type: 'weibo', name: '微博', icon: 'weibo', color: '#e6162d' }
])

// 显示账号提示
const showAccountTip = () => {
  uni.showModal({
    title: '代理账号说明',
    content: '这是您的专属代理账号，用于推广和获取佣金。',
    showCancel: false
  })
}

// 保存推广链接
const savePromoLink = () => {
  // 复制到剪贴板
  uni.setClipboardData({
    data: promoLink.value,
    success: () => {
      toast.success('推广链接已保存到剪贴板')
    }
  })
}

// 复制链接
const copyLink = () => {
  uni.setClipboardData({
    data: promoLink.value,
    success: () => {
      toast.success('链接已复制到剪贴板')
    }
  })
}

// 保存二维码
const saveQRCode = () => {
  toast.success('二维码保存功能开发中')
}

// 分享到社交媒体
const shareToSocial = (platform: any) => {
  toast.success(`分享到${platform.name}功能开发中`)
}

// 导航到其他页面
const navigateToSection = (section: string) => {
  // 触发自定义事件，让父组件切换标签
  uni.$emit('switchTab', section)
  toast.success(`正在切换到${section}页面`)
}
</script>

<style lang="scss" scoped>
.home-content {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.content {
  padding: 20rpx;
}

.agent-info-card,
.promo-link-card,
.social-share-card,
.quick-actions-card {
  margin-bottom: 24rpx;
}

.qr-code-section {
  margin-top: 32rpx;
  text-align: center;
}

.qr-title {
  display: block;
  font-size: 28rpx;
  color: #1d2129;
  margin-bottom: 24rpx;
  font-weight: 500;
}

.qr-code {
  width: 200rpx;
  height: 200rpx;
  background-color: #f2f3f5;
  border: 2rpx dashed #c9cdd4;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24rpx;
}

.qr-code text {
  color: #86909c;
  font-size: 28rpx;
}

.platform-name {
  font-size: 24rpx;
  color: #1d2129;
  margin-top: 8rpx;
  text-align: center;
}
</style>
