<template>
  <view class="data-page">
    <view class="content">
      <!-- 数据概览 -->
      <wd-card title="数据概览" class="data-overview-card">
        <wd-row :gutter="20">
          <wd-col :span="12" v-for="item in dataItems" :key="item.label">
            <view class="data-item">
              <wd-icon :name="item.icon" size="32rpx" :color="item.color" />
              <text class="data-value">{{ item.value }}</text>
              <text class="data-label">{{ item.label }}</text>
            </view>
          </wd-col>
        </wd-row>
      </wd-card>

      <!-- 数据趋势 -->
      <wd-card title="数据趋势" class="data-trend-card">
        <wd-tabs v-model="dataTrendTab">
          <wd-tab title="今日" name="today">
            <view class="trend-content">
              <wd-cell-group border>
                <wd-cell title="新增下级" :value="`${todayData.newUsers}人`" />
                <wd-cell title="投注金额" :value="`¥${todayData.betAmount}`" />
                <wd-cell title="有效投注" :value="`¥${todayData.validBet}`" />
                <wd-cell title="盈亏金额" :value="`¥${todayData.profit}`" />
              </wd-cell-group>
            </view>
          </wd-tab>
          <wd-tab title="本周" name="week">
            <view class="trend-content">
              <wd-cell-group border>
                <wd-cell title="新增下级" :value="`${weekData.newUsers}人`" />
                <wd-cell title="投注金额" :value="`¥${weekData.betAmount}`" />
                <wd-cell title="有效投注" :value="`¥${weekData.validBet}`" />
                <wd-cell title="盈亏金额" :value="`¥${weekData.profit}`" />
              </wd-cell-group>
            </view>
          </wd-tab>
          <wd-tab title="本月" name="month">
            <view class="trend-content">
              <wd-cell-group border>
                <wd-cell title="新增下级" :value="`${monthData.newUsers}人`" />
                <wd-cell title="投注金额" :value="`¥${monthData.betAmount}`" />
                <wd-cell title="有效投注" :value="`¥${monthData.validBet}`" />
                <wd-cell title="盈亏金额" :value="`¥${monthData.profit}`" />
              </wd-cell-group>
            </view>
          </wd-tab>
        </wd-tabs>
      </wd-card>

      <!-- 下级用户分析 -->
      <wd-card title="下级用户分析" class="user-analysis-card">
        <wd-collapse v-model="userAnalysisValue">
          <wd-collapse-item title="活跃用户" name="active">
            <wd-cell-group border>
              <wd-cell title="今日活跃" value="28人" />
              <wd-cell title="本周活跃" value="96人" />
              <wd-cell title="本月活跃" value="156人" />
            </wd-cell-group>
          </wd-collapse-item>
          <wd-collapse-item title="用户等级分布" name="level">
            <wd-cell-group border>
              <wd-cell title="VIP1" value="45人" />
              <wd-cell title="VIP2" value="32人" />
              <wd-cell title="VIP3" value="18人" />
              <wd-cell title="VIP4+" value="12人" />
            </wd-cell-group>
          </wd-collapse-item>
          <wd-collapse-item title="地区分布" name="region">
            <wd-cell-group border>
              <wd-cell title="广东" value="35人" />
              <wd-cell title="江苏" value="28人" />
              <wd-cell title="浙江" value="22人" />
              <wd-cell title="其他" value="43人" />
            </wd-cell-group>
          </wd-collapse-item>
        </wd-collapse>
      </wd-card>

      <!-- 数据报表 -->
      <wd-card title="数据报表" class="data-report-card">
        <wd-cell-group border>
          <wd-cell title="详细报表" value="查看" is-link @click="viewDetailReport">
            <template #icon>
              <wd-icon name="chart" color="#165dff" />
            </template>
          </wd-cell>
          <wd-cell title="导出数据" value="Excel" is-link @click="exportData">
            <template #icon>
              <wd-icon name="download" color="#00b42a" />
            </template>
          </wd-cell>
          <wd-cell title="数据分析" value="AI分析" is-link @click="aiAnalysis">
            <template #icon>
              <wd-icon name="robot" color="#ff7d00" />
            </template>
          </wd-cell>
        </wd-cell-group>
      </wd-card>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'wot-design-uni'

// Toast 实例
const toast = useToast()

// 数据趋势标签页
const dataTrendTab = ref('today')

// 用户分析折叠面板
const userAnalysisValue = ref(['active'])

// 我的数据
const dataItems = ref([
  { label: '今日新增下级', value: '5', icon: 'add', color: '#00b42a' },
  { label: '累计下级人数', value: '128', icon: 'user', color: '#165dff' },
  { label: '今日下级投注', value: '12,580', icon: 'money', color: '#ff7d00' },
  { label: '累计下级投注', value: '1,258,000', icon: 'chart', color: '#f53f3f' }
])

// 趋势数据
const todayData = ref({
  newUsers: 5,
  betAmount: '12,580',
  validBet: '11,850',
  profit: '+2,680'
})

const weekData = ref({
  newUsers: 28,
  betAmount: '86,200',
  validBet: '81,500',
  profit: '+15,800'
})

const monthData = ref({
  newUsers: 128,
  betAmount: '1,258,600',
  validBet: '1,186,200',
  profit: '+186,500'
})



/**
 * 查看详细报表
 */
const viewDetailReport = () => {
  uni.navigateTo({
    url: '/pages/report/detail'
  })
}

/**
 * 导出数据
 */
const exportData = () => {
  toast.loading('正在导出数据...')
  setTimeout(() => {
    toast.success('数据导出成功')
  }, 2000)
}

/**
 * AI分析
 */
const aiAnalysis = () => {
  uni.showModal({
    title: 'AI数据分析',
    content: '根据您的数据分析，建议在晚上7-9点进行推广活动，转化率可提升15%',
    showCancel: false
  })
}
</script>

<style lang="scss" scoped>
.data-page {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.content {
  padding: 20rpx;
}

.data-overview-card,
.data-trend-card,
.user-analysis-card,
.data-report-card {
  margin-bottom: 24rpx;
}

.data-item {
  text-align: center;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.data-value {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  margin: 8rpx 0;
  color: #1d2129;
}

.data-label {
  font-size: 24rpx;
  color: #86909c;
}

.trend-content {
  padding: 20rpx 0;
}
</style>
