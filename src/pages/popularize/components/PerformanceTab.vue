<template>
  <view class="performance-tab">
    <!-- 我的业绩 -->
    <wd-cell-group title="我的业绩" border>
      <wd-cell 
        v-for="(item, index) in performanceItems" 
        :key="index"
        :title="item.label" 
        :value="`¥${item.value}`" 
      />
    </wd-cell-group>
  </view>
</template>

<script lang="ts" setup>
// 接收父组件传递的数据
const props = defineProps<{
  performanceItems: Array<{
    label: string
    value: string
  }>
}>()
</script>

<style lang="scss" scoped>
.performance-tab {
  // 可以添加特定的样式
}
</style>
