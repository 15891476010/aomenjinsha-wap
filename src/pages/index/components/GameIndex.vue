<template>
  <!-- 顶部导航栏 -->
  <view class="game-tabs">
    <view
      v-for="(category, index) in gameCategories"
      :key="index"
      class="game-tab"
      :class="{ active: activeTab === category.id }"
      @click="scrollToCategory(category.id, index)"
    >
      <image class="tab-icon" :src="indexData.imagePrefix + category.icon" mode="aspectFit" />
      <text>{{ category.title }}</text>
    </view>
  </view>

  <!-- 游戏分类区域 -->
  <view
    v-for="(category, categoryIndex) in gameCategories"
    :id="`category-${category.id}`"
    :key="categoryIndex"
    ref="categorySections"
    class="game-section"
  >
    <view class="section-header">
      <view class="section-title">
        <image
          class="category-icon"
          :src="indexData.imagePrefix + category.icon"
          mode="aspectFit"
        />
        <text>{{ category.title }}</text>
      </view>
      <view class="section-more" @click="navigateToMore(category.id)">
        <text>全部</text>
        <wd-icon name="arrow-right" size="14" />
      </view>
    </view>

    <!-- Jackpot奖池显示 (仅在第二个分类显示) -->
    <view v-if="categoryIndex === 1" class="jackpot-container">
      <image class="jackpot-icon" src="/static/images/jackpot-icon.png" mode="aspectFit" />
      <view class="jackpot-text">Jackpot</view>
      <view class="jackpot-amount">9,084,026.77</view>
    </view>

    <view class="game-grid">
      <view
        v-for="(game, index) in category.gameCategoryData"
        :key="index"
        class="game-card"
        @click="handleGameClick(game)"
      >
        <view class="game-image-container">
          <image class="game-image" :src="indexData.imagePrefix + game.icon" mode="aspectFit" />
          <view v-if="game.tag" class="game-tag" :class="`tag-${game.tag.toLowerCase()}`">
            {{ game.tag }}
          </view>
          <view v-if="game.burstRate" class="game-burst-rate">{{ game.burstRate }}万倍</view>
        </view>
        <view class="game-name">{{ game.title }}</view>
      </view>
    </view>

    <!-- 查看更多按钮 -->
    <view class="view-more-btn" @click="navigateToMore(category.id)">查看更多</view>
  </view>
  <wd-toast />
</template>

<script setup lang="ts">
import { useToast } from "wot-design-uni";

const toast = useToast();
import PublicApi, { GamePageQuery } from "@/api/public";
import GameApi from "@/api/game";
import { getIndexData } from "@/utils/auth";
const indexData = ref(getIndexData());

const querParams: GamePageQuery = {
  one: {
    pageNum: 1,
    pageSize: 10,
  },
  two: {
    pageNum: 1,
    pageSize: 90,
  },
};

// 游戏分类数据
const gameCategories = ref([]);

// 当前激活的标签
const activeTab = ref("");
const categorySections = ref([]);

// 设置滚动偏移量
const scrollOffset = 120; // 使用120px的偏移量

// 滚动到对应分类
function scrollToCategory(categoryId, tabIndex) {
  activeTab.value = categoryId;

  // 创建查询对象（兼容小程序和H5）
  const query = uni.createSelectorQuery();

  // 如果是小程序，要加上 this 组件实例
  // const query = uni.createSelectorQuery().in(this); // 如果你在组件中写

  // 查询分类元素的位置
  query.select(`#category-${categoryId}`).boundingClientRect();

  // 查询滚动偏移量
  query.selectViewport().scrollOffset();

  query.exec((res) => {
    const elementRect = res[0]; // category 的位置
    const scrollOffsetInfo = res[1]; // 当前 scrollTop 值

    if (elementRect) {
      const targetScrollTop = scrollOffsetInfo.scrollTop + elementRect.top - scrollOffset;

      uni.pageScrollTo({
        scrollTop: targetScrollTop,
        duration: 300,
      });
    }
  });

  // 水平滚动导航栏到当前激活的标签位置（只适用于 H5）
  // 小程序建议用 scroll-view + scroll-into-view 实现
  // #ifdef H5
  const tabElement = document.querySelector(`.game-tab:nth-child(${tabIndex + 1})`);
  const tabsContainer = document.querySelector(".game-tabs");

  if (tabElement && tabsContainer) {
    const scrollLeft =
      tabElement.offsetLeft - tabsContainer.clientWidth / 2 + tabElement.offsetWidth / 2;
    tabsContainer.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  }
  // #endif
}

// 监听滚动事件，更新当前激活的标签
function handleScroll() {
  if (!categorySections.value.length) return;

  const query = uni.createSelectorQuery();

  const selectorList = gameCategories.value.map((cat) => `#category-${cat.id}`);
  selectorList.forEach((sel) => query.select(sel).boundingClientRect());

  query.exec((rects) => {
    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      if (!rect) continue;

      // 判断是否进入视口（加上scrollOffset偏移）
      if (rect.top <= 100 + scrollOffset && rect.bottom >= scrollOffset) {
        const categoryId = gameCategories.value[i].id;
        if (activeTab.value !== categoryId) {
          activeTab.value = categoryId;

          // 水平滚动导航栏（只对H5处理）
          // #ifdef H5
          const tabElement = document.querySelector(`.game-tab:nth-child(${i + 1})`);
          const tabsContainer = document.querySelector(".game-tabs");

          if (tabElement && tabsContainer) {
            const scrollLeft =
              tabElement.offsetLeft - tabsContainer.clientWidth / 2 + tabElement.offsetWidth / 2;
            tabsContainer.scrollTo({
              left: scrollLeft,
              behavior: "smooth",
            });
          }
          // #endif
        }
        break;
      }
    }
  });
}

async function getGameList() {
  const res = await PublicApi.getGamePageApi(querParams);
  gameCategories.value = res.list;
  return res;
}

// 处理游戏点击
async function handleGameClick(game: any) {
  const res = await GameApi.getGameUrlApi(game.id.toString());
  if (res && res.play_html) {
    document.open();
    document.write(res.play_html);
    document.close();
  } else {
    toast.error("未获取到游戏页面内容");
  }
}

// 查看更多游戏
function navigateToMore(category) {
  console.log("查看更多:", category);
  // 这里可以添加跳转到游戏列表页的逻辑
}

onMounted(() => {
  getGameList().then(() => {
    // 设置默认激活的标签为第一个分类
    if (gameCategories.value.length > 0) {
      activeTab.value = gameCategories.value[0].id;
    }

    // 添加滚动监听
    window.addEventListener("scroll", handleScroll);
  });
});

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style lang="scss">
/* 顶部导航栏样式 */
.game-tabs {
  position: sticky;
  top: 60px;
  z-index: 100;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10rpx 5rpx;
  margin-bottom: 15rpx;
  overflow-x: scroll;
  scrollbar-width: none; /* Firefox */
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  -ms-overflow-style: none; /* IE and Edge */

  .game-tab {
    display: flex;
    align-items: center;
    padding: 8rpx 15rpx;
    margin-right: 15rpx;
    font-size: 24rpx;
    color: #666;
    border-radius: 20rpx;
    transition: all 0.3s;

    &.active {
      color: #fff;
      background-color: #0e903f;
    }

    .tab-icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 6rpx;
      object-fit: contain;
    }

    text {
      display: inline-block; // ✅ 确保文字参与横向排列
      white-space: nowrap;
    }
  }
}

/* 游戏分类区域样式 */
.game-section {
  z-index: -1;
  padding: 20rpx;
  margin-top: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .section-title {
      display: flex;
      align-items: center;
      font-size: 32rpx;
      font-weight: bold;

      .category-icon {
        width: 36px;
        height: 36px;
      }

      text {
        margin-left: 10rpx;
      }
    }

    .section-more {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #999;
    }
  }

  /* Jackpot奖池样式 */
  .jackpot-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15rpx;
    margin-bottom: 20rpx;
    background: linear-gradient(to right, #f5a623, #f8e71c);
    border-radius: 10rpx;

    .jackpot-icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 10rpx;
    }

    .jackpot-text {
      margin-right: 10rpx;
      font-size: 28rpx;
      font-weight: bold;
      color: #fff;
    }

    .jackpot-amount {
      font-size: 32rpx;
      font-weight: bold;
      color: #fff;
    }
  }

  /* 游戏网格样式 */
  .game-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15rpx; /* 增加间距使布局更美观 */

    .game-card {
      position: relative;
      margin-bottom: 20rpx;

      .game-image-container {
        position: relative;
        width: 100%;
        height: 140rpx; /* 增加高度使图片更大 */
        border-radius: 12rpx; /* 增加圆角 */

        .game-image {
          width: 100%;
          height: 100%;
          border-radius: 12rpx; /* 确保图片也有圆角 */
        }

        /* 游戏标签定位在图片右上角 */
        .game-tag {
          position: absolute;
          top: 0;
          right: 2rpx;
          z-index: 0; /* 确保标签在图片上层 */
          padding: 4rpx 10rpx;
          font-size: 20rpx;
          color: #fff;
          text-align: center;
          border-radius: 0 6rpx 0 6rpx; /* 右上圆角与图片圆角保持一致 */

          &.tag-pg {
            background-color: #ff9800;
          }

          &.tag-bb {
            background-color: #2196f3;
          }

          &.tag-db {
            background-color: #4caf50;
          }

          &.tag-pa {
            background-color: #9c27b0;
          }

          &.tag-jdb {
            background-color: #f44336;
          }

          &.tag-k3 {
            background-color: #e91e63;
          }

          &.tag-ssc {
            background-color: #009688;
          }
        }

        .game-burst-rate {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 4rpx 10rpx;
          font-size: 20rpx;
          color: #fff;
          background-color: rgba(255, 0, 0, 0.8);
          border-top-right-radius: 8rpx;
        }
      }

      .game-name {
        margin-top: 10rpx;
        overflow: hidden;
        font-size: 24rpx;
        color: #333;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  /* 查看更多按钮 */
  .view-more-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80%;
    height: 70rpx;
    margin: 30rpx auto 10rpx;
    font-size: 28rpx;
    color: #666;
    background-color: #f5f5f5;
    border-radius: 35rpx;
  }
}
</style>
