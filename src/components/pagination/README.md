# 分页组件 (Pagination)

一个适用于 uniapp 的深色主题分页组件，样式参考 ElementPlus，功能简洁实用。

## 特性

- 🎨 深色主题设计，符合现代UI风格
- 📱 响应式设计，自适应不同屏幕尺寸
- 🚀 轻量级，无多余功能
- 🔧 TypeScript 支持
- 🌐 支持所有 uniapp 平台

## 基础用法

```vue
<template>
  <Pagination 
    :total="1000" 
    :page="currentPage" 
    :page-size="10"
    @update:page="handlePageChange"
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import Pagination from '@/components/pagination/index.vue'

const currentPage = ref(1)

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleChange = (data) => {
  console.log('分页变化:', data)
}
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| total | 总条目数 | number | 0 |
| page | 当前页数，支持 v-model | number | 1 |
| pageSize | 每页显示条目个数 | number | 10 |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:page | 页码改变时触发 | (page: number) |
| change | 分页改变时触发 | ({ page: number, pageSize: number }) |

## 样式特点

- **深色主题**: 主背景色 `#2c2c2c`，按钮背景色 `#404040`
- **蓝色高亮**: 当前页使用 `#4a90e2` 蓝色高亮
- **圆角设计**: 按钮使用 6px 圆角
- **悬停效果**: 鼠标悬停时按钮上移并变色
- **响应式**: 支持桌面端、平板和手机端

## 响应式断点

- **桌面端** (>768px): 标准尺寸
- **平板端** (≤768px): 中等尺寸
- **手机端** (≤480px): 紧凑尺寸

## 使用示例

查看 `src/examples/pagination-demo.vue` 文件获取完整的使用示例。

## 注意事项

1. 组件使用 uniapp 的 `view` 和 `button` 标签，确保跨平台兼容性
2. 样式使用 SCSS，需要项目支持 SCSS 预处理器
3. 组件内部会自动计算总页数和显示逻辑
4. 支持省略号显示，当页数较多时会智能显示部分页码

## 兼容性

- ✅ H5
- ✅ 小程序 (微信/支付宝/百度/字节跳动/QQ/快手等)
- ✅ App (Android/iOS)
- ✅ 快应用
