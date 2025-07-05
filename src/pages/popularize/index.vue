<template>
  <view class="popularize-page">
    <!-- 标签页导航 -->
    <wd-tabs v-model="activeTab" sticky animated>
      <wd-tab
        v-for="(tab, index) in tabs"
        :key="index"
        :title="tab.title"
        :name="tab.name"
      >
        <view class="tab-content">
          <!-- 首页标签页 -->
          <HomeTab
            v-if="tab.name === 'home'"
            :agent-info="agentInfo"
            :promo-link="promoLink"
            :social-platforms="socialPlatforms"
            @show-account-tip="showAccountTip"
            @save-promo-link="savePromoLink"
            @copy-link="copyLink"
            @share-to-social="shareToSocial"
          />

          <!-- 推广分享标签页 -->
          <ShareTab
            v-else-if="tab.name === 'share'"
            :promo-link="promoLink"
            :social-platforms="socialPlatforms"
            @save-promo-link="savePromoLink"
            @copy-link="copyLink"
            @share-to-social="shareToSocial"
          />

          <!-- 我的数据标签页 -->
          <DataTab
            v-else-if="tab.name === 'data'"
            :data-items="dataItems"
          />

          <!-- 我的业绩标签页 -->
          <PerformanceTab
            v-else-if="tab.name === 'performance'"
            :performance-items="performanceItems"
          />

          <!-- 我的佣金标签页 -->
          <CommissionTab
            v-else-if="tab.name === 'commission'"
            :commission-items="commissionItems"
            @withdraw-commission="withdrawCommission"
          />

          <!-- 其他标签页 -->
          <DefaultTab
            v-else
            :title="getTabTitle(tab.name)"
          />
        </view>
      </wd-tab>
    </wd-tabs>



    <!-- 二维码弹窗 -->
    <wd-popup v-model="showQRPopup" position="center" closable>
      <view class="qr-content">
        <view class="qr-title">推广二维码</view>
        <view class="qr-code">
          <text>二维码占位</text>
        </view>
      </view>
    </wd-popup>

    <!-- Toast 组件 -->
    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'wot-design-uni'
import HomeTab from './components/HomeTab.vue'
import ShareTab from './components/ShareTab.vue'
import DataTab from './components/DataTab.vue'
import PerformanceTab from './components/PerformanceTab.vue'
import CommissionTab from './components/CommissionTab.vue'
import DefaultTab from './components/DefaultTab.vue'

// Toast 实例
const toast = useToast()

// 当前激活的标签页
const activeTab = ref('home')

// 二维码弹窗显示状态
const showQRPopup = ref(false)

// 标签页配置
const tabs = ref([
  { title: '首页', name: 'home' },
  { title: '推广分享', name: 'share' },
  { title: '我的数据', name: 'data' },
  { title: '我的业绩', name: 'performance' },
  { title: '我的佣金', name: 'commission' },
  { title: '下级信息', name: 'subordinates' },
  { title: '下级投注', name: 'subordinatesBet' },
  { title: '下级财务', name: 'subordinatesFinance' },
  { title: '下级领取', name: 'subordinatesWithdraw' },
  { title: '返佣比例', name: 'commissionRate' }
])

// 代理信息
const agentInfo = ref({
  account: 'AG123456',
  mode: '全民代理',
  auditMultiple: '1',
  settlementCycle: '日结'
})

// 推广链接
const promoLink = ref('https://e1.pg1513.vip')

// 社交媒体平台
const socialPlatforms = ref([
  { name: '分享', icon: '/static/icons/share.svg', type: 'share' },
  { name: '微信', icon: '/static/icons/weixin.png', type: 'wechat' },
  { name: '朋友圈', icon: '/static/icons/weixin.png', type: 'moments' },
  { name: 'QQ', icon: '/static/icons/share.svg', type: 'qq' },
  { name: 'Facebook', icon: '/static/icons/share.svg', type: 'facebook' },
  { name: 'Telegram', icon: '/static/icons/share.svg', type: 'telegram' }
])

// 我的数据
const dataItems = computed(() => [
  { label: '今日新增下级', value: '5' },
  { label: '累计下级人数', value: '128' },
  { label: '今日下级投注', value: '12,580.00' },
  { label: '累计下级投注', value: '1,258,000.00' }
])

// 业绩数据
const performanceItems = computed(() => [
  { label: '本月业绩', value: '58,600.00' },
  { label: '累计业绩', value: '1,286,500.00' },
  { label: '直属业绩', value: '45,200.00' },
  { label: '团队业绩', value: '13,400.00' }
])

// 佣金数据
const commissionItems = computed(() => [
  { label: '今日佣金', value: '1,240.00' },
  { label: '本月佣金', value: '15,680.00' },
  { label: '累计佣金', value: '128,500.00' },
  { label: '可提取佣金', value: '8,500.00' }
])

/**
 * 返回上一页
 */
const goBack = () => {
  uni.navigateBack()
}

/**
 * 显示账号提示
 */
const showAccountTip = () => {
  toast.show({
    msg: '代理账号是您的唯一推广标识'
  })
}

/**
 * 保存推广链接
 */
const savePromoLink = () => {
  toast.show({
    msg: '推广链接已保存'
  })
}

/**
 * 复制推广链接
 */
const copyLink = () => {
  // #ifdef H5
  if (navigator.clipboard) {
    navigator.clipboard.writeText(promoLink.value).then(() => {
      toast.show({
        msg: '链接已复制到剪贴板'
      })
    }).catch(() => {
      toast.show({
        msg: '复制失败，请手动复制'
      })
    })
  } else {
    toast.show({
      msg: '请手动复制链接'
    })
  }
  // #endif

  // #ifdef APP-PLUS || MP
  uni.setClipboardData({
    data: promoLink.value,
    success: () => {
      toast.show({
        msg: '链接已复制到剪贴板'
      })
    },
    fail: () => {
      toast.show({
        msg: '复制失败'
      })
    }
  })
  // #endif
}

/**
 * 分享到社交媒体
 */
const shareToSocial = (social: any) => {
  const shareData = {
    title: '邀请您一起赚钱',
    desc: '点击链接注册即可获得丰厚奖励',
    link: promoLink.value
  }

  switch (social.type) {
    case 'share':
      // 通用分享
      // #ifdef H5
      if (navigator.share) {
        navigator.share({
          title: shareData.title,
          text: shareData.desc,
          url: shareData.link
        })
      } else {
        copyLink()
      }
      // #endif

      // #ifdef APP-PLUS || MP
      uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        href: shareData.link,
        title: shareData.title,
        summary: shareData.desc,
        success: () => {
          toast.show({
            msg: '分享成功'
          })
        },
        fail: () => {
          toast.show({
            msg: '分享失败'
          })
        }
      })
      // #endif
      break

    case 'wechat':
      toast.show({
        msg: '请在微信中打开分享'
      })
      break

    default:
      toast.show({
        msg: `分享到${social.name}`
      })
      break
  }
}

/**
 * 提取佣金
 */
const withdrawCommission = () => {
  const availableCommission = parseFloat(commissionItems.value.find(item => item.label === '可提取佣金')?.value || '0')

  if (availableCommission <= 0) {
    toast.show({
      msg: '暂无可提取佣金'
    })
    return
  }

  // 跳转到提现页面
  uni.navigateTo({
    url: '/pages/tixian/index'
  })
}

/**
 * 获取标签页标题
 */
const getTabTitle = (name: string) => {
  const tab = tabs.value.find(t => t.name === name)
  return tab?.title || '未知'
}

onMounted(() => {
  // 页面初始化
  console.log('推广页面已加载')
})
</script>

<style lang="scss" scoped>
.popularize-page {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;

  // 强制隐藏标签页导航的滚动条
  :deep(.wd-tabs) {
    // 隐藏所有可能的滚动条容器
    .wd-tabs__nav,
    .wd-tabs__nav-wrap,
    .wd-tabs__scroll,
    .wd-tabs__header {
      &::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }

      // 兼容Firefox
      scrollbar-width: none !important;

      // 兼容IE
      -ms-overflow-style: none !important;
    }
  }

  // 通用滚动条隐藏 - 针对所有可能的滚动元素
  :deep(*) {
    &::-webkit-scrollbar {
      display: none !important;
    }
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }
}

// 标签页内容
.tab-content {
  padding: 20rpx;
  padding-bottom: 100rpx;

  // 平滑滚动
  scroll-behavior: smooth;

  // 优化触摸滚动
  -webkit-overflow-scrolling: touch;
}



// 二维码弹窗
.qr-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx;
  width: 400rpx;
  background-color: #ffffff;

  .qr-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #1d2129;
    margin-bottom: 40rpx;
  }

  .qr-code {
    width: 240rpx;
    height: 240rpx;
    background-color: #f7f8fa;
    border: 1px solid #e5e6eb;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40rpx;

    text {
      color: #86909c;
      font-size: 28rpx;
    }
  }
}

// 响应式设计
@media (max-width: 750rpx) {
  .tab-content {
    padding: 16rpx;
    padding-bottom: 80rpx;
  }
}

// 小屏幕设备 (手机竖屏)
@media (max-width: 480rpx) {
  .tab-content {
    padding: 12rpx;
    min-height: calc(100vh - 180rpx);
  }

  .share-title {
    font-size: 26rpx;
    margin: 12rpx 0;
  }

  // 分享区域优化
  .share-section {
    padding: 16rpx 0;

    :deep(.wd-button) {
      min-height: 80rpx;
      font-size: 28rpx;
    }
  }

  .social-share {
    :deep(.wd-grid) {
      .wd-grid-item {
        .wd-grid-item__content {
          padding: 16rpx 8rpx;
        }

        .wd-grid-item__text {
          font-size: 22rpx;
        }
      }
    }
  }

  .example-diagram {
    .level-row {
      gap: 12rpx;

      .user-node {
        min-width: 100rpx;
        padding: 12rpx;

        &.primary {
          .user-info {
            gap: 6rpx;
          }
        }

        .user-avatar {
          width: 36rpx;
          height: 36rpx;
          font-size: 22rpx;
          margin-bottom: 8rpx;
        }

        .user-info text,
        text {
          font-size: 20rpx;
          line-height: 1.3;
        }
      }
    }
  }

  .tutorial-text {
    margin-top: 32rpx;

    .tutorial-section {
      margin-bottom: 24rpx;

      .section-title {
        font-size: 26rpx;
        margin-bottom: 12rpx;
      }

      .section-content {
        font-size: 24rpx;
        line-height: 1.5;
        margin-bottom: 10rpx;
      }
    }
  }

  :deep(.data-grid-item) {
    .wd-grid-item__content {
      padding: 24rpx 16rpx;
    }

    .data-value {
      font-size: 32rpx;
    }

    .wd-grid-item__text {
      font-size: 24rpx;
    }
  }

  .commission-actions {
    padding: 16rpx;
  }

  .qr-content {
    padding: 32rpx;
    width: 320rpx;

    .qr-title {
      font-size: 32rpx;
      margin-bottom: 32rpx;
    }

    .qr-code {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 32rpx;

      text {
        font-size: 24rpx;
      }
    }
  }
}

// 大屏幕设备 (平板横屏)
@media (min-width: 1024rpx) {
  .popularize-page {
    max-width: 1200rpx;
    margin: 0 auto;
  }

  .tab-content {
    max-width: 800rpx;
    margin: 0 auto;
    padding: 40rpx;
    min-height: calc(100vh - 240rpx);
  }

  // 分享区域在大屏幕上的布局
  .share-section {
    padding: 32rpx 0;

    :deep(.wd-button) {
      max-width: 400rpx;
      margin: 0 auto 32rpx;
      display: block;
    }
  }

  .social-share {
    :deep(.wd-grid) {
      max-width: 600rpx;
      margin: 0 auto;
    }
  }

  .example-diagram {
    .level-row {
      justify-content: space-around;
      max-width: 800rpx;
      margin: 0 auto 32rpx;

      .user-node {
        min-width: 160rpx;
        padding: 24rpx;

        .user-avatar {
          width: 56rpx;
          height: 56rpx;
          font-size: 32rpx;
        }

        .user-info text,
        text {
          font-size: 28rpx;
        }
      }
    }
  }

  .tutorial-text {
    max-width: 700rpx;
    margin: 40rpx auto 0;
  }

  :deep(.data-grid-item) {
    .wd-grid-item__content {
      padding: 40rpx 32rpx;
    }

    .data-value {
      font-size: 48rpx;
    }

    .wd-grid-item__text {
      font-size: 32rpx;
    }
  }

  .qr-content {
    padding: 64rpx;
    width: 500rpx;

    .qr-title {
      font-size: 40rpx;
      margin-bottom: 48rpx;
    }

    .qr-code {
      width: 280rpx;
      height: 280rpx;
      margin-bottom: 48rpx;

      text {
        font-size: 32rpx;
      }
    }
  }
}

// 横屏适配
@media (orientation: landscape) and (max-height: 600rpx) {
  .example-diagram {
    .level-row {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16rpx;

      .user-node {
        flex: 0 0 auto;
        min-width: 140rpx;
      }
    }
  }

  .tutorial-text {
    .tutorial-section {
      margin-bottom: 20rpx;

      .section-content {
        line-height: 1.4;
      }
    }
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .popularize-page {
    background-color: #1a1a1a;
    color: #ffffff;
  }

  .share-title {
    color: #ffffff;
  }

  .tutorial-content {
    .example-section {
      .example-title {
        color: #ffffff;
      }

      .user-node {
        background-color: #2d2d2d;
        border-color: #404040;
        color: #ffffff;

        &:not(.primary) {
          .user-avatar {
            background: linear-gradient(to right, #165DFF, #3175ea);
          }

          .user-info text,
          text {
            color: #cccccc;

            .highlight {
              color: #4fc3f7;
            }
          }
        }
      }
    }
  }

  .tutorial-text {
    .tutorial-section {
      .section-title {
        color: #ffffff;
      }

      .section-content {
        color: #cccccc;
      }
    }
  }

  .qr-content {
    background-color: #2d2d2d;

    .qr-title {
      color: #ffffff;
    }

    .qr-code {
      background-color: #404040;
      border-color: #555555;

      text {
        color: #999999;
      }
    }
  }
}

// 全局页面样式
page {
  color: #333333;
  background-color: #f5f7fa;

  // 优化字体渲染
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  // 优化触摸滚动
  -webkit-overflow-scrolling: touch;
}

// 全局强制隐藏所有滚动条
:deep(.wd-tabs),
:deep(.wd-tabs *),
:deep(.wd-tabs__nav),
:deep(.wd-tabs__nav-wrap),
:deep(.wd-tabs__scroll),
:deep(.wd-tabs__header) {
  &::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
  }

  // 兼容Firefox
  scrollbar-width: none !important;

  // 兼容IE
  -ms-overflow-style: none !important;
}

// 额外的通用滚动条隐藏
* {
  &::-webkit-scrollbar {
    display: none !important;
  }
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

// 通用响应式工具类
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 触摸设备优化
@media (hover: none) and (pointer: coarse) {
  // 移除悬停效果，增加点击反馈
  .social-share {
    :deep(.wd-grid) {
      .wd-grid-item {
        .wd-grid-item__content {
          &:hover {
            transform: none;
          }

          &:active {
            transform: scale(0.95);
            background-color: rgba(22, 93, 255, 0.1);
          }
        }
      }
    }
  }

  :deep(.data-grid-item) {
    .wd-grid-item__content {
      &:hover {
        transform: none;
        box-shadow: 0 4rpx 12rpx rgba(22, 93, 255, 0.3);
      }

      &:active {
        transform: scale(0.98);
      }
    }
  }

  .user-node {
    &:active {
      transform: scale(0.98);
    }
  }
}

// 键盘导航优化
.social-share :deep(.wd-grid-item),
.data-grid-item,
.user-node {
  &:focus {
    outline: 2px solid #165DFF;
    outline-offset: 2rpx;
  }
}

// 高分辨率屏幕优化
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .user-avatar {
    border: 1rpx solid rgba(255, 255, 255, 0.1);
  }

  .user-node {
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  }
}

// 无障碍访问优化
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// 打印样式
@media print {
  .popularize-page {
    background: white !important;
    color: black !important;
  }

  .social-share,
  .commission-actions {
    display: none !important;
  }

  .tutorial-content {
    page-break-inside: avoid;
  }
}
</style>
