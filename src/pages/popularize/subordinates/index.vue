<template>
  <view class="subordinates-page">
    <!-- 筛选控制区域 -->
    <view class="filter-controls-section">
      <!-- 时间筛选 -->
      <view class="filter-dropdown" @click="showTimeSelector">
        <text class="filter-text">{{ currentTimeLabel }}</text>
        <wd-icon name="arrow-down" size="24rpx" color="#86909c"/>
      </view>

      <!-- 排序选择 -->
      <view class="filter-dropdown" @click="showSortSelector">
        <text class="filter-text">{{ currentSortLabel }}</text>
        <wd-icon name="arrow-down" size="24rpx" color="#86909c"/>
      </view>

      <!-- 搜索框 -->
      <view class="search-container">
        <input
          class="search-input"
          v-model="searchKeyword"
          placeholder="会员ID"
          @input="onSearchInput"
          @confirm="performSearch"
        />
        <wd-icon name="search" size="32rpx" color="#86909c" @click="performSearch"/>
      </view>
    </view>

    <!-- 下级信息列表区域 -->
    <view class="subordinates-list-section">
      <!-- 空状态 -->
      <view v-if="subordinatesList.length === 0" class="empty-state">
        <view class="empty-icon">
          <text class="empty-dot">.</text>
        </view>
        <text class="empty-text">暂无记录</text>
      </view>

      <!-- 下级信息列表 -->
      <view v-else class="subordinates-list">
        <view
          class="subordinate-item"
          v-for="subordinate in subordinatesList"
          :key="subordinate.id"
          @click="viewSubordinateDetail(subordinate)"
        >
          <view class="subordinate-header">
            <view class="subordinate-info">
              <text class="subordinate-id">{{ subordinate.memberId }}</text>
              <text class="subordinate-level">{{ subordinate.level }}</text>
            </view>
            <text class="subordinate-status" :class="subordinate.statusClass">
              {{ subordinate.status }}
            </text>
          </view>
          <view class="subordinate-details">
            <view class="detail-item">
              <text class="detail-label">注册时间</text>
              <text class="detail-value">{{ subordinate.registerTime }}</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">最后登录</text>
              <text class="detail-value">{{ subordinate.lastLoginTime }}</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">累计投注</text>
              <text class="detail-value">¥{{ subordinate.totalBet }}</text>
            </view>
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
      <view class="picker-popup">
        <view class="picker-header">
          <text class="picker-title">选择时间</text>
          <wd-icon name="close" size="32rpx" color="#86909c" @click="closeTimeSelector"/>
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

    <!-- 排序选择器弹窗 -->
    <wd-popup
      v-model="showSortPicker"
      position="bottom"
      :safe-area-inset-bottom="true"
    >
      <view class="picker-popup">
        <view class="picker-header">
          <text class="picker-title">选择排序</text>
          <wd-icon name="close" size="32rpx" color="#86909c" @click="closeSortSelector"/>
        </view>
        <view class="picker-options">
          <view
            class="picker-option"
            :class="{ active: selectedSort === option.value }"
            v-for="option in sortOptions"
            :key="option.value"
            @click="selectSort(option.value)"
          >
            {{ option.label }}
          </view>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {useToast} from 'wot-design-uni'

// Toast 实例
const toast = useToast()

// 当前选中的时间
const selectedTime = ref('today')

// 当前选中的排序
const selectedSort = ref('loginDate')

// 搜索关键词
const searchKeyword = ref('')

// 时间选择器显示状态
const showTimePicker = ref(false)

// 排序选择器显示状态
const showSortPicker = ref(false)

// 时间选项
const timeOptions = ref([
  {label: '今日', value: 'today'},
  {label: '昨日', value: 'yesterday'},
  {label: '本周', value: 'thisWeek'},
  {label: '上周', value: 'lastWeek'},
  {label: '本月', value: 'thisMonth'},
  {label: '上月', value: 'lastMonth'},
  {label: '近7天', value: 'last7Days'},
  {label: '近30天', value: 'last30Days'}
])

// 排序选项
const sortOptions = ref([
  {label: '登录日期排序', value: 'loginDate'},
  {label: '注册日期排序', value: 'registerDate'},
  {label: '投注金额排序', value: 'betAmount'},
  {label: '会员ID排序', value: 'memberId'},
  {label: '等级排序', value: 'level'}
])

// 当前时间标签
const currentTimeLabel = computed(() => {
  const option = timeOptions.value.find(item => item.value === selectedTime.value)
  return option ? option.label : '今日'
})

// 当前排序标签
const currentSortLabel = computed(() => {
  const option = sortOptions.value.find(item => item.value === selectedSort.value)
  return option ? option.label : '登录日期排序'
})

// 下级信息列表数据
const subordinatesList = ref([
  // 暂时为空数组，显示空状态
  // 实际使用时可以添加下级数据，例如：
  // {
  //   id: 1,
  //   memberId: 'USER001',
  //   level: 'VIP1',
  //   status: '在线',
  //   statusClass: 'online',
  //   registerTime: '2024-01-15',
  //   lastLoginTime: '2024-01-20 14:30',
  //   totalBet: '12,500.00'
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
  loadSubordinatesData()
}

/**
 * 显示排序选择器
 */
const showSortSelector = () => {
  showSortPicker.value = true
}

/**
 * 关闭排序选择器
 */
const closeSortSelector = () => {
  showSortPicker.value = false
}

/**
 * 选择排序
 */
const selectSort = (sortValue: string) => {
  selectedSort.value = sortValue
  showSortPicker.value = false
  loadSubordinatesData()
}

/**
 * 搜索输入处理
 */
const onSearchInput = (e: any) => {
  searchKeyword.value = e.detail.value
}

/**
 * 执行搜索
 */
const performSearch = () => {
  if (searchKeyword.value.trim()) {
    toast.loading('正在搜索...')
    // 模拟搜索延迟
    setTimeout(() => {
      loadSubordinatesData()
      toast.success('搜索完成')
    }, 1000)
  } else {
    loadSubordinatesData()
  }
}

/**
 * 加载下级信息数据
 */
const loadSubordinatesData = () => {
  toast.loading('正在加载数据...')

  // 模拟数据加载
  setTimeout(() => {
    // 这里应该调用API获取下级信息数据
    // 根据时间筛选、排序方式、搜索关键词等条件获取数据
    // 暂时保持空状态
    subordinatesList.value = []

    toast.success('数据加载完成')
  }, 1000)
}

/**
 * 查看下级详情
 */
const viewSubordinateDetail = (subordinate: any) => {
  uni.showModal({
    title: '下级详情',
    content: `会员ID: ${subordinate.memberId}\n等级: ${subordinate.level}\n状态: ${subordinate.status}`,
    showCancel: false,
    confirmText: '我知道了'
  })
}
</script>

<style lang="scss" scoped>
.subordinates-page {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

/* 筛选控制区域 */
.filter-controls-section {
  background-color: #ffffff;
  padding: 32rpx;
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;

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

  .search-container {
    display: flex;
    align-items: center;
    padding: 24rpx 32rpx;
    background-color: #f7f8fa;
    border-radius: 12rpx;
    border: 1rpx solid var(--border-color, #e5e6eb);

    .search-input {
      flex: 1;
      font-size: 28rpx;
      color: var(--text-primary, #1d2129);
      background: transparent;
      border: none;
      outline: none;

      &::placeholder {
        color: var(--text-secondary, #86909c);
      }
    }
  }
}

/* 下级信息列表区域 */
.subordinates-list-section {
  background-color: #ffffff;
  margin: 0 24rpx;
  border-radius: 16rpx;
  min-height: 400rpx;

  /* 空状态 */
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

  /* 下级信息列表 */
  .subordinates-list {
    padding: 32rpx;

    .subordinate-item {
      padding: 32rpx 0;
      border-bottom: 1rpx solid var(--border-color, #e5e6eb);
      cursor: pointer;
      transition: all 0.3s ease;

      &:last-child {
        border-bottom: none;
      }

      &:active {
        background-color: #f7f8fa;
        transform: scale(0.98);
      }

      .subordinate-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;

        .subordinate-info {
          display: flex;
          align-items: center;
          gap: 16rpx;

          .subordinate-id {
            font-size: 28rpx;
            color: var(--text-primary, #1d2129);
            font-weight: 600;
          }

          .subordinate-level {
            font-size: 22rpx;
            color: var(--primary-color, #165dff);
            background-color: rgba(22, 93, 255, 0.1);
            padding: 6rpx 12rpx;
            border-radius: 8rpx;
          }
        }

        .subordinate-status {
          font-size: 24rpx;
          padding: 8rpx 16rpx;
          border-radius: 8rpx;

          &.online {
            color: #00b42a;
            background-color: rgba(0, 180, 42, 0.1);
          }

          &.offline {
            color: #86909c;
            background-color: rgba(134, 144, 156, 0.1);
          }

          &.inactive {
            color: #ff7d00;
            background-color: rgba(255, 125, 0, 0.1);
          }
        }
      }

      .subordinate-details {
        display: flex;
        flex-direction: column;
        gap: 12rpx;

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .detail-label {
            font-size: 24rpx;
            color: var(--text-secondary, #86909c);
          }

          .detail-value {
            font-size: 24rpx;
            color: var(--text-primary, #1d2129);
            font-weight: 500;
          }
        }
      }
    }
  }
}

/* 选择器弹窗 */
.picker-popup {
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

  /* 响应式适配 */
  @media (max-width: 750rpx) {
    .filter-controls-section {
      padding: 24rpx;
      gap: 20rpx;

      .filter-dropdown,
      .search-container {
        padding: 20rpx 24rpx;

        .filter-text,
        .search-input {
          font-size: 26rpx;
        }
      }
    }

    .subordinates-list-section {
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

      .subordinates-list {
        padding: 24rpx;

        .subordinate-item {
          padding: 24rpx 0;

          .subordinate-header {
            margin-bottom: 16rpx;

            .subordinate-info {
              gap: 12rpx;

              .subordinate-id {
                font-size: 26rpx;
              }

              .subordinate-level {
                font-size: 20rpx;
                padding: 4rpx 8rpx;
              }
            }

            .subordinate-status {
              font-size: 22rpx;
              padding: 6rpx 12rpx;
            }
          }

          .subordinate-details {
            gap: 10rpx;

            .detail-item {
              .detail-label,
              .detail-value {
                font-size: 22rpx;
              }
            }
          }
        }
      }
    }
  }
}
</style>
