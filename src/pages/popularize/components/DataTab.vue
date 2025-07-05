<template>
  <view class="data-tab">
    <!-- 我的数据 -->
    <wd-cell-group title="我的数据" border>
      <wd-grid :column="2" border>
        <wd-grid-item 
          v-for="(item, index) in dataItems" 
          :key="index"
          :text="item.label"
          custom-class="data-grid-item"
        >
          <template #icon>
            <view class="data-value">{{ item.value }}</view>
          </template>
        </wd-grid-item>
      </wd-grid>
    </wd-cell-group>
  </view>
</template>

<script lang="ts" setup>
// 接收父组件传递的数据
const props = defineProps<{
  dataItems: Array<{
    label: string
    value: string
  }>
}>()
</script>

<style lang="scss" scoped>
.data-tab {
  // 数据网格项
  :deep(.data-grid-item) {
    .wd-grid-item__content {
      flex-direction: column;
      padding: 32rpx 24rpx;
      background: linear-gradient(to right, #165DFF, #3175ea);
      color: #ffffff;
      border-radius: 12rpx;
      box-shadow: 0 4rpx 12rpx rgba(22, 93, 255, 0.3);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2rpx);
        box-shadow: 0 6rpx 16rpx rgba(22, 93, 255, 0.4);
      }

      .wd-grid-item__text {
        color: #ffffff;
        font-size: 28rpx;
        margin-top: 12rpx;
        opacity: 0.9;
        font-weight: 500;
      }
    }

    .data-value {
      font-size: 40rpx;
      font-weight: 600;
      color: #ffffff;
      text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
