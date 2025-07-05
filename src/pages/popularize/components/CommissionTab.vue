<template>
  <view class="commission-tab">
    <!-- 我的佣金 -->
    <wd-cell-group title="我的佣金" border>
      <wd-cell 
        v-for="(item, index) in commissionItems" 
        :key="index"
        :title="item.label" 
        :value="`¥${item.value}`" 
      />
      <view class="commission-actions">
        <wd-button type="primary" block @click="withdrawCommission">
          提取佣金
        </wd-button>
      </view>
    </wd-cell-group>
  </view>
</template>

<script lang="ts" setup>
// 接收父组件传递的数据
const props = defineProps<{
  commissionItems: Array<{
    label: string
    value: string
  }>
}>()

// 定义事件
const emit = defineEmits<{
  withdrawCommission: []
}>()

/**
 * 提取佣金
 */
const withdrawCommission = () => {
  emit('withdrawCommission')
}
</script>

<style lang="scss" scoped>
.commission-tab {
  // 佣金操作区域
  .commission-actions {
    padding: 20rpx;
  }
}
</style>
