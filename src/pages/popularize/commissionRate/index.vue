<template>
  <view class="commission-rate-page">
    <!-- 游戏类型选择区域 -->
    <view class="game-type-section">
      <view class="game-type-grid">
        <view
          class="game-type-item"
          v-for="gameType in gameTypes"
          :key="gameType.value"
          :class="{ active: currentGameType === gameType.value }"
          @click="selectGameType(gameType)"
        >
          <view class="game-icon">
            <wd-icon :name="gameType.icon" size="48rpx" :color="currentGameType === gameType.value ? '#ffffff' : '#86909c'" />
          </view>
          <text class="game-name">{{ gameType.label }}</text>
        </view>
      </view>
    </view>

    <!-- 返佣比例表格区域 -->
    <view class="commission-table-section">
      <view class="table-container">
        <!-- 表格头部 -->
        <view class="table-header">
          <view class="header-cell people-count">
            <text class="header-text">有效人数</text>
            <wd-icon name="help" size="24rpx" color="#86909c" @click="showPeopleCountHelp" />
          </view>
          <view class="header-cell performance">
            <text class="header-text">业绩</text>
            <text class="header-sub">(单位：万)</text>
          </view>
          <view class="header-cell commission-rate">
            <text class="header-text">每万返佣比例</text>
          </view>
        </view>

        <!-- 表格内容 -->
        <view class="table-body">
          <view
            class="table-row"
            v-for="(item, index) in currentCommissionData"
            :key="index"
          >
            <view class="body-cell people-count">{{ item.peopleCount }}</view>
            <view class="body-cell performance">{{ item.performance }}</view>
            <view class="body-cell commission-rate">
              <text class="rate-value">{{ item.rate }}</text>
              <text class="rate-unit">%</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 帮助说明弹窗 -->
    <wd-popup v-model="showHelpPopup" position="center">
      <view class="help-popup">
        <view class="help-header">
          <text class="help-title">有效人数说明</text>
          <wd-icon name="close" size="32rpx" color="#86909c" @click="showHelpPopup = false" />
        </view>
        <view class="help-content">
          <text class="help-text">有效人数是指在统计周期内产生有效投注的下级用户数量。只有产生实际投注行为的用户才会被计入有效人数统计。</text>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'wot-design-uni'

const toast = useToast()

// 响应式数据
const currentGameType = ref('chess')
const showHelpPopup = ref(false)

// 游戏类型配置
const gameTypes = ref([
  { label: '棋牌', value: 'chess', icon: 'grid' },
  { label: '捕鱼', value: 'fishing', icon: 'fish' },
  { label: '电子', value: 'electronic', icon: 'computer' },
  { label: '真人', value: 'live', icon: 'user' },
  { label: '体育', value: 'sports', icon: 'football' },
  { label: '彩票', value: 'lottery', icon: 'ticket' },
  { label: '斗鸡', value: 'cockfight', icon: 'chicken' },
  { label: '电竞', value: 'esports', icon: 'game' },
  { label: '区块链', value: 'blockchain', icon: 'link' }
])

// 返佣比例数据配置
const commissionData = ref({
  chess: [
    { peopleCount: 1, performance: '0.00', rate: '0.50' },
    { peopleCount: 1, performance: '5.00', rate: '0.60' },
    { peopleCount: 1, performance: '10.00', rate: '0.70' },
    { peopleCount: 1, performance: '50.00', rate: '0.80' },
    { peopleCount: 1, performance: '100.00', rate: '0.90' },
    { peopleCount: 1, performance: '200.00', rate: '0.95' },
    { peopleCount: 1, performance: '300.00', rate: '1.00' },
    { peopleCount: 1, performance: '500.00', rate: '1.20' },
    { peopleCount: 1, performance: '700.00', rate: '1.30' },
    { peopleCount: 1, performance: '1,000.00', rate: '1.40' },
    { peopleCount: 1, performance: '2,000.00', rate: '1.60' },
    { peopleCount: 1, performance: '3,000.00', rate: '1.80' },
    { peopleCount: 1, performance: '5,000.00', rate: '2.00' }
  ],
  fishing: [
    { peopleCount: 1, performance: '0.00', rate: '1.00' },
    { peopleCount: 1, performance: '5.00', rate: '1.05' },
    { peopleCount: 1, performance: '10.00', rate: '1.10' },
    { peopleCount: 1, performance: '50.00', rate: '1.15' },
    { peopleCount: 1, performance: '100.00', rate: '1.20' },
    { peopleCount: 1, performance: '200.00', rate: '1.30' },
    { peopleCount: 1, performance: '300.00', rate: '1.40' },
    { peopleCount: 1, performance: '500.00', rate: '1.50' },
    { peopleCount: 1, performance: '700.00', rate: '1.60' },
    { peopleCount: 1, performance: '1,000.00', rate: '1.70' },
    { peopleCount: 1, performance: '2,000.00', rate: '1.80' },
    { peopleCount: 1, performance: '3,000.00', rate: '1.90' },
    { peopleCount: 1, performance: '5,000.00', rate: '2.00' }
  ],
  electronic: [
    { peopleCount: 1, performance: '0.00', rate: '0.80' },
    { peopleCount: 1, performance: '5.00', rate: '0.85' },
    { peopleCount: 1, performance: '10.00', rate: '0.90' },
    { peopleCount: 1, performance: '50.00', rate: '0.95' },
    { peopleCount: 1, performance: '100.00', rate: '1.00' },
    { peopleCount: 1, performance: '200.00', rate: '1.10' },
    { peopleCount: 1, performance: '300.00', rate: '1.20' },
    { peopleCount: 1, performance: '500.00', rate: '1.30' },
    { peopleCount: 1, performance: '700.00', rate: '1.40' },
    { peopleCount: 1, performance: '1,000.00', rate: '1.50' },
    { peopleCount: 1, performance: '2,000.00', rate: '1.70' },
    { peopleCount: 1, performance: '3,000.00', rate: '1.90' },
    { peopleCount: 1, performance: '5,000.00', rate: '2.10' }
  ],
  live: [
    { peopleCount: 1, performance: '0.00', rate: '0.60' },
    { peopleCount: 1, performance: '5.00', rate: '0.65' },
    { peopleCount: 1, performance: '10.00', rate: '0.70' },
    { peopleCount: 1, performance: '50.00', rate: '0.75' },
    { peopleCount: 1, performance: '100.00', rate: '0.80' },
    { peopleCount: 1, performance: '200.00', rate: '0.90' },
    { peopleCount: 1, performance: '300.00', rate: '1.00' },
    { peopleCount: 1, performance: '500.00', rate: '1.10' },
    { peopleCount: 1, performance: '700.00', rate: '1.20' },
    { peopleCount: 1, performance: '1,000.00', rate: '1.30' },
    { peopleCount: 1, performance: '2,000.00', rate: '1.50' },
    { peopleCount: 1, performance: '3,000.00', rate: '1.70' },
    { peopleCount: 1, performance: '5,000.00', rate: '1.90' }
  ],
  sports: [
    { peopleCount: 1, performance: '0.00', rate: '0.40' },
    { peopleCount: 1, performance: '5.00', rate: '0.45' },
    { peopleCount: 1, performance: '10.00', rate: '0.50' },
    { peopleCount: 1, performance: '50.00', rate: '0.55' },
    { peopleCount: 1, performance: '100.00', rate: '0.60' },
    { peopleCount: 1, performance: '200.00', rate: '0.70' },
    { peopleCount: 1, performance: '300.00', rate: '0.80' },
    { peopleCount: 1, performance: '500.00', rate: '0.90' },
    { peopleCount: 1, performance: '700.00', rate: '1.00' },
    { peopleCount: 1, performance: '1,000.00', rate: '1.10' },
    { peopleCount: 1, performance: '2,000.00', rate: '1.30' },
    { peopleCount: 1, performance: '3,000.00', rate: '1.50' },
    { peopleCount: 1, performance: '5,000.00', rate: '1.70' }
  ],
  lottery: [
    { peopleCount: 1, performance: '0.00', rate: '0.30' },
    { peopleCount: 1, performance: '5.00', rate: '0.35' },
    { peopleCount: 1, performance: '10.00', rate: '0.40' },
    { peopleCount: 1, performance: '50.00', rate: '0.45' },
    { peopleCount: 1, performance: '100.00', rate: '0.50' },
    { peopleCount: 1, performance: '200.00', rate: '0.60' },
    { peopleCount: 1, performance: '300.00', rate: '0.70' },
    { peopleCount: 1, performance: '500.00', rate: '0.80' },
    { peopleCount: 1, performance: '700.00', rate: '0.90' },
    { peopleCount: 1, performance: '1,000.00', rate: '1.00' },
    { peopleCount: 1, performance: '2,000.00', rate: '1.20' },
    { peopleCount: 1, performance: '3,000.00', rate: '1.40' },
    { peopleCount: 1, performance: '5,000.00', rate: '1.60' }
  ],
  cockfight: [
    { peopleCount: 1, performance: '0.00', rate: '0.70' },
    { peopleCount: 1, performance: '5.00', rate: '0.75' },
    { peopleCount: 1, performance: '10.00', rate: '0.80' },
    { peopleCount: 1, performance: '50.00', rate: '0.85' },
    { peopleCount: 1, performance: '100.00', rate: '0.90' },
    { peopleCount: 1, performance: '200.00', rate: '1.00' },
    { peopleCount: 1, performance: '300.00', rate: '1.10' },
    { peopleCount: 1, performance: '500.00', rate: '1.20' },
    { peopleCount: 1, performance: '700.00', rate: '1.30' },
    { peopleCount: 1, performance: '1,000.00', rate: '1.40' },
    { peopleCount: 1, performance: '2,000.00', rate: '1.60' },
    { peopleCount: 1, performance: '3,000.00', rate: '1.80' },
    { peopleCount: 1, performance: '5,000.00', rate: '2.00' }
  ],
  esports: [
    { peopleCount: 1, performance: '0.00', rate: '0.60' },
    { peopleCount: 1, performance: '5.00', rate: '0.65' },
    { peopleCount: 1, performance: '10.00', rate: '0.70' },
    { peopleCount: 1, performance: '50.00', rate: '0.75' },
    { peopleCount: 1, performance: '100.00', rate: '0.80' },
    { peopleCount: 1, performance: '200.00', rate: '0.90' },
    { peopleCount: 1, performance: '300.00', rate: '1.00' },
    { peopleCount: 1, performance: '500.00', rate: '1.10' },
    { peopleCount: 1, performance: '700.00', rate: '1.20' },
    { peopleCount: 1, performance: '1,000.00', rate: '1.30' },
    { peopleCount: 1, performance: '2,000.00', rate: '1.50' },
    { peopleCount: 1, performance: '3,000.00', rate: '1.70' },
    { peopleCount: 1, performance: '5,000.00', rate: '1.90' }
  ],
  blockchain: [
    { peopleCount: 1, performance: '0.00', rate: '1.20' },
    { peopleCount: 1, performance: '5.00', rate: '1.25' },
    { peopleCount: 1, performance: '10.00', rate: '1.30' },
    { peopleCount: 1, performance: '50.00', rate: '1.35' },
    { peopleCount: 1, performance: '100.00', rate: '1.40' },
    { peopleCount: 1, performance: '200.00', rate: '1.50' },
    { peopleCount: 1, performance: '300.00', rate: '1.60' },
    { peopleCount: 1, performance: '500.00', rate: '1.70' },
    { peopleCount: 1, performance: '700.00', rate: '1.80' },
    { peopleCount: 1, performance: '1,000.00', rate: '1.90' },
    { peopleCount: 1, performance: '2,000.00', rate: '2.10' },
    { peopleCount: 1, performance: '3,000.00', rate: '2.30' },
    { peopleCount: 1, performance: '5,000.00', rate: '2.50' }
  ]
})

// 当前选中游戏类型的返佣数据
const currentCommissionData = computed(() => {
  return commissionData.value[currentGameType.value] || []
})

// 选择游戏类型
const selectGameType = (gameType: any) => {
  currentGameType.value = gameType.value
  toast.success(`已切换到${gameType.label}`)
}

// 显示有效人数帮助说明
const showPeopleCountHelp = () => {
  showHelpPopup.value = true
}
</script>

<style lang="scss" scoped>
.commission-rate-page {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

/* 游戏类型选择区域 */
.game-type-section {
  background-color: #ffffff;
  padding: 32rpx;
  margin-bottom: 24rpx;

  .game-type-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24rpx;

    .game-type-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24rpx 16rpx;
      background-color: #f7f8fa;
      border-radius: 16rpx;
      border: 2rpx solid transparent;
      cursor: pointer;
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.95);
      }

      &.active {
        background-color: var(--primary-color, #165dff);
        border-color: var(--primary-color, #165dff);

        .game-name {
          color: #ffffff;
        }
      }

      .game-icon {
        width: 64rpx;
        height: 64rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12rpx;
      }

      .game-name {
        font-size: 24rpx;
        color: var(--text-primary, #1d2129);
        font-weight: 500;
        transition: color 0.3s ease;
      }
    }
  }
}

/* 返佣比例表格区域 */
.commission-table-section {
  background-color: #ffffff;
  margin: 0 24rpx;
  border-radius: 16rpx;
  overflow: hidden;

  .table-container {
    /* 表格头部 */
    .table-header {
      display: flex;
      background-color: #f7f8fa;
      border-bottom: 1rpx solid var(--border-color, #e5e6eb);

      .header-cell {
        flex: 1;
        padding: 24rpx 16rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-right: 1rpx solid var(--border-color, #e5e6eb);

        &:last-child {
          border-right: none;
        }

        &.people-count {
          flex: 0.8;
          flex-direction: row;
          gap: 8rpx;
        }

        &.performance {
          flex: 1;
        }

        &.commission-rate {
          flex: 1.2;
        }

        .header-text {
          font-size: 26rpx;
          color: var(--text-primary, #1d2129);
          font-weight: 600;
          text-align: center;
        }

        .header-sub {
          font-size: 20rpx;
          color: var(--text-secondary, #86909c);
          margin-top: 4rpx;
          text-align: center;
        }
      }
    }

    /* 表格内容 */
    .table-body {
      .table-row {
        display: flex;
        border-bottom: 1rpx solid var(--border-color, #e5e6eb);

        &:last-child {
          border-bottom: none;
        }

        &:nth-child(even) {
          background-color: #fafbfc;
        }

        .body-cell {
          flex: 1;
          padding: 20rpx 16rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1rpx solid var(--border-color, #e5e6eb);
          font-size: 24rpx;
          color: var(--text-primary, #1d2129);

          &:last-child {
            border-right: none;
          }

          &.people-count {
            flex: 0.8;
            font-weight: 500;
          }

          &.performance {
            flex: 1;
            font-weight: 500;
          }

          &.commission-rate {
            flex: 1.2;

            .rate-value {
              font-size: 26rpx;
              font-weight: 600;
              color: var(--primary-color, #165dff);
            }

            .rate-unit {
              font-size: 20rpx;
              color: var(--primary-color, #165dff);
              margin-left: 2rpx;
            }
          }
        }
      }
    }
  }
}

/* 帮助说明弹窗 */
.help-popup {
  background-color: #ffffff;
  border-radius: 24rpx;
  width: 600rpx;
  max-width: 90vw;

  .help-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx;
    border-bottom: 1rpx solid var(--border-color, #e5e6eb);

    .help-title {
      font-size: 32rpx;
      font-weight: 600;
      color: var(--text-primary, #1d2129);
    }
  }

  .help-content {
    padding: 32rpx;

    .help-text {
      font-size: 28rpx;
      color: var(--text-primary, #1d2129);
      line-height: 1.6;
    }
  }
}

/* 响应式适配 */
@media (max-width: 750rpx) {
  .game-type-section {
    padding: 24rpx;

    .game-type-grid {
      gap: 16rpx;

      .game-type-item {
        padding: 20rpx 12rpx;

        .game-icon {
          width: 48rpx;
          height: 48rpx;
          margin-bottom: 8rpx;
        }

        .game-name {
          font-size: 22rpx;
        }
      }
    }
  }

  .commission-table-section {
    margin: 0 16rpx;

    .table-container {
      .table-header {
        .header-cell {
          padding: 20rpx 12rpx;

          .header-text {
            font-size: 24rpx;
          }

          .header-sub {
            font-size: 18rpx;
          }
        }
      }

      .table-body {
        .table-row {
          .body-cell {
            padding: 16rpx 12rpx;
            font-size: 22rpx;

            &.commission-rate {
              .rate-value {
                font-size: 24rpx;
              }

              .rate-unit {
                font-size: 18rpx;
              }
            }
          }
        }
      }
    }
  }

  .help-popup {
    width: 520rpx;

    .help-header {
      padding: 24rpx;

      .help-title {
        font-size: 28rpx;
      }
    }

    .help-content {
      padding: 24rpx;

      .help-text {
        font-size: 26rpx;
      }
    }
  }
}

/* 超小屏幕适配 */
@media (max-width: 600rpx) {
  .game-type-section {
    .game-type-grid {
      grid-template-columns: repeat(2, 1fr);

      .game-type-item {
        padding: 16rpx 8rpx;

        .game-icon {
          width: 40rpx;
          height: 40rpx;
        }

        .game-name {
          font-size: 20rpx;
        }
      }
    }
  }

  .commission-table-section {
    .table-container {
      .table-header {
        .header-cell {
          padding: 16rpx 8rpx;

          .header-text {
            font-size: 22rpx;
          }

          .header-sub {
            font-size: 16rpx;
          }
        }
      }

      .table-body {
        .table-row {
          .body-cell {
            padding: 12rpx 8rpx;
            font-size: 20rpx;

            &.commission-rate {
              .rate-value {
                font-size: 22rpx;
              }

              .rate-unit {
                font-size: 16rpx;
              }
            }
          }
        }
      }
    }
  }
}
</style>
