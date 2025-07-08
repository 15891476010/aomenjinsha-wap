<template>
  <view class="performance-page">
    <!-- 时间筛选区域 -->
    <view class="time-filter-section">
      <view class="filter-dropdown" @click="showTimeSelector">
        <text class="filter-text">{{ currentTimeLabel }}</text>
        <wd-icon name="arrow-down" size="24rpx" color="#86909c" />
      </view>
    </view>

    <!-- 业绩记录区域 -->
    <view class="performance-records-section">
      <!-- 空状态 -->
      <view v-if="performanceRecords.length === 0" class="empty-state">
        <view class="empty-icon">
          <text class="empty-dot">.</text>
        </view>
        <text class="empty-text">暂无记录</text>
      </view>

      <!-- 业绩记录列表 -->
      <view v-else class="records-list">
        <view
          class="record-item"
          v-for="record in performanceRecords"
          :key="record.id"
        >
          <view class="record-header">
            <text class="record-date">{{ record.date }}</text>
            <text class="record-amount">¥{{ record.amount }}</text>
          </view>
          <view class="record-details">
            <text class="record-type">{{ record.type }}</text>
            <text class="record-status" :class="record.statusClass">{{ record.status }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 时间选择器弹窗 -->
    <wd-popup
      v-model="showTimePicker"
      position="bottom"
      :safe-area-inset-bottom="true"
    >
      <view class="time-picker-popup">
        <view class="picker-header">
          <text class="picker-title">选择时间</text>
          <wd-icon name="close" size="32rpx" color="#86909c" @click="closeTimeSelector" />
        </view>
        <view class="picker-options">
          <view
            class="picker-option"
            :class="{ active: selectedTime === option.value }"
            v-for="option in timeOptions"
            :key="option.value"
            @click="selectTime(option.value)"
          >
            {{ option.label }}
          </view>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'wot-design-uni'

// Toast 实例
const toast = useToast()

// 当前选中的时间
const selectedTime = ref('today')

// 时间选择器显示状态
const showTimePicker = ref(false)

// 时间选项
const timeOptions = ref([
  { label: '今日', value: 'today' },
  { label: '昨日', value: 'yesterday' },
  { label: '本周', value: 'thisWeek' },
  { label: '上周', value: 'lastWeek' },
  { label: '本月', value: 'thisMonth' },
  { label: '上月', value: 'lastMonth' },
  { label: '近7天', value: 'last7Days' },
  { label: '近30天', value: 'last30Days' }
])

// 当前时间标签
const currentTimeLabel = computed(() => {
  const option = timeOptions.value.find(item => item.value === selectedTime.value)
  return option ? option.label : '今日'
})

// 业绩记录数据
const performanceRecords = ref([
  // 暂时为空数组，显示空状态
  // 实际使用时可以添加记录数据，例如：
  // {
  //   id: 1,
  //   date: '2024-01-15',
  //   amount: '1,240.00',
  //   type: '投注业绩',
  //   status: '已结算',
  //   statusClass: 'settled'
  // }
])

/**
 * 显示时间选择器
 */
const showTimeSelector = () => {
  showTimePicker.value = true
}

/**
 * 关闭时间选择器
 */
const closeTimeSelector = () => {
  showTimePicker.value = false
}

/**
 * 选择时间
 */
const selectTime = (timeValue: string) => {
  selectedTime.value = timeValue
  showTimePicker.value = false
  loadPerformanceData(timeValue)
}

/**
 * 加载业绩数据
 */
const loadPerformanceData = (timeValue: string) => {
  toast.loading('正在加载业绩数据...')

  // 模拟数据加载
  setTimeout(() => {
    // 这里应该调用API获取对应时间段的业绩数据
    // 暂时保持空状态
    performanceRecords.value = []

    toast.success('数据加载完成')
  }, 1000)
}
</script>

<style lang="scss" scoped>
.performance-page {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

// 时间筛选区域
.time-filter-section {
  background-color: #ffffff;
  padding: 32rpx;
  margin-bottom: 24rpx;

  .filter-dropdown {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 32rpx;
    background-color: #f7f8fa;
    border-radius: 12rpx;
    border: 1rpx solid var(--border-color, #e5e6eb);
    cursor: pointer;
    transition: all 0.3s ease;

    &:active {
      background-color: #f0f1f5;
      transform: scale(0.98);
    }

    .filter-text {
      font-size: 28rpx;
      color: var(--text-primary, #1d2129);
      font-weight: 500;
    }
  }
}

// 业绩记录区域
.performance-records-section {
  background-color: #ffffff;
  margin: 0 24rpx;
  border-radius: 16rpx;
  min-height: 400rpx;

  // 空状态
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 40rpx;

    .empty-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      background-color: #f7f8fa;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 32rpx;

      .empty-dot {
        font-size: 48rpx;
        color: var(--text-secondary, #86909c);
        font-weight: bold;
        line-height: 1;
      }
    }

    .empty-text {
      font-size: 28rpx;
      color: var(--text-secondary, #86909c);
    }
  }

  // 记录列表
  .records-list {
    padding: 32rpx;

    .record-item {
      padding: 32rpx 0;
      border-bottom: 1rpx solid var(--border-color, #e5e6eb);

      &:last-child {
        border-bottom: none;
      }

      .record-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16rpx;

        .record-date {
          font-size: 28rpx;
          color: var(--text-primary, #1d2129);
          font-weight: 500;
        }

        .record-amount {
          font-size: 32rpx;
          color: var(--primary-color, #165dff);
          font-weight: 600;
        }
      }

      .record-details {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .record-type {
          font-size: 24rpx;
          color: var(--text-secondary, #86909c);
        }

        .record-status {
          font-size: 24rpx;
          padding: 8rpx 16rpx;
          border-radius: 8rpx;

          &.settled {
            color: #00b42a;
            background-color: rgba(0, 180, 42, 0.1);
          }

          &.pending {
            color: #ff7d00;
            background-color: rgba(255, 125, 0, 0.1);
          }

          &.failed {
            color: #f53f3f;
            background-color: rgba(245, 63, 63, 0.1);
          }
        }
      }
    }
  }
}

// 时间选择器弹窗
.time-picker-popup {
  background-color: #ffffff;
  border-radius: 24rpx 24rpx 0 0;

  .picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx;
    border-bottom: 1rpx solid var(--border-color, #e5e6eb);

    .picker-title {
      font-size: 32rpx;
      font-weight: 600;
      color: var(--text-primary, #1d2129);
    }
  }

  .picker-options {
    padding: 24rpx 0;
    max-height: 600rpx;
    overflow-y: auto;

    .picker-option {
      padding: 24rpx 32rpx;
      font-size: 28rpx;
      color: var(--text-primary, #1d2129);
      cursor: pointer;
      transition: all 0.3s ease;

      &:active {
        background-color: #f7f8fa;
      }

      &.active {
        color: var(--primary-color, #165dff);
        background-color: rgba(22, 93, 255, 0.1);
        font-weight: 600;
      }
    }
  }
}

// 响应式适配
@media (max-width: 750rpx) {
  .time-filter-section {
    padding: 24rpx;

    .filter-dropdown {
      padding: 20rpx 24rpx;

      .filter-text {
        font-size: 26rpx;
      }
    }
  }

  .performance-records-section {
    margin: 0 16rpx;

    .empty-state {
      padding: 80rpx 24rpx;

      .empty-icon {
        width: 60rpx;
        height: 60rpx;

        .empty-dot {
          font-size: 36rpx;
        }
      }

      .empty-text {
        font-size: 26rpx;
      }
    }

    .records-list {
      padding: 24rpx;

      .record-item {
        padding: 24rpx 0;

        .record-header {
          .record-date {
            font-size: 26rpx;
          }

          .record-amount {
            font-size: 28rpx;
          }
        }

        .record-details {
          .record-type,
          .record-status {
            font-size: 22rpx;
          }
        }
      }
    }
  }
}
</style>
