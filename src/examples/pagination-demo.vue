<template>
  <view class="demo-container">
    <view class="demo-title">分页组件示例</view>
    
    <!-- 基础用法 -->
    <view class="demo-section">
      <view class="section-title">基础用法</view>
      <Pagination 
        :total="1000" 
        :page="currentPage1" 
        :page-size="10"
        @update:page="handlePageChange1"
        @change="handleChange1"
      />
      <view class="demo-info">
        当前页: {{ currentPage1 }}, 总共: {{ Math.ceil(1000 / 10) }} 页
      </view>
    </view>

    <!-- 大数据量 -->
    <view class="demo-section">
      <view class="section-title">大数据量</view>
      <Pagination 
        :total="5000" 
        :page="currentPage2" 
        :page-size="20"
        @update:page="handlePageChange2"
        @change="handleChange2"
      />
      <view class="demo-info">
        当前页: {{ currentPage2 }}, 总共: {{ Math.ceil(5000 / 20) }} 页
      </view>
    </view>

    <!-- 少页数 -->
    <view class="demo-section">
      <view class="section-title">少页数</view>
      <Pagination 
        :total="50" 
        :page="currentPage3" 
        :page-size="10"
        @update:page="handlePageChange3"
        @change="handleChange3"
      />
      <view class="demo-info">
        当前页: {{ currentPage3 }}, 总共: {{ Math.ceil(50 / 10) }} 页
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Pagination from '@/components/pagination/index.vue'

defineOptions({
  name: 'PaginationDemo'
})

// 响应式数据
const currentPage1 = ref(1)
const currentPage2 = ref(15)
const currentPage3 = ref(2)

// 事件处理
const handlePageChange1 = (page: number) => {
  currentPage1.value = page
  console.log('页码变化1:', page)
}

const handleChange1 = (data: { page: number; pageSize: number }) => {
  console.log('分页变化1:', data)
}

const handlePageChange2 = (page: number) => {
  currentPage2.value = page
  console.log('页码变化2:', page)
}

const handleChange2 = (data: { page: number; pageSize: number }) => {
  console.log('分页变化2:', data)
}

const handlePageChange3 = (page: number) => {
  currentPage3.value = page
  console.log('页码变化3:', page)
}

const handleChange3 = (data: { page: number; pageSize: number }) => {
  console.log('分页变化3:', data)
}
</script>

<style scoped lang="scss">
.demo-container {
  padding: 20px;
  background-color: #1a1a1a;
  min-height: 100vh;
}

.demo-title {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  margin-bottom: 30px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  background-color: #2a2a2a;
  border-radius: 8px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 20px;
}

.demo-info {
  margin-top: 15px;
  padding: 10px;
  background-color: #333;
  border-radius: 4px;
  color: #ccc;
  font-size: 14px;
  text-align: center;
}
</style>
