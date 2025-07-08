<template>
  <view class="data-page">
    <!-- 时间筛选区域 -->
    <view class="time-filter-section">
      <view class="filter-tabs">
        <view
          class="filter-tab"
          :class="{ active: activeTimeFilter === item.value }"
          v-for="item in timeFilters"
          :key="item.value"
          @click="switchTimeFilter(item.value)"
        >
          {{ item.label }}
        </view>
      </view>
    </view>

    <!-- 直属数据区域 -->
    <view class="direct-data-section">
      <view class="section-title">{{ currentTimeLabel }}直属数据</view>
      <view class="data-grid">
        <view
          class="data-item"
          v-for="item in directDataItems"
          :key="item.key"
          @click="item.clickable ? showDataDetail(item) : null"
        >
          <view class="data-label">{{ item.label }}</view>
          <view class="data-value" :class="{ clickable: item.clickable }">
            {{ item.value }}
            <wd-icon v-if="item.clickable" name="help" size="20rpx" color="#86909c" />
          </view>
        </view>
      </view>
    </view>

    <!-- 数据汇总区域 -->
    <view class="summary-section">
      <view class="section-header">
        <text class="section-title">数据汇总</text>
        <wd-icon name="help" size="24rpx" color="#86909c" @click="showSummaryHelp" />
      </view>

      <view class="summary-content">
        <!-- 人数统计 -->
        <view class="summary-row">
          <view class="summary-item">
            <view class="summary-label">团队人数</view>
            <view class="summary-value">{{ summaryData.teamCount }}</view>
          </view>
          <view class="summary-item">
            <view class="summary-label">直属人数</view>
            <view class="summary-value clickable" @click="showDirectDetail">
              {{ summaryData.directCount }}
              <wd-icon name="help" size="20rpx" color="#86909c" />
            </view>
          </view>
          <view class="summary-item">
            <view class="summary-label">其他人数</view>
            <view class="summary-value">{{ summaryData.otherCount }}</view>
          </view>
        </view>

        <!-- 业绩统计 -->
        <view class="summary-row">
          <view class="summary-item">
            <view class="summary-label">总业绩</view>
            <view class="summary-value">{{ summaryData.totalPerformance }}</view>
          </view>
          <view class="summary-item">
            <view class="summary-label">直属业绩</view>
            <view class="summary-value">{{ summaryData.directPerformance }}</view>
          </view>
          <view class="summary-item">
            <view class="summary-label">其他业绩</view>
            <view class="summary-value">{{ summaryData.otherPerformance }}</view>
          </view>
        </view>

        <!-- 佣金统计 -->
        <view class="summary-row">
          <view class="summary-item">
            <view class="summary-label">总佣金</view>
            <view class="summary-value">{{ summaryData.totalCommission }}</view>
          </view>
          <view class="summary-item">
            <view class="summary-label">直属佣金</view>
            <view class="summary-value">{{ summaryData.directCommission }}</view>
          </view>
          <view class="summary-item">
            <view class="summary-label">其他佣金</view>
            <view class="summary-value">{{ summaryData.otherCommission }}</view>
          </view>
        </view>

        <!-- 累计佣金统计 -->
        <view class="summary-row">
          <view class="summary-item">
            <view class="summary-label">累计佣金</view>
            <view class="summary-value">{{ summaryData.totalAccumulatedCommission }}</view>
          </view>
          <view class="summary-item">
            <view class="summary-label">已领取</view>
            <view class="summary-value">{{ summaryData.claimedCommission }}</view>
          </view>
          <view class="summary-item">
            <view class="summary-label">未领取</view>
            <view class="summary-value">{{ summaryData.unclaimedCommission }}</view>
          </view>
        </view>

        <!-- 充值提现统计 -->
        <view class="summary-row">
          <view class="summary-item">
            <view class="summary-label">累计直属充值</view>
            <view class="summary-value">{{ summaryData.totalDirectDeposit }}</view>
          </view>
          <view class="summary-item">
            <view class="summary-label">累计直属提现</view>
            <view class="summary-value">{{ summaryData.totalDirectWithdraw }}</view>
          </view>
          <view class="summary-item">
            <view class="summary-label">累计直属领取</view>
            <view class="summary-value">{{ summaryData.totalDirectClaim }}</view>
          </view>
        </view>

        <!-- 投注输赢统计 -->
        <view class="summary-row">
          <view class="summary-item">
            <view class="summary-label">累计直属有效投注</view>
            <view class="summary-value">{{ summaryData.totalDirectValidBet }}</view>
          </view>
          <view class="summary-item">
            <view class="summary-label">累计直属输赢</view>
            <view class="summary-value">{{ summaryData.totalDirectWinLoss }}</view>
          </view>
          <view class="summary-item">
            <!-- 空占位 -->
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'wot-design-uni'

// Toast 实例
const toast = useToast()

// 当前选中的时间筛选
const activeTimeFilter = ref('today')

// 时间筛选选项
const timeFilters = ref([
  { label: '今日', value: 'today' },
  { label: '昨日', value: 'yesterday' },
  { label: '本周', value: 'thisWeek' },
  { label: '上周', value: 'lastWeek' },
  { label: '本月', value: 'thisMonth' },
  { label: '上月', value: 'lastMonth' }
])

// 当前时间标签
const currentTimeLabel = computed(() => {
  const filter = timeFilters.value.find(item => item.value === activeTimeFilter.value)
  return filter ? filter.label : '今日'
})

// 直属数据项
const directDataItems = ref([
  { key: 'newDirect', label: '新增直属', value: '-', clickable: true },
  { key: 'firstDepositAmount', label: '首充金额', value: '-', clickable: false },
  { key: 'firstDepositCount', label: '首充人数', value: '-', clickable: true },
  { key: 'depositAmount', label: '充值金额', value: '-', clickable: false },
  { key: 'depositCount', label: '充值人次', value: '-', clickable: true },
  { key: 'withdrawAmount', label: '提现金额', value: '-', clickable: false },
  { key: 'withdrawCount', label: '提现次数', value: '-', clickable: true },
  { key: 'validBet', label: '有效投注', value: '-', clickable: true },
  { key: 'claimReward', label: '领取奖励', value: '-', clickable: true },
  { key: 'directWinLoss', label: '直属输赢', value: '-', clickable: false },
  { key: 'directPerformance', label: '直属业绩', value: '-', clickable: true },
  { key: 'totalCommission', label: '总佣金', value: '-', clickable: false }
])

// 数据汇总
const summaryData = ref({
  // 人数统计
  teamCount: '-',
  directCount: '-',
  otherCount: '-',

  // 业绩统计
  totalPerformance: '-',
  directPerformance: '-',
  otherPerformance: '-',

  // 佣金统计
  totalCommission: '-',
  directCommission: '-',
  otherCommission: '-',

  // 累计佣金统计
  totalAccumulatedCommission: '-',
  claimedCommission: '-',
  unclaimedCommission: '-',

  // 充值提现统计
  totalDirectDeposit: '-',
  totalDirectWithdraw: '-',
  totalDirectClaim: '-',

  // 投注输赢统计
  totalDirectValidBet: '-',
  totalDirectWinLoss: '-'
})

/**
 * 切换时间筛选
 */
const switchTimeFilter = (filterValue: string) => {
  activeTimeFilter.value = filterValue
  loadDataByTimeFilter(filterValue)
}

/**
 * 根据时间筛选加载数据
 */
const loadDataByTimeFilter = (filterValue: string) => {
  toast.loading('正在加载数据...')

  // 模拟数据加载
  setTimeout(() => {
    // 这里应该调用API获取对应时间段的数据
    // 暂时使用模拟数据
    updateDirectDataItems(filterValue)
    toast.success('数据加载完成')
  }, 1000)
}

/**
 * 更新直属数据项
 */
const updateDirectDataItems = (filterValue: string) => {
  // 根据不同时间段更新数据
  // 这里使用模拟数据，实际应该从API获取
  const mockData = {
    today: {
      newDirect: '0',
      firstDepositAmount: '0.00',
      firstDepositCount: '0',
      depositAmount: '0.00',
      depositCount: '0',
      withdrawAmount: '0.00',
      withdrawCount: '0',
      validBet: '0.00',
      claimReward: '0.00',
      directWinLoss: '0.00',
      directPerformance: '0.00',
      totalCommission: '0.00'
    },
    yesterday: {
      newDirect: '2',
      firstDepositAmount: '500.00',
      firstDepositCount: '1',
      depositAmount: '1,200.00',
      depositCount: '3',
      withdrawAmount: '800.00',
      withdrawCount: '2',
      validBet: '2,500.00',
      claimReward: '150.00',
      directWinLoss: '+320.00',
      directPerformance: '2,500.00',
      totalCommission: '250.00'
    }
  }

  const data = mockData[filterValue] || mockData.today

  directDataItems.value.forEach(item => {
    if (data[item.key]) {
      item.value = data[item.key]
    }
  })
}

/**
 * 显示数据详情
 */
const showDataDetail = (item: any) => {
  uni.showModal({
    title: item.label,
    content: `${item.label}的详细说明和计算方式...`,
    showCancel: false,
    confirmText: '我知道了'
  })
}

/**
 * 显示直属详情
 */
const showDirectDetail = () => {
  uni.showModal({
    title: '直属人数说明',
    content: '直属人数是指通过您的推广链接直接注册的用户数量，不包括下级的下级用户。',
    showCancel: false,
    confirmText: '我知道了'
  })
}

/**
 * 显示汇总帮助
 */
const showSummaryHelp = () => {
  uni.showModal({
    title: '数据汇总说明',
    content: '数据汇总展示了您团队的整体数据情况，包括人数、业绩、佣金等各项统计指标。',
    showCancel: false,
    confirmText: '我知道了'
  })
}
</script>

<style lang="scss" scoped>
.data-page {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

// 时间筛选区域
.time-filter-section {
  background-color: #ffffff;
  padding: 24rpx 32rpx;
  margin-bottom: 24rpx;

  .filter-tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .filter-tab {
      flex: 1;
      text-align: center;
      padding: 16rpx 8rpx;
      font-size: 28rpx;
      color: var(--text-secondary, #86909c);
      border-radius: 8rpx;
      transition: all 0.3s ease;

      &.active {
        color: var(--primary-color, #165dff);
        background-color: rgba(22, 93, 255, 0.1);
        font-weight: 600;
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }
}

// 直属数据区域
.direct-data-section {
  background-color: #ffffff;
  margin: 0 24rpx 24rpx;
  border-radius: 16rpx;
  padding: 32rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: var(--text-primary, #1d2129);
    margin-bottom: 32rpx;
  }

  .data-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32rpx 24rpx;

    .data-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      .data-label {
        font-size: 24rpx;
        color: var(--text-secondary, #86909c);
        margin-bottom: 12rpx;
        line-height: 1.4;
      }

      .data-value {
        font-size: 28rpx;
        font-weight: 600;
        color: var(--text-primary, #1d2129);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8rpx;

        &.clickable {
          color: var(--primary-color, #165dff);
          cursor: pointer;

          &:active {
            opacity: 0.7;
          }
        }
      }
    }
  }
}

// 数据汇总区域
.summary-section {
  background-color: #ffffff;
  margin: 0 24rpx;
  border-radius: 16rpx;
  padding: 32rpx;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: var(--text-primary, #1d2129);
    }
  }

  .summary-content {
    .summary-row {
      display: flex;
      margin-bottom: 32rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .summary-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        .summary-label {
          font-size: 24rpx;
          color: var(--text-secondary, #86909c);
          margin-bottom: 12rpx;
          line-height: 1.4;
        }

        .summary-value {
          font-size: 28rpx;
          font-weight: 600;
          color: var(--text-primary, #1d2129);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8rpx;

          &.clickable {
            color: var(--primary-color, #165dff);
            cursor: pointer;

            &:active {
              opacity: 0.7;
            }
          }
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 750rpx) {
  .direct-data-section .data-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24rpx 16rpx;
  }

  .summary-section .summary-content .summary-row {
    flex-direction: column;
    gap: 24rpx;

    .summary-item {
      flex-direction: row;
      justify-content: space-between;
      padding: 16rpx 0;
      border-bottom: 1rpx solid var(--border-color, #e5e6eb);

      &:last-child {
        border-bottom: none;
      }

      .summary-label {
        margin-bottom: 0;
        text-align: left;
      }

      .summary-value {
        text-align: right;
      }
    }
  }
}
</style>
