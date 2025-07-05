<template>
  <view class="default-tab">
    <!-- 其他标签页的默认内容 -->
    <wd-cell-group :title="title" border>
      <wd-cell title="功能开发中" value="敬请期待" />
      <wd-cell title="更多功能" value="即将上线" />
    </wd-cell-group>
  </view>
</template>

<script lang="ts" setup>
// 接收父组件传递的数据
const props = defineProps<{
  title: string
}>()
</script>

<style lang="scss" scoped>
.default-tab {
  // 可以添加特定的样式
}
</style>
