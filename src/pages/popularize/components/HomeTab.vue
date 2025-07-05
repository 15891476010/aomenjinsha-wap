<template>
  <view class="home-tab">
    <!-- 代理信息 -->
    <wd-cell-group title="代理信息" border>
      <wd-cell title="代理账号" :value="agentInfo.account || '-'">
        <template #right-icon>
          <wd-icon name="question-circle" size="16px" color="#999" @click="showAccountTip" />
        </template>
      </wd-cell>
      <wd-cell title="代理模式" :value="agentInfo.mode" />
      <wd-cell title="稽核倍数" :value="agentInfo.auditMultiple || '-'" />
      <wd-cell title="结算周期" :value="agentInfo.settlementCycle" />
    </wd-cell-group>

    <!-- 推广链接分享 -->
    <wd-cell-group title="推广链接" border>
      <view class="share-section">
        <wd-button type="primary" block @click="savePromoLink" custom-style="margin-bottom: 20rpx;">
          点击保存
        </wd-button>
        
        <wd-cell title="推广链接" :value="promoLink" is-link @click="copyLink">
          <template #right-icon>
            <wd-icon name="copy" size="16px" color="#165DFF" />
          </template>
        </wd-cell>

        <!-- 社交媒体分享网格 -->
        <view class="social-share">
          <view class="share-title">分享到</view>
          <wd-grid :column="3" border class="share-grid">
            <wd-grid-item
              v-for="(social, index) in socialPlatforms.slice(0, 6)"
              :key="index"
              :text="social.name"
              clickable
              @itemclick="shareToSocial(social)"
            >
              <template #icon>
                <wd-img :src="social.icon" width="32rpx" height="32rpx" mode="aspectFit" />
              </template>
            </wd-grid-item>
          </wd-grid>
        </view>
      </view>
    </wd-cell-group>
  </view>
</template>

<script lang="ts" setup>
import { useToast } from 'wot-design-uni'

// 接收父组件传递的数据
const props = defineProps<{
  agentInfo: {
    account: string
    mode: string
    auditMultiple: string
    settlementCycle: string
  }
  promoLink: string
  socialPlatforms: Array<{
    name: string
    icon: string
    type: string
  }>
}>()

// 定义事件
const emit = defineEmits<{
  showAccountTip: []
  savePromoLink: []
  copyLink: []
  shareToSocial: [social: any]
}>()

// Toast 实例
const toast = useToast()

/**
 * 显示账号提示
 */
const showAccountTip = () => {
  emit('showAccountTip')
}

/**
 * 保存推广链接
 */
const savePromoLink = () => {
  emit('savePromoLink')
}

/**
 * 复制推广链接
 */
const copyLink = () => {
  emit('copyLink')
}

/**
 * 分享到社交媒体
 */
const shareToSocial = (social: any) => {
  emit('shareToSocial', social)
}
</script>

<style lang="scss" scoped>
.home-tab {
  // 分享区域
  .share-section {
    padding: 20rpx 0;
    
    // 确保按钮在小屏幕上可点击
    :deep(.wd-button) {
      min-height: 88rpx;
      font-size: 32rpx;
    }
  }

  .share-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #1d2129;
    margin: 20rpx 0;
    text-align: center;
  }

  .social-share {
    margin-top: 20rpx;
    
    .share-grid {
      // 网格容器优化
      :deep(.wd-grid) {
        .wd-grid-item {
          // 增加点击区域
          .wd-grid-item__content {
            min-height: 100rpx;
            padding: 16rpx 8rpx;
            transition: all 0.3s ease;
            
            &:active {
              transform: scale(0.95);
              background-color: rgba(22, 93, 255, 0.1);
            }
          }
          
          // 图标容器
          .wd-grid-item__icon {
            margin-bottom: 8rpx;
          }
          
          // 文字样式
          .wd-grid-item__text {
            font-weight: 500;
            color: #4e5969;
            font-size: 24rpx;
          }
        }
      }
    }
  }
}
</style>
