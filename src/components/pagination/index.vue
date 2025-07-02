<template>
  <view class="pagination">
    <view class="pagination-nav">
      <!-- 上一页按钮 - 第一页时不显示 -->
      <button v-if="currentPage > 1" class="pagination-button prev" @click="handlePrevPage">
        <text class="arrow-icon">&lt;</text>
      </button>

      <!-- 页码按钮 -->
      <view class="pagination-pages">
        <!-- 第一页始终显示 -->
        <button
          v-if="totalPages > 0"
          :class="['pagination-page-item', currentPage === 1 ? 'active' : '']"
          @click="handleChangePage(1)"
        >
          1
        </button>

        <!-- 左侧省略号 -->
        <button
          v-if="showLeftEllipsis"
          class="pagination-page-item pagination-more"
          @click="handleJumpBackward"
        >
          ...
        </button>

        <!-- 中间页码 -->
        <button
          v-for="item in middlePages"
          :key="item"
          :class="['pagination-page-item', currentPage === item ? 'active' : '']"
          @click="handleChangePage(item)"
        >
          {{ item }}
        </button>

        <!-- 右侧省略号 -->
        <button
          v-if="showRightEllipsis"
          class="pagination-page-item pagination-more"
          @click="handleJumpForward"
        >
          ...
        </button>

        <!-- 最后一页始终显示 -->
        <button
          v-if="totalPages > 1"
          :class="['pagination-page-item', currentPage === totalPages ? 'active' : '']"
          @click="handleChangePage(totalPages)"
        >
          {{ totalPages }}
        </button>
      </view>

      <!-- 下一页按钮 - 最后一页时不显示 -->
      <button
        v-if="currentPage < totalPages"
        class="pagination-button next"
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
  // 添加主题色属性，默认值与项目保持一致
  themeColor: {
    type: String,
    default: "#FFA500", // 假设项目的主题色为橙色，您可以调整为实际的主题色
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

// 计算需要显示的中间页码
const middlePages = computed(() => {
  if (totalPages.value <= 5) {
    // 如果总页数小于等于5，则显示2到totalPages-1的所有页码
    return Array.from({ length: totalPages.value - 1 }, (_, i) => i + 2);
  }

  // 对于大于5页的情况，始终显示固定数量的中间页码（3个）
  const middleArray = [];
  let startPage, endPage;

  // 靠近首页
  if (currentPage.value <= 3) {
    startPage = 2;
    endPage = 4;
  }
  // 靠近尾页
  else if (currentPage.value >= totalPages.value - 2) {
    startPage = totalPages.value - 3;
    endPage = totalPages.value - 1;
  }
  // 中间位置
  else {
    startPage = currentPage.value - 1;
    endPage = currentPage.value + 1;
  }

  for (let i = startPage; i <= endPage; i++) {
    if (i > 1 && i < totalPages.value) {
      middleArray.push(i);
    }
  }

  return middleArray;
});

// 是否显示左侧省略号
const showLeftEllipsis = computed(() => {
  return totalPages.value > 5 && currentPage.value > 3;
});

// 是否显示右侧省略号
const showRightEllipsis = computed(() => {
  return totalPages.value > 5 && currentPage.value < totalPages.value - 2;
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

// 省略号向前跳转3页
const handleJumpBackward = () => {
  const targetPage = Math.max(1, currentPage.value - 3);
  handleChangePage(targetPage);
};

// 省略号向后跳转3页
const handleJumpForward = () => {
  const targetPage = Math.min(totalPages.value, currentPage.value + 3);
  handleChangePage(targetPage);
};
</script>

<style scoped lang="scss">
.pagination {
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  padding: 16px;
  font-size: 18px;
  user-select: none;
  background-color: #2c2c2c;
  border-radius: 8px;

  &-nav {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  &-pages {
    display: flex;
    gap: 4px;
    align-items: center;
    margin: 0 4px;
  }

  &-more {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    font-weight: bold;
    color: #fff;
    cursor: pointer;
    user-select: none;

    &:hover {
      color: v-bind("props.themeColor");
    }
  }

  &-button,
  &-page-item {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    //border: 1px solid red;
    padding: 13px;
    margin: 2px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    cursor: pointer;
    background-color: #404040;
    border: 1px solid #555;
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background-color: v-bind("props.themeColor");
      border-color: v-bind("props.themeColor");
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
      background-color: v-bind("props.themeColor");
      border-color: v-bind("props.themeColor");
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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
