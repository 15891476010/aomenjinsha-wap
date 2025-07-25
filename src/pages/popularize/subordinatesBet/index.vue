<template>
  <view class="subordinates-bet-page">
    <!-- 筛选控制区域 -->
    <view class="filter-controls-section">
      <!-- 时间筛选 -->
      <view class="filter-dropdown" @click="showTimeSelector">
        <text class="filter-text">{{ currentTimeLabel }}</text>
        <wd-icon name="arrow-down" size="24rpx" color="#86909c" />
      </view>

      <!-- 排序选择 -->
      <view class="filter-dropdown" @click="showSortSelector">
        <text class="filter-text">{{ currentSortLabel }}</text>
        <wd-icon name="arrow-down" size="24rpx" color="#86909c" />
      </view>

      <!-- 搜索框 -->
      <view class="search-container">
        <input
          class="search-input"
          v-model="searchKeyword"
          placeholder="会员ID"
          @confirm="performSearch"
        />
        <wd-icon name="search" size="32rpx" color="#86909c" @click="performSearch" />
      </view>
    </view>

    <!-- 下级投注列表区域 -->
    <view class="subordinates-bet-list-section">
      <!-- 空状态 -->
      <view class="empty-state" v-if="betList.length === 0">
        <view class="empty-icon">
          <view class="empty-dot">·</view>
        </view>
        <text class="empty-text">暂无记录</text>
      </view>

      <!-- 投注列表 -->
      <view class="subordinates-bet-list" v-else>
        <view
          class="bet-item"
          v-for="bet in betList"
          :key="bet.id"
          @click="showBetDetails(bet)"
        >
          <view class="bet-header">
            <view class="bet-info">
              <text class="bet-member-id">{{ bet.memberId }}</text>
              <text class="bet-level">{{ bet.level }}</text>
            </view>
            <view class="bet-status" :class="bet.status">{{ bet.statusText }}</view>
          </view>

          <view class="bet-details">
            <view class="detail-item">
              <text class="detail-label">有效投注</text>
              <text class="detail-value">{{ bet.validBet }}</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">投注时间</text>
              <text class="detail-value">{{ bet.betTime }}</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">游戏类型</text>
              <text class="detail-value">{{ bet.gameType }}</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">输赢金额</text>
              <text class="detail-value" :class="bet.winLoss >= 0 ? 'win' : 'loss'">
                {{ bet.winLoss >= 0 ? '+' : '' }}{{ bet.winLoss }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 时间选择器弹窗 -->
    <wd-popup v-model="showTimePicker" position="bottom">
      <view class="picker-popup">
        <view class="picker-header">
          <text class="picker-title">选择时间</text>
          <wd-icon name="close" size="32rpx" color="#86909c" @click="showTimePicker = false" />
        </view>
        <view class="picker-options">
          <view
            class="picker-option"
            v-for="option in timeOptions"
            :key="option.value"
            :class="{ active: currentTimeValue === option.value }"
            @click="selectTime(option)"
          >
            {{ option.label }}
          </view>
        </view>
      </view>
    </wd-popup>

    <!-- 排序选择器弹窗 -->
    <wd-popup v-model="showSortPicker" position="bottom">
      <view class="picker-popup">
        <view class="picker-header">
          <text class="picker-title">选择排序</text>
          <wd-icon name="close" size="32rpx" color="#86909c" @click="showSortPicker = false" />
        </view>
        <view class="picker-options">
          <view
            class="picker-option"
            v-for="option in sortOptions"
            :key="option.value"
            :class="{ active: currentSortValue === option.value }"
            @click="selectSort(option)"
          >
            {{ option.label }}
          </view>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useToast } from 'wot-design-uni'

const toast = useToast()

// 响应式数据
const searchKeyword = ref('')
const showTimePicker = ref(false)
const showSortPicker = ref(false)
const currentTimeValue = ref('today')
const currentTimeLabel = ref('今日')
const currentSortValue = ref('validBet')
const currentSortLabel = ref('有效投注排序')

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

// 排序选项
const sortOptions = ref([
  { label: '有效投注排序', value: 'validBet' },
  { label: '投注时间排序', value: 'betTime' },
  { label: '输赢金额排序', value: 'winLoss' },
  { label: '会员ID排序', value: 'memberId' },
  { label: '游戏类型排序', value: 'gameType' }
])

// 投注列表数据（示例数据，实际应从API获取）
const betList = ref([
  // 这里可以添加示例数据，目前为空显示暂无记录
])

// 显示时间选择器
const showTimeSelector = () => {
  showTimePicker.value = true
}

// 显示排序选择器
const showSortSelector = () => {
  showSortPicker.value = true
}

// 选择时间
const selectTime = (option: any) => {
  currentTimeValue.value = option.value
  currentTimeLabel.value = option.label
  showTimePicker.value = false
  loadBetData()
  toast.success(`已切换到${option.label}`)
}

// 选择排序
const selectSort = (option: any) => {
  currentSortValue.value = option.value
  currentSortLabel.value = option.label
  showSortPicker.value = false
  loadBetData()
  toast.success(`已切换到${option.label}`)
}

// 执行搜索
const performSearch = () => {
  if (searchKeyword.value.trim()) {
    loadBetData()
    toast.success(`搜索会员ID: ${searchKeyword.value}`)
  } else {
    toast.warning('请输入会员ID')
  }
}

// 加载投注数据
const loadBetData = () => {
  // 这里应该调用API获取数据
  console.log('加载投注数据', {
    time: currentTimeValue.value,
    sort: currentSortValue.value,
    search: searchKeyword.value
  })
}

// 显示投注详情
const showBetDetails = (bet: any) => {
  uni.showModal({
    title: '投注详情',
    content: `会员ID: ${bet.memberId}\n有效投注: ${bet.validBet}\n游戏类型: ${bet.gameType}\n输赢金额: ${bet.winLoss}`,
    showCancel: false,
    confirmText: '我知道了'
  })
}
</script>

<style lang="scss" scoped>
.subordinates-bet-page {
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

/* 下级投注列表区域 */
.subordinates-bet-list-section {
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

  /* 投注列表 */
  .subordinates-bet-list {
    padding: 32rpx;

    .bet-item {
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

      .bet-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;

        .bet-info {
          display: flex;
          align-items: center;
          gap: 16rpx;

          .bet-member-id {
            font-size: 28rpx;
            color: var(--text-primary, #1d2129);
            font-weight: 600;
          }

          .bet-level {
            font-size: 22rpx;
            color: var(--primary-color, #165dff);
            background-color: rgba(22, 93, 255, 0.1);
            padding: 6rpx 12rpx;
            border-radius: 8rpx;
          }
        }

        .bet-status {
          font-size: 24rpx;
          padding: 8rpx 16rpx;
          border-radius: 8rpx;

          &.win {
            color: #00b42a;
            background-color: rgba(0, 180, 42, 0.1);
          }

          &.loss {
            color: #f53f3f;
            background-color: rgba(245, 63, 63, 0.1);
          }

          &.pending {
            color: #ff7d00;
            background-color: rgba(255, 125, 0, 0.1);
          }
        }
      }

      .bet-details {
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

            &.win {
              color: #00b42a;
            }

            &.loss {
              color: #f53f3f;
            }
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

  .subordinates-bet-list-section {
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

    .subordinates-bet-list {
      padding: 24rpx;

      .bet-item {
        padding: 24rpx 0;

        .bet-header {
          margin-bottom: 16rpx;

          .bet-info {
            gap: 12rpx;

            .bet-member-id {
              font-size: 26rpx;
            }

            .bet-level {
              font-size: 20rpx;
              padding: 4rpx 8rpx;
            }
          }

          .bet-status {
            font-size: 22rpx;
            padding: 6rpx 12rpx;
          }
        }

        .bet-details {
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
</style>
