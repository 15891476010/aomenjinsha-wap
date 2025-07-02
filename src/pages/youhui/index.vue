<template>
  <view class="youhui-container">
    <view class="user-left">
      <text class="username">
        {{ userInfo && userInfo.username ? userInfo.username : "未登录" }}
      </text>
      <text class="balance">{{ userInfo ? userInfo.balance : 0.0 }} RMB</text>
    </view>
    <!-- 用户信息和金额展示 -->
    <view class="user-info">
      <view class="left">
        <wd-img :width="80" :height="80" src="/static/youhui/icon_vip.png" />
        <view class="info">
          <view class="title">
            <view class="mr-20">您的奖励</view>
            <!-- <wd-button type="warning" size="small">去查看</wd-button> -->
          </view>
          <view class="sub-title">超值奖励等你来拿</view>
        </view>
      </view>
    </view>

    <!-- 分类标签 -->
    <view class="category-tabs">
      <wd-tabs v-model="activeTab" sticky :map-num="1" slidable="always" @change="handleChange">
        <block v-for="(item, index) in tabs" :key="index">
          <wd-tab :title="item.label">
            <!-- 活动列表 -->
            <view
              v-for="(item1, index) in activites"
              :key="index"
              class="activity-list"
              @click="goDetail(item1.id)"
            >
              <image :src="indexData.imagePrefix + item1.image" mode="widthFix" />
              <view class="info">
                <view class="title">{{ item1.title }}</view>
                <!-- <view class="desc">{{ item1.createTime }}</view> -->
              </view>
            </view>
          </wd-tab>
        </block>
      </wd-tabs>
    </view>
    <!-- Toast组件 -->
    <wd-toast />
  </view>
</template>

<script setup lang="ts">
import FrontApi from "@/api/front/index";
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore();
const userInfo = ref<any>(userStore.userInfo || {});
import { getIndexData } from "@/utils/auth";
const indexData = ref(getIndexData());

// 活动标签页
const activeTab = ref(0); // 修改为数字类型，初始值为0
const tabs = ref<OptionType[]>([]);
const tabsIndex = ref(0);

const activites = ref<any[]>([]);

async function getOptions() {
  let res = await FrontApi.getOptionsApi();
  res.unshift({
    label: "全部",
    value: 0, // 修改为非负数值
  });
  tabs.value = res;
}

// 查看活动详情
function goDetail(id: number) {
  uni.navigateTo({
    url: `/pages/youhui/detail?id=${id}`,
  });
}

// 切换活动标签
function handleChange(e: any) {
  tabsIndex.value = tabs.value[e.name].value;
  getActiviteList();
}

function getActiviteList() {
  FrontApi.getActiviteListApi({ pid: tabsIndex.value }).then((res) => {
    activites.value = res;
  });
}

onMounted(async () => {
  // 可以在这里获取用户数据和活动列表
  await getOptions();
  getActiviteList();
});
</script>

<style lang="scss">
.youhui-container {
  position: relative;

  // 高级朦胧效果 - 背景蒙版
  &::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    content: "";
  }
}

.user-left {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: #ffffff;
  background: linear-gradient(to right, #387efe, #349ffa, #31b7f6);
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: linear-gradient(to right, #3175ea, #287fea, #1891ec, #109aec, #02aaee);

  .left {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .info {
      margin-left: 20rpx;

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        color: #ffffff;
      }

      .sub-title {
        font-size: 14px;
        color: #f4ee79;
      }
    }
  }
}

.activity-list {
  width: 90%;
  margin: 20rpx auto;
  border-radius: 20rpx;

  image {
    width: 100%;
    border-radius: 20rpx;
  }

  .info {
    width: 100%;
    .title {
      margin-bottom: 10rpx;
      font-size: 20px;
      font-weight: bold;
    }

    .desc {
      font-size: 16px;
      color: #ffd000;
    }
  }
}

.activity-card {
  position: relative;
  overflow: hidden;
  border-radius: 20rpx;
  transition: all 0.4s ease;

  image {
    width: 100%;
    height: 250rpx;
    object-fit: cover;
  }

  &.glass-effect {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  }

  .card-tag {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    font-size: 24rpx;
    color: white;
    background: linear-gradient(90deg, #e53935, #e35d5b);
    border-bottom-left-radius: 12rpx;

    &.card-tag-blue {
      background: linear-gradient(90deg, #4481eb, #04befe);
    }
  }

  .card-content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .card-left {
      flex: 1;

      .card-title {
        margin-bottom: 16rpx;
        font-size: 34rpx;
        font-weight: bold;
        color: #41476b;
      }

      .card-desc {
        font-size: 26rpx;
        color: #5f83fc;
      }
    }

    .card-right {
      display: flex;
      flex-direction: column;
      align-items: center;

      .explain-btn {
        margin-top: 16rpx;
        font-size: 24rpx;
        background: linear-gradient(90deg, #ffd700, #ffa500);
        border: none;
        transition: all 0.3s ease;
      }
    }
  }

  &:hover {
    box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.25);
    transform: translateY(-6rpx);
  }
}

// 添加图标的动画效果
:deep(.wd-img) {
  transition: all 0.3s ease;

  &:hover {
    filter: drop-shadow(0 0 8rpx rgba(255, 215, 0, 0.6));
    transform: scale(1.05);
  }
}

// 按钮悬浮效果
.explain-btn {
  &:active {
    transform: scale(0.95);
  }
}
</style>
