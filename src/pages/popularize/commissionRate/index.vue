<template>
  <view class="commission-rate-page">
    <view class="content">
      <wd-status-tip image="content" tip="功能开发中，敬请期待">
        <template #image>
          <wd-icon name="percent" size="80rpx" color="#86909c" />
        </template>
        <view class="empty-title">返佣比例</view>
        <view class="empty-desc">此功能正在开发中，将为您提供详细的返佣比例设置和管理</view>
      </wd-status-tip>
    </view>
  </view>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.commission-rate-page {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.content {
  padding: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #1d2129;
  margin: 24rpx 0 12rpx;
}

.empty-desc {
  font-size: 24rpx;
  color: #86909c;
  text-align: center;
  line-height: 1.5;
}
</style>
