<template>
  <view class="performance-page">
    <view class="content">
      <!-- 业绩概览 -->
      <wd-card title="业绩概览" class="performance-overview-card">
        <wd-row :gutter="20">
          <wd-col :span="12" v-for="item in performanceItems" :key="item.label">
            <view class="performance-item">
              <wd-icon :name="item.icon" size="32rpx" color="#00b42a" />
              <text class="performance-value">¥{{ item.value }}</text>
              <text class="performance-label">{{ item.label }}</text>
            </view>
          </wd-col>
        </wd-row>
      </wd-card>

      <!-- 业绩排行 -->
      <wd-card title="业绩排行" class="performance-rank-card">
        <wd-cell-group border>
          <wd-cell 
            v-for="(rank, index) in performanceRanks" 
            :key="index"
            :title="`第${index + 1}名`"
            :value="`¥${rank.amount}`"
            :label="rank.period"
          >
            <template #icon>
              <wd-badge :value="index + 1" :type="index < 3 ? 'primary' : 'info'" />
            </template>
          </wd-cell>
        </wd-cell-group>
      </wd-card>

      <!-- 业绩详情 -->
      <wd-card title="业绩详情" class="performance-detail-card">
        <wd-collapse v-model="performanceCollapseValue">
          <wd-collapse-item title="投注业绩" name="bet">
            <wd-cell-group border>
              <wd-cell title="总投注金额" value="¥1,258,600" />
              <wd-cell title="有效投注" value="¥1,186,200" />
              <wd-cell title="投注次数" value="2,856次" />
              <wd-cell title="平均投注" value="¥441" />
            </wd-cell-group>
          </wd-collapse-item>
          <wd-collapse-item title="推广业绩" name="promotion">
            <wd-cell-group border>
              <wd-cell title="推广人数" value="128人" />
              <wd-cell title="活跃用户" value="96人" />
              <wd-cell title="转化率" value="75%" />
              <wd-cell title="留存率" value="68%" />
            </wd-cell-group>
          </wd-collapse-item>
          <wd-collapse-item title="团队业绩" name="team">
            <wd-cell-group border>
              <wd-cell title="团队总投注" value="¥2,856,800" />
              <wd-cell title="团队人数" value="256人" />
              <wd-cell title="活跃团队" value="186人" />
              <wd-cell title="团队层级" value="3层" />
            </wd-cell-group>
          </wd-collapse-item>
        </wd-collapse>
      </wd-card>

      <!-- 业绩趋势 -->
      <wd-card title="业绩趋势" class="performance-trend-card">
        <wd-tabs v-model="trendTab">
          <wd-tab title="日趋势" name="daily">
            <view class="trend-chart">
              <text class="chart-placeholder">业绩趋势图表</text>
              <text class="chart-desc">最近7天业绩呈上升趋势，增长率15.8%</text>
            </view>
          </wd-tab>
          <wd-tab title="周趋势" name="weekly">
            <view class="trend-chart">
              <text class="chart-placeholder">业绩趋势图表</text>
              <text class="chart-desc">最近4周业绩稳定增长，平均增长率12.3%</text>
            </view>
          </wd-tab>
          <wd-tab title="月趋势" name="monthly">
            <view class="trend-chart">
              <text class="chart-placeholder">业绩趋势图表</text>
              <text class="chart-desc">最近6个月业绩持续增长，累计增长68%</text>
            </view>
          </wd-tab>
        </wd-tabs>
      </wd-card>

      <!-- 业绩目标 -->
      <wd-card title="业绩目标" class="performance-target-card">
        <view class="target-item">
          <view class="target-header">
            <text class="target-title">本月目标</text>
            <text class="target-progress">75%</text>
          </view>
          <wd-progress :percentage="75" stroke-width="12rpx" />
          <view class="target-detail">
            <text class="target-current">当前：¥186,500</text>
            <text class="target-goal">目标：¥250,000</text>
          </view>
        </view>
        
        <view class="target-item">
          <view class="target-header">
            <text class="target-title">季度目标</text>
            <text class="target-progress">45%</text>
          </view>
          <wd-progress :percentage="45" stroke-width="12rpx" color="#ff7d00" />
          <view class="target-detail">
            <text class="target-current">当前：¥456,800</text>
            <text class="target-goal">目标：¥1,000,000</text>
          </view>
        </view>
      </wd-card>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <wd-button type="primary" block @click="viewDetailReport">
          <wd-icon name="chart" />
          查看详细报表
        </wd-button>
        <wd-button type="success" block @click="exportPerformance" style="margin-top: 20rpx;">
          <wd-icon name="download" />
          导出业绩数据
        </wd-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'wot-design-uni'

// Toast 实例
const toast = useToast()

// 业绩折叠面板
const performanceCollapseValue = ref(['bet'])

// 趋势标签页
const trendTab = ref('daily')

// 业绩数据
const performanceItems = ref([
  { label: '本月业绩', value: '186,500.00', icon: 'calendar' },
  { label: '累计业绩', value: '1,286,500.00', icon: 'star' },
  { label: '直属业绩', value: '145,200.00', icon: 'user' },
  { label: '团队业绩', value: '413,400.00', icon: 'team' }
])

// 业绩排行数据
const performanceRanks = ref([
  { amount: '1,286,500', period: '总业绩' },
  { amount: '186,500', period: '本月业绩' },
  { amount: '56,800', period: '本周业绩' },
  { amount: '8,500', period: '今日业绩' }
])



/**
 * 查看详细报表
 */
const viewDetailReport = () => {
  uni.navigateTo({
    url: '/pages/report/performance'
  })
}

/**
 * 导出业绩数据
 */
const exportPerformance = () => {
  toast.loading('正在导出业绩数据...')
  setTimeout(() => {
    toast.success('业绩数据导出成功')
  }, 2000)
}
</script>

<style lang="scss" scoped>
.performance-page {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.content {
  padding: 20rpx;
}

.performance-overview-card,
.performance-rank-card,
.performance-detail-card,
.performance-trend-card,
.performance-target-card {
  margin-bottom: 24rpx;
}

.performance-item {
  text-align: center;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.performance-value {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #00b42a;
  margin: 8rpx 0;
}

.performance-label {
  font-size: 24rpx;
  color: #86909c;
}

.trend-chart {
  padding: 40rpx;
  text-align: center;
  background-color: #f7f8fa;
  border-radius: 12rpx;
  margin: 20rpx 0;
}

.chart-placeholder {
  display: block;
  font-size: 28rpx;
  color: #86909c;
  margin-bottom: 16rpx;
}

.chart-desc {
  font-size: 24rpx;
  color: #1d2129;
}

.target-item {
  margin-bottom: 32rpx;
}

.target-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.target-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #1d2129;
}

.target-progress {
  font-size: 28rpx;
  font-weight: 600;
  color: #165dff;
}

.target-detail {
  display: flex;
  justify-content: space-between;
  margin-top: 12rpx;
}

.target-current,
.target-goal {
  font-size: 24rpx;
  color: #86909c;
}

.action-buttons {
  padding: 20rpx 0;
}
</style>
