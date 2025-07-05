<template>
  <view class="subordinates-reward-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">下级领取</text>
    </view>

    <!-- 领取统计 -->
    <view class="reward-stats">
      <wd-card title="领取统计" class="stats-card">
        <wd-grid :column="2" border>
          <wd-grid-item v-for="item in rewardStatsItems" :key="item.label">
            <view class="stats-item">
              <wd-icon :name="item.icon" :color="item.color" size="24px" />
              <view class="stats-value">{{ item.value }}</view>
              <view class="stats-label">{{ item.label }}</view>
            </view>
          </wd-grid-item>
        </wd-grid>
      </wd-card>
    </view>

    <!-- 奖励类型筛选 -->
    <view class="reward-filter">
      <wd-tabs v-model="rewardTypeTab">
        <wd-tab title="全部" name="all" />
        <wd-tab title="注册奖励" name="register" />
        <wd-tab title="首充奖励" name="firstDeposit" />
        <wd-tab title="活动奖励" name="activity" />
        <wd-tab title="推荐奖励" name="referral" />
      </wd-tabs>
    </view>

    <!-- 领取记录列表 -->
    <view class="reward-records">
      <wd-card v-for="record in rewardRecords" :key="record.id" class="reward-record-card">
        <view class="record-header">
          <view class="user-info">
            <text class="username">{{ record.username }}</text>
            <text class="user-id">ID: {{ record.userId }}</text>
          </view>
          <view class="reward-status">
            <wd-tag :type="getStatusType(record.status)">
              {{ getStatusText(record.status) }}
            </wd-tag>
          </view>
        </view>
        
        <view class="reward-details">
          <view class="reward-info">
            <view class="reward-type">
              <wd-icon :name="getRewardIcon(record.type)" :color="getRewardColor(record.type)" size="20px" />
              <text class="type-name">{{ getRewardTypeName(record.type) }}</text>
            </view>
            <view class="reward-amount">¥{{ record.amount }}</view>
          </view>
          
          <wd-cell-group border>
            <wd-cell title="奖励条件" :value="record.condition" />
            <wd-cell title="领取时间" :value="record.claimTime" />
            <wd-cell title="到账时间" :value="record.arrivalTime || '待到账'" />
          </wd-cell-group>
        </view>
        
        <view v-if="record.description" class="reward-description">
          <text class="desc-label">说明：</text>
          <text class="desc-content">{{ record.description }}</text>
        </view>
      </wd-card>
    </view>

    <!-- 加载更多 -->
    <view class="load-more">
      <wd-button type="primary" plain @click="loadMore" :loading="loading">
        {{ loading ? '加载中...' : '加载更多' }}
      </wd-button>
    </view>

    <wd-toast />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'wot-design-uni'

const toast = useToast()

// 领取统计数据
const rewardStatsItems = ref([
  { label: '今日领取', value: '¥1,280', icon: 'calendar', color: '#165dff' },
  { label: '本月领取', value: '¥15,680', icon: 'chart', color: '#00b42a' },
  { label: '累计领取', value: '¥128,500', icon: 'star', color: '#ff7d00' },
  { label: '待领取', value: '¥2,580', icon: 'clock', color: '#f53f3f' }
])

// 奖励类型筛选
const rewardTypeTab = ref('all')
const loading = ref(false)

// 领取记录
const rewardRecords = ref([
  {
    id: 'R001',
    username: 'user001',
    userId: 'U001',
    type: 'register',
    amount: '100',
    condition: '完成注册',
    status: 'completed',
    claimTime: '2024-01-15 14:30:25',
    arrivalTime: '2024-01-15 14:31:00',
    description: '新用户注册奖励'
  },
  {
    id: 'R002',
    username: 'user002',
    userId: 'U002',
    type: 'firstDeposit',
    amount: '500',
    condition: '首次充值≥1000',
    status: 'pending',
    claimTime: '2024-01-15 15:20:10',
    arrivalTime: '',
    description: '首充奖励，充值1000送500'
  },
  {
    id: 'R003',
    username: 'user003',
    userId: 'U003',
    type: 'activity',
    amount: '200',
    condition: '参与周末活动',
    status: 'completed',
    claimTime: '2024-01-15 16:45:33',
    arrivalTime: '2024-01-15 16:46:00',
    description: '周末狂欢活动奖励'
  },
  {
    id: 'R004',
    username: 'user004',
    userId: 'U004',
    type: 'referral',
    amount: '300',
    condition: '推荐好友注册',
    status: 'failed',
    claimTime: '2024-01-15 18:00:00',
    arrivalTime: '',
    description: '推荐奖励，好友未满足条件'
  }
])

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'completed': return 'success'
    case 'pending': return 'warning'
    case 'failed': return 'danger'
    default: return 'default'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'completed': return '已到账'
    case 'pending': return '处理中'
    case 'failed': return '失败'
    default: return '未知'
  }
}

// 获取奖励类型图标
const getRewardIcon = (type: string) => {
  switch (type) {
    case 'register': return 'user-add'
    case 'firstDeposit': return 'money'
    case 'activity': return 'gift'
    case 'referral': return 'share'
    default: return 'star'
  }
}

// 获取奖励类型颜色
const getRewardColor = (type: string) => {
  switch (type) {
    case 'register': return '#165dff'
    case 'firstDeposit': return '#00b42a'
    case 'activity': return '#ff7d00'
    case 'referral': return '#f53f3f'
    default: return '#86909c'
  }
}

// 获取奖励类型名称
const getRewardTypeName = (type: string) => {
  switch (type) {
    case 'register': return '注册奖励'
    case 'firstDeposit': return '首充奖励'
    case 'activity': return '活动奖励'
    case 'referral': return '推荐奖励'
    default: return '其他奖励'
  }
}

// 加载更多
const loadMore = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    toast.success('暂无更多数据')
  }, 1000)
}
</script>

<style lang="scss" scoped>
.subordinates-reward-page {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 16px;
  
  .page-title {
    font-size: 20px;
    font-weight: 600;
    color: #1d2129;
  }
}

.reward-stats {
  margin-bottom: 16px;
  
  .stats-item {
    text-align: center;
    padding: 16px;
    
    .stats-value {
      font-size: 18px;
      font-weight: 600;
      color: #1d2129;
      margin: 8px 0 4px;
    }
    
    .stats-label {
      font-size: 12px;
      color: #86909c;
    }
  }
}

.reward-filter {
  margin-bottom: 16px;
}

.reward-records {
  .reward-record-card {
    margin-bottom: 12px;
    
    .record-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .user-info {
        .username {
          font-size: 16px;
          font-weight: 500;
          color: #1d2129;
          margin-right: 8px;
        }
        
        .user-id {
          font-size: 12px;
          color: #86909c;
        }
      }
    }
    
    .reward-details {
      margin-bottom: 12px;
      
      .reward-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #e5e6eb;
        margin-bottom: 12px;
        
        .reward-type {
          display: flex;
          align-items: center;
          
          .type-name {
            font-size: 14px;
            color: #1d2129;
            margin-left: 8px;
          }
        }
        
        .reward-amount {
          font-size: 20px;
          font-weight: 600;
          color: #f53f3f;
        }
      }
    }
    
    .reward-description {
      padding: 8px 0;
      border-top: 1px solid #e5e6eb;
      
      .desc-label {
        font-size: 12px;
        color: #86909c;
      }
      
      .desc-content {
        font-size: 14px;
        color: #1d2129;
        margin-left: 8px;
      }
    }
  }
}

.load-more {
  margin-top: 20px;
  text-align: center;
}
</style>
