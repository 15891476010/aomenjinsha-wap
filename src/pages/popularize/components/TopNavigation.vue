<template>
  <view class="page-container">
    <!-- 固定的顶部导航栏 -->
    <view class="top-navigation">
      <wd-tabs
        v-model="activeTab"
        slidable="always"
        animated
        swipeable
        :line-width="60"
        :line-height="4"
        @change="handleTabChange"
      >
        <wd-tab
          v-for="tab in tabs"
          :key="tab.name"
          :title="tab.title"
          :name="tab.name"
        />
      </wd-tabs>
    </view>

    <!-- 页面内容区域 -->
    <view class="tab-content">
      <view v-if="activeTab === 'home'">
        <HomePage />
      </view>
      <view v-else-if="activeTab === 'share'">
        <SharePage />
      </view>
      <view v-else-if="activeTab === 'data'">
        <DataPage />
      </view>
      <view v-else-if="activeTab === 'performance'">
        <PerformancePage />
      </view>
      <view v-else-if="activeTab === 'commission'">
        <CommissionPage />
      </view>
      <view v-else-if="activeTab === 'subordinates'">
        <SubordinatesPage />
      </view>
      <view v-else-if="activeTab === 'subordinatesBet'">
        <SubordinatesBetPage />
      </view>
      <view v-else-if="activeTab === 'subordinatesFinance'">
        <SubordinatesFinancePage />
      </view>
      <view v-else-if="activeTab === 'subordinatesReward'">
        <SubordinatesRewardPage />
      </view>
      <view v-else-if="activeTab === 'commissionRate'">
        <CommissionRatePage />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 导入主要页面组件
import HomePage from '../home/content.vue'
import SharePage from '../share/index.vue'
import DataPage from '../data/index.vue'
import PerformancePage from '../performance/index.vue'
import CommissionPage from '../commission/index.vue'
import SubordinatesPage from '../subordinates/index.vue'
import SubordinatesBetPage from '../subordinatesBet/index.vue'
import SubordinatesFinancePage from '../subordinatesFinance/index.vue'
import SubordinatesRewardPage from '../subordinatesReward/index.vue'
import CommissionRatePage from '../commissionRate/index.vue'

// 当前激活的标签
const activeTab = ref('home')

// 标签页配置
const tabs = [
  { name: 'home', title: '首页' },
  { name: 'share', title: '推广分享' },
  { name: 'data', title: '我的数据' },
  { name: 'performance', title: '我的业绩' },
  { name: 'commission', title: '我的佣金' },
  { name: 'subordinates', title: '下级信息' },
  { name: 'subordinatesBet', title: '下级投注' },
  { name: 'subordinatesFinance', title: '下级财务' },
  { name: 'subordinatesReward', title: '下级领取' },
  { name: 'commissionRate', title: '返佣比例' }
]

// 处理标签切换
const handleTabChange = (tabName: string) => {
  activeTab.value = tabName
  console.log('切换到标签:', tabName)
}

onMounted(() => {
  // 获取URL参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = (currentPage as any).options || {}

  // 如果有type参数，设置当前标签
  if (options.type) {
    activeTab.value = options.type
  }

  // 监听标签切换事件
  uni.$on('switchTab', (tabName: string) => {
    activeTab.value = tabName
  })

  console.log('当前标签:', activeTab.value)
})
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.top-navigation {
  position: fixed;
  top: 85rpx; /* 状态栏 + 导航栏高度 */
  left: 0;
  right: 0;
  width: 100%;
  background-color: #ffffff;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  /* 强制隐藏所有滚动条 */
  * {
    &::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }
}

.tab-content {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-top: 100rpx; /* 状态栏 + 导航栏 + tabs高度 */
}

:deep(.wd-tabs) {
  background-color: #ffffff;
  border-bottom: 1px solid #e4e7ed;
}

/* 全局隐藏滚动条样式 */
:deep(.wd-tabs),
:deep(.wd-tabs *) {
  /* Webkit内核浏览器 */
  &::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }

  /* Firefox */
  scrollbar-width: none !important;

  /* IE */
  -ms-overflow-style: none !important;
}

/* 针对可能的滚动容器 */
:deep(.wd-tabs__header),
:deep(.wd-tabs__nav-wrap),
:deep(.wd-tabs__nav),
:deep(.wd-tabs__content) {
  &::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

:deep(.wd-tab) {
  font-size: 14px;
  color: #606266;

  &.is-active {
    color: #409eff;
    font-weight: 500;
  }
}

:deep(.wd-tabs__line) {
  background-color: #409eff;
}
</style>
