<template>
  <view class="pagination">
    <view class="pagination-nav">
      <!-- 上一页按钮 -->
      <button class="pagination-button prev" :disabled="currentPage <= 1" @click="handlePrevPage">
        <text class="arrow-icon">&lt;</text>
      </button>

      <!-- 页码按钮 -->
      <view class="pagination-pages">
        <button
          v-for="item in totalPages"
          :class="['pagination-page-item', currentPage === item ? 'active' : '']"
          @click="handleChangePage(item)"
        >
          {{ item }}
        </button>
      </view>

      <!-- 下一页按钮 -->
      <button
        class="pagination-button next"
        :disabled="currentPage >= totalPages"
        @click="handleNextPage"
      >
        <text class="arrow-icon">&gt;</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

defineOptions({
  name: "Pagination",
});

const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  page: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["change"]);

// 响应式状态
const currentPage = ref(props.page);
const currentPageSize = ref(props.pageSize);

// 计算属性
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.total / currentPageSize.value));
});

// 监听props变化
watch(
  () => props.page,
  (newPage) => {
    currentPage.value = newPage;
  }
);

watch(
  () => props.pageSize,
  (newPageSize) => {
    currentPageSize.value = newPageSize;
  }
);

// 处理事件
const handleChangePage = (page: number) => {
  if (page !== currentPage.value) {
    currentPage.value = page;
    emit("change", { pageNum: page, pageSize: currentPageSize.value });
  }
};

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    handleChangePage(currentPage.value - 1);
  }
};

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    handleChangePage(currentPage.value + 1);
  }
};
</script>

<style scoped lang="scss">
.pagination {
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background-color: #2c2c2c;
  border-radius: 8px;
  font-size: 18px;
  user-select: none;

  &-nav {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &-pages {
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 0 4px;
  }

  &-more {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    color: #999;
    font-weight: bold;
    user-select: none;
  }

  &-button,
  &-page-item {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 50px;
    //border: 1px solid red;
    padding: 17px;
    margin: 2px;
    cursor: pointer;
    background-color: #404040;
    border: 1px solid #555;
    border-radius: 6px;
    color: #fff;
    font-size: 17px;
    font-weight: bold;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background-color: #4a90e2;
      border-color: #4a90e2;
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      color: #666;
      cursor: not-allowed;
      background-color: #333;
      border-color: #444;
      opacity: 0.6;

      &:hover {
        transform: none;
      }
    }

    &.active {
      color: #fff;
      background-color: #4a90e2;
      border-color: #4a90e2;
      box-shadow: 0 2px 4px rgba(74, 144, 226, 0.3);
    }

    .arrow-icon {
      font-size: 16px;
      font-weight: bold;
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pagination {
    padding: 12px;
    font-size: 12px;

    &-button,
    &-page-item {
      min-width: 28px;
      height: 28px;
      font-size: 12px;

      .arrow-icon {
        font-size: 14px;
      }
    }

    &-more {
      min-width: 28px;
      height: 28px;
      font-size: 12px;
    }
  }
}

@media (max-width: 480px) {
  .pagination {
    padding: 8px;

    &-nav {
      gap: 2px;
    }

    &-pages {
      gap: 2px;
      margin: 0 2px;
    }

    &-button,
    &-page-item {
      min-width: 24px;
      height: 24px;
      font-size: 11px;

      .arrow-icon {
        font-size: 12px;
      }
    }

    &-more {
      min-width: 24px;
      height: 24px;
      font-size: 11px;
    }
  }
}
</style>
