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
      <view class="category-title">
        <image class="icon" :src="indexData.imagePrefix + category.icon" mode="aspectFit" />
        <text class="title">{{ category.title }}</text>
      </view>
    </view>

    <view v-if="categoryIndex === 0" class="game-grid">
      <view
        v-for="(game, index) in category.gameCategoryData"
        :key="index"
        class="game-card"
        @click="handleGameClick(game)"
      >
        <view class="game-image-container">
          <image class="game-image" :src="game.icon" mode="aspectFit" />
          <!-- <view v-if="game.tag" class="game-tag" :class="`tag-${game.tag.toLowerCase()}`">
            {{ game.tag }}
          </view> -->
          <view v-if="game.burstRate" class="game-burst-rate">{{ game.burstRate }}万倍</view>
        </view>
        <view class="game-name">{{ game.title }}</view>
      </view>
    </view>

    <view v-else class="game-grid-premium">
      <view
        v-for="(game, index) in category.gamePlatType"
        :key="index"
        class="game-card"
        :style="{ backgroundImage: `url(${indexData.imagePrefix + game.icon})` }"
        @click="navigateToMore(category.id, game)"
      >
        <view v-if="game.isHot" class="hot-icon">
          <image src="/static/images/hot-icon.png" mode="aspectFit" />
        </view>
        <view v-if="game.isShowTitle" class="game-name">{{ game.platTypeName }}</view>
      </view>
    </view>
  </view>
  <wd-toast />
</template>

<script setup lang="ts">
import PublicApi, { GamePageQuery } from "@/api/public";
import GameApi from "@/api/game";
import { getIndexData } from "@/utils/auth";
import { setGameData } from "@/utils/cache";
import { onLoad } from "@dcloudio/uni-app";
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
const scrollOffset = 80; // 使用120px的偏移量

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
  setGameData(game.tag);
  const res = await GameApi.getGameUrlApi(game.id.toString());
  uni.navigateTo({
    url: `/pages/index/components/gamePage?url=${res.Data.url}`,
  });
}

// 查看更多游戏
function navigateToMore(categoryId: number | string, game: any) {
  if (!game.gameCode) {
    const str = game ? `&platTypeId=${game.id}` : "";
    uni.navigateTo({
      url: `/pages/game/index?categoryId=${categoryId}${str}`,
    });
  } else {
    setGameData(game.tag);
    GameApi.getGameHomeUrlApi(game.id.toString()).then((res) => {
      uni.navigateTo({
        url: `/pages/index/components/gamePage?url=${res.Data.url}`,
      });
    });
  }
}

onLoad(() => {
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
  padding: 15rpx 10rpx;
  margin-bottom: 20rpx;
  overflow-x: scroll;
  scrollbar-width: none; /* Firefox */
  background: linear-gradient(to right, #ffffff, #f8f9fa);
  border-radius: 16rpx;
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.08);
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  .game-tab {
    display: flex;
    align-items: center;
    padding: 12rpx 20rpx;
    margin-right: 15rpx;
    font-size: 26rpx;
    color: #666;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 25rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    &.active {
      color: #fff;
      background: linear-gradient(135deg, #0e903f, #0a7a34);
      box-shadow: 0 4rpx 12rpx rgba(14, 144, 63, 0.3);
      transform: translateY(-2rpx);
    }

    &:active {
      transform: scale(0.97);
    }

    .tab-icon {
      width: 45rpx;
      height: 45rpx;
      margin-right: 8rpx;
      object-fit: contain;
      filter: drop-shadow(0 2rpx 3rpx rgba(0, 0, 0, 0.1));
    }

    text {
      display: inline-block;
      text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
      white-space: nowrap;
    }
  }
}

/* 游戏分类区域样式 */
.game-section {
  z-index: 1;
  padding: 25rpx;
  margin-top: 25rpx;
  background: linear-gradient(to bottom, #ffffff, #f9f9f9);
  border-radius: 20rpx;
  box-shadow: 0 5rpx 20rpx rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;

  &:hover {
    box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.1);
  }
}

/* Jackpot奖池样式 */
.jackpot-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  margin: 15rpx 0 25rpx;
  background: linear-gradient(135deg, #f5a623, #f8e71c, #f5a623);
  border-radius: 15rpx;
  box-shadow: 0 8rpx 20rpx rgba(245, 166, 35, 0.3);

  .jackpot-icon {
    position: relative;
    z-index: 2;
    width: 50rpx;
    height: 50rpx;
    margin-right: 15rpx;
    filter: drop-shadow(0 3rpx 5rpx rgba(0, 0, 0, 0.2));
  }

  .jackpot-text {
    position: relative;
    z-index: 2;
    margin-right: 15rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
    letter-spacing: 1rpx;
  }

  .jackpot-amount {
    position: relative;
    z-index: 2;
    font-size: 36rpx;
    font-weight: 800;
    color: #fff;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
    letter-spacing: 1rpx;
  }
}

/* 游戏网格样式 */
.game-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx; /* 增加间距使布局更美观 */

  .game-card {
    position: relative;
    margin-bottom: 20rpx;
    transition: transform 0.3s ease;

    &:active {
      transform: scale(0.97);
    }

    .game-image-container {
      position: relative;
      width: 100%;
      height: 150rpx; /* 增加高度使图片更大 */
      overflow: hidden; /* 确保内容不超出容器 */
      background-color: #f8f8f8; /* 添加背景色 */
      border-radius: 15rpx; /* 增加圆角 */
      box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */

      .game-image {
        width: 100%;
        height: 100%;
        object-fit: cover; /* 确保图片填充容器 */
        border-radius: 15rpx; /* 确保图片也有圆角 */
        transition: transform 0.3s ease;
      }

      /* 游戏标签定位在图片右上角 */
      .game-tag {
        position: absolute;
        top: 3rpx;
        right: 5rpx;
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

/* 高端大气上档次的游戏网格样式 */
.game-grid-premium {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding: 15rpx;
  margin-top: 15rpx;
  border-radius: 20rpx;

  .game-card {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 150%; /* 保持1:1的宽高比 */
    margin-bottom: 20rpx;
    background-color: #f8f8f8;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 15rpx;
    box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:active {
      transform: scale(0.97);
    }

    .hot-icon {
      position: absolute;
      top: 10rpx;
      right: 10rpx;
      z-index: 2;
      width: 40rpx;
      height: 40rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .game-name {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 8rpx 0;
      font-size: 24rpx;
      color: #fff;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 0 0 15rpx 15rpx;
    }
  }
}

/* 分类标题样式 */
.category-title {
  display: flex;
  align-items: center;
  padding: 25rpx 15rpx;
  margin-bottom: 15rpx;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.7));
  border-radius: 15rpx;
  box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.05);

  .icon {
    width: 45rpx;
    height: 45rpx;
    margin-right: 15rpx;
    filter: drop-shadow(0 2rpx 3rpx rgba(0, 0, 0, 0.1));
  }

  .title {
    font-size: 30rpx;
    font-weight: bold;
    color: #222;
    text-shadow: 0 1rpx 2rpx rgba(255, 255, 255, 0.8);
  }

  .more {
    display: flex;
    align-items: center;
    padding: 8rpx 15rpx;
    margin-left: auto;
    font-size: 24rpx;
    color: #666;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 20rpx;
    box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:active {
      background-color: rgba(240, 240, 240, 0.9);
      transform: scale(0.95);
    }
  }
}

/* 查看更多按钮 */
.view-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 80rpx;
  margin: 40rpx auto 15rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #555;
  background: linear-gradient(to right, #f8f9fa, #e9ecef, #f8f9fa);
  border-radius: 40rpx;
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:active {
    box-shadow: 0 3rpx 8rpx rgba(0, 0, 0, 0.05);
    transform: translateY(2rpx);
  }
}
</style>
