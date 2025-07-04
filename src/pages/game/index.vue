<template>
  <view class="layout">
    <view class="main">
      <wd-search
        v-model="querParams.title"
        light
        placeholder-left
        placeholder="请输入游戏名称"
        cancel-txt="搜索"
        @cancel="handleQuery"
      />
      <view v-if="isShow" class="content-container">
        <view class="sidebar">
          <view
            v-for="(item, index) in gamePlatTypes"
            :key="index"
            class="sidebar-item"
            :class="{ active: item.platType === querParams.platType }"
            @click="handleSidebarItemClick(item.platType)"
          >
            <view class="sidebar-item-icon">
              <ProgressiveImage
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
          <view v-if="total > 0" class="game-grid">
            <view
              v-for="(game, index) in gameList"
              :key="index"
              v-bg-load="game.icon"
              class="game-card"
              @click="handleGameClick(game)"
            >
              <!-- <view v-if="game.tag" class="game-tag" :class="`tag-${game.tag.toLowerCase()}`">
                {{ game.tag }}
              </view> -->
              <view class="game-name">{{ game.title }}</view>
            </view>
          </view>
          <wd-status-tip
            v-else
            :image-size="{
              height: 200,
              width: 300,
            }"
            image="search"
            tip="当前搜索无结果"
          />
        </view>
        <!-- <wd-pagination
          v-if="total > 0"
          v-model="querParams.pageNum"
          show-icon
          :total="total"
          :page-size="querParams.pageSize"
          class="pagination-container"
          @change="handleChange"
        /> -->
        <Pagination
          class="pagination"
          :total="total"
          :page="querParams.pageNum"
          :page-size="querParams.pageSize"
          @change="handleChange"
        />
      </view>

      <view v-else class="content-container">
        <!-- 游戏卡片网格 -->
        <view class="game-container">
          <view v-if="categoryList.length > 0" class="game-grid">
            <view
              v-for="(game, index) in categoryList"
              :key="index"
              v-bg-load="indexData.imagePrefix + game.icon"
              class="game-card"
              @click="handleGameClick(game)"
            >
              <!-- <view v-if="game.tag" class="game-tag" :class="`tag-${game.tag.toLowerCase()}`">
                {{ game.tag }}
              </view> -->
              <view class="game-name">{{ game.platTypeName }}</view>
            </view>
          </view>
          <wd-status-tip
            v-else
            :image-size="{
              height: 200,
              width: 300,
            }"
            image="search"
            tip="当前搜索无结果"
          />
          <view class="h-50"></view>
        </view>
      </view>
    </view>
    <wd-toast />
  </view>
</template>

<script setup lang="ts">
import Pagination from "@/components/pagination/index.vue";
import PublicApi from "@/api/public";
import { getIndexData } from "@/utils/auth";
import { useToast } from "wot-design-uni";
import GameApi from "@/api/game";
import { setGameData } from "@/utils/cache";
import { ref, reactive, watch } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import ProgressiveImage from "@/components/ProgressiveImage.vue";

const toast = useToast();
const indexData = ref(getIndexData());
const querParams = reactive({
  categoryId: 0,
  pageNum: 1,
  pageSize: 51,
  title: "",
  platType: "",
});
const total = ref(0);

const isShow = ref(true);
const gamePlatTypes = ref<any[]>([]);
const gameList = ref<any[]>([]);
const loading = ref(false);
const platTypeId = ref<string | null>(null);
const categoryList = ref<any[]>([]);

// 在页面加载时设置标题
onLoad((options: any) => {
  querParams.categoryId = options?.categoryId ? Number(options.categoryId) : 0;
  platTypeId.value = options?.platTypeId || null;

  // 修复字符串与数字的比较
  const categoryIdStr = String(querParams.categoryId);
  if (categoryIdStr === "3" || categoryIdStr === "6" || categoryIdStr === "7") {
    isShow.value = false;
  }

  handleQuery();
});

// 也可以在页面显示时设置标题
onShow(() => {
  // 如果需要在每次页面显示时更新标题，可以在这里设置
  // setPageTitle("新的标题");
});

function handleChange(item: any) {
  querParams.pageNum = item.pageNum;
  fetchGameList();
}

async function handleQuery() {
  // 处理查询逻辑
  loading.value = true;
  try {
    const res = await PublicApi.getGameCategoryByIdApi(querParams.categoryId);
    setPageTitle(res.title);
    gamePlatTypes.value = res.gamePlatTypes;
    if (isShow.value) {
      if (platTypeId.value) {
        const plat = res.gamePlatTypes.filter((item: any) => {
          return item.id === platTypeId.value;
        });
        querParams.platType = plat[0].platType;
      } else {
        querParams.platType = res.gamePlatTypes[0].platType;
      }
    }

    if (isShow.value) {
      // 获取游戏列表
      await fetchGameList();
    } else {
      await fetchGamePlatTypeByList();
    }
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
    const res = await PublicApi.getGameListByPlatformApi(querParams);

    // 模拟数据，实际项目中应该使用API返回的数据
    // 如果API不存在，请根据实际情况调整
    gameList.value = res?.records;
    total.value = res.total;
  } catch (error) {
    console.error("获取游戏列表失败", error);
  } finally {
    loading.value = false;
  }
}

async function fetchGamePlatTypeByList() {
  try {
    const res = await PublicApi.getGamePlatTypeByCaIdApi(querParams.categoryId);
    categoryList.value = res;
  } catch (error) {
    console.error("获取游戏平台类型失败", error);
  }
}

// 处理侧边栏点击
function handleSidebarItemClick(platType: string) {
  const plat = gamePlatTypes.value.filter((item: any) => {
    return item.platType === platType;
  });
  querParams.platType = platType;
  querParams.pageNum = 1;

  // 更新URL参数，不刷新页面
  const currentRoute = getCurrentPages()[getCurrentPages().length - 1].route;
  const newUrl = `#/${currentRoute}?categoryId=${querParams.categoryId}&platTypeId=${plat[0]?.id || ""}`;

  // 使用history API更新URL，不触发页面跳转
  // #ifdef H5
  history.replaceState({}, "", newUrl);
  // #endif

  fetchGameList();
}

// 修改为监听title
watch(
  () => querParams.title,
  (newVal: string) => {
    if (querParams.title !== newVal) {
      querParams.pageNum = 1;
    }
  }
);

// 处理游戏点击
async function handleGameClick(game: any) {
  const res = await GameApi.getGameUrlApi(game.id.toString(), isShow.value ? false : true);
  if (res.Code !== 0) {
    uni.showToast({
      title: res.Message,
      icon: "error",
    });
    return;
  }
  // 判断res中是否有data属性
  if (res.Data) {
    // #ifdef H5
    window.location.href = res.Data.url;
    // #endif

    // #ifdef APP-PLUS || APP-NVUE || APP
    // 在APP内部打开链接，而不是跳转到外部浏览器
    uni.navigateTo({
      url: `/pages/index/components/gamePage?url=${encodeURIComponent(res.Data.url)}`,
    });
    // #endif

    setGameData(game);
  }
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

onShow(() => {
  console.log("我显示了");
});
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
  overflow: hidden;
  background: #f8f8f8;

  .main {
    width: 95%;
    margin: 0 auto;

    .content-container {
      position: relative;
      display: flex;
      width: 100%;

      .pagination {
        position: absolute;
        right: 0;
        bottom: 0;
        width: calc(100% - 120px);
      }
    }

    .sidebar {
      flex-shrink: 0;
      width: 100px;
      height: calc(100vh - 60px);
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
      }
    }

    .game-container {
      position: relative;
      flex: 1;
      height: calc(100vh - 100px);
      padding-left: 20rpx;
      overflow-x: hidden;
    }

    .pagination-container {
      position: fixed;
      right: 0;
      bottom: 0;
      width: calc(100% - 115px);
      background: white;
    }

    /* 游戏网格样式 */
    .game-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20rpx;
      padding: 0rpx;
      margin-top: 15rpx;
      border-radius: 20rpx;

      .game-card {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 100%; /* 保持1:1的宽高比 */
        margin-top: 20px;
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

        .game-tag {
          position: absolute;
          top: 5rpx;
          right: 0;
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

        .game-name {
          position: relative;
          width: 100%;
          padding: 8rpx 0;
          margin-top: 100%;
          font-size: 20rpx;
          color: #fff;
          text-align: center;
          background-color: rgba(0, 0, 0, 0.6);
          border-radius: 0 0 15rpx 15rpx;
        }
      }
    }
  }
}
</style>
