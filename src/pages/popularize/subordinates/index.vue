<template>
  <view class="subordinates-page">
    <view class="content">
      <wd-status-tip image="content" tip="功能开发中，敬请期待">
        <template #image>
          <wd-icon name="user" size="80rpx" color="#86909c" />
        </template>
        <view class="empty-title">下级信息</view>
        <view class="empty-desc">此功能正在开发中，将为您提供下级用户的详细信息管理</view>
      </wd-status-tip>
    </view>
  </view>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.subordinates-page {
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
