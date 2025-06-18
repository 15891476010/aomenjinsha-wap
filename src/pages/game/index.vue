<template>
  <view class="layout">
    <view class="main">
      <wd-search
        v-model="querParams.gameName"
        light
        placeholder-left
        placeholder="请输入游戏名称"
        cancel-txt="搜索"
        @cancel="handleQuery"
      />
      <view class="content-container">
        <view v-if="isShow" class="sidebar">
          <view
            v-for="(item, index) in gamePlatTypes"
            :key="index"
            class="sidebar-item"
            :class="{ active: item.platType === querParams.gamePlatType }"
            @click="handleSidebarItemClick(item.platType)"
          >
            <view class="sidebar-item-icon">
              <image
                class="icon-image"
                :src="indexData.imagePrefix + item.smallIcon"
                mode="aspectFit"
              />
            </view>
            <view class="sidebar-item-label">{{ item.platTypeName }}</view>
          </view>
        </view>

        <!-- 游戏卡片网格 -->
        <view class="game-container">
          <view class="game-grid">
            <view
              v-for="(game, index) in gameList"
              :key="index"
              class="game-card"
              @click="handleGameClick(game)"
            >
              <view class="game-image-container">
                <image class="game-image" :src="game.icon" mode="aspectFit" />
                <view v-if="game.tag" class="game-tag" :class="`tag-${game.tag.toLowerCase()}`">
                  {{ game.tag }}
                </view>
              </view>
              <view class="game-name">{{ game.title }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <wd-toast />
  </view>
</template>

<script setup lang="ts">
import PublicApi from "@/api/public";
import GameApi from "@/api/game";
import { getIndexData } from "@/utils/auth";
import { useToast } from "wot-design-uni";

const toast = useToast();
const indexData = ref(getIndexData());
const categoryId = ref(0);
const querParams = reactive({
  categoryId: 0,
  page: 1,
  pageSize: 20,
  gameName: "",
  gamePlatType: "",
});

const isShow = ref(true);
const gamePlatTypes = ref([]);
const gameList = ref([]);
const loading = ref(false);

// 在页面加载时设置标题
onLoad((options) => {
  // 可以从options中获取参数，例如游戏ID或名称
  console.log(options);
  categoryId.value = options?.categoryId || "0";
  if (categoryId.value == "3" || categoryId.value == "6" || categoryId.value == "7") {
    isShow.value = false;
  }
  handleQuery();
});

// 也可以在页面显示时设置标题
onShow(() => {
  // 如果需要在每次页面显示时更新标题，可以在这里设置
  // setPageTitle("新的标题");
});

async function handleQuery() {
  // 处理查询逻辑
  loading.value = true;
  try {
    const res = await PublicApi.getGameCategoryByIdApi(categoryId.value);
    setPageTitle(res.title);
    gamePlatTypes.value = res.gamePlatTypes;
    querParams.gamePlatType = res.gamePlatTypes[0].platType;

    // 获取游戏列表
    await fetchGameList();
  } catch (error) {
    console.error("获取数据失败", error);
    toast.error("获取数据失败");
  } finally {
    loading.value = false;
  }
}

// 获取游戏列表
async function fetchGameList() {
  loading.value = true;
  try {
    // 这里需要根据实际API调整
    const res = await PublicApi.getGameListApi({
      categoryId: categoryId.value,
      platType: querParams.gamePlatType,
      gameName: querParams.gameName,
      page: querParams.page,
      pageSize: querParams.pageSize,
    });

    // 模拟数据，实际项目中应该使用API返回的数据
    // 如果API不存在，请根据实际情况调整
    gameList.value = res?.list || mockGameList();
  } catch (error) {
    console.error("获取游戏列表失败", error);
    // 使用模拟数据
    gameList.value = mockGameList();
  } finally {
    loading.value = false;
  }
}

// 处理侧边栏点击
function handleSidebarItemClick(platType) {
  querParams.gamePlatType = platType;
  querParams.page = 1;
  fetchGameList();
}

// 监听游戏名称搜索
watch(
  () => querParams.gameName,
  (newVal) => {
    if (querParams.gameName !== newVal) {
      querParams.page = 1;
    }
  }
);

// 处理游戏点击
function handleGameClick(game) {
  console.log("点击游戏", game);
  // 根据实际需求跳转到游戏详情页或直接启动游戏
  toast.success(`即将进入游戏: ${game.title}`);
  // 实际项目中可能需要调用API启动游戏
  // GameApi.startGame(game.id);
}

// 封装设置标题的方法，方便在不同地方调用
function setPageTitle(title: string) {
  uni.setNavigationBarTitle({
    title: title,
    success: () => {
      console.log("标题设置成功");
    },
    fail: (err) => {
      console.error("标题设置失败", err);
    },
  });
}

// 模拟游戏数据
function mockGameList() {
  const tags = ["PG", "BB", "DB", "PA", "JDB"];
  const games = [];

  for (let i = 1; i <= 20; i++) {
    games.push({
      id: i,
      title: `游戏${i}`,
      icon: indexData.value.imagePrefix + "/game/icon" + ((i % 5) + 1) + ".png",
      tag: tags[i % tags.length],
      isHot: i % 3 === 0,
      burstRate: i % 2 === 0 ? (i * 0.5).toFixed(1) : null,
    });
  }

  return games;
}
</script>

<style lang="scss" scoped>
.layout {
  // 使用calc函数减去标题栏高度
  // 在uni-app中，标题栏高度通常是44px，状态栏高度根据设备不同
  height: calc(100vh - var(--status-bar-height) - 44px);
  overflow: scroll;
  background: #f8f8f8;

  .main {
    width: 95%;
    margin: 0 auto;

    .content-container {
      display: flex;
      margin-top: 20rpx;
    }

    .sidebar {
      flex-shrink: 0;
      width: 120px;
      height: calc(100vh - var(--status-bar-height) - 105px);
      padding: 10rpx 0;
      overflow: scroll;

      .sidebar-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 90%;
        padding: 15rpx 0;
        margin: 15rpx auto;
        color: #666;
        background-color: #fff;
        border-radius: 15rpx;
        transition: all 0.3s ease;

        .sidebar-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 60rpx;

          .icon-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .sidebar-item-label {
          font-size: 24rpx;
          text-align: center;
        }
      }

      .active {
        color: white;
        background-image: url("./images/itemBg.avif");
        background-position: center;
        background-size: cover;

        .sidebar-item-icon {
          border: 2rpx solid rgba(255, 255, 255, 0.5);
        }
      }
    }

    .game-container {
      flex: 1;
      height: calc(100vh - var(--status-bar-height) - 105px);
      padding-left: 20rpx;
      overflow-y: auto;
    }

    /* 游戏网格样式 */
    .game-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20rpx;
      padding: 10rpx;

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
          height: 150rpx;
          overflow: hidden;
          background-color: #f8f8f8;
          border: none; /* 明确移除边框 */
          border-radius: 15rpx;
          box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);

          .game-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border: none; /* 明确移除边框 */
            border-radius: 14rpx; /* 略小于容器的圆角，避免边缘重叠 */
            transition: transform 0.3s ease;
          }

          /* 游戏标签定位在图片右上角 */
          .game-tag {
            position: absolute;
            top: 0;
            right: 2rpx;
            z-index: 0;
            padding: 4rpx 10rpx;
            font-size: 20rpx;
            color: #fff;
            text-align: center;
            border-radius: 0 6rpx 0 6rpx;

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
  }
}
</style>
