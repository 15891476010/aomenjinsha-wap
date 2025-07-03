<template>
  <view style="height: 10px" />
  <wd-card type="rectangle">
    <template #title>
      <view class="title-row">
        <template v-if="userInfo">
          <image
            v-if="userInfo.avatar"
            :src="indexData.imagePrefix + userInfo.avatar"
            class="avatar-img"
          />
          <view class="title-col">
            <view>
              <text>{{ userInfo.nickName }}</text>
              <wd-icon class="ml-3" name="refresh" size="14px" @click="refreshUserInfo"></wd-icon>
            </view>
            <view class="title-tip">
              <wd-icon
                name="creditcard"
                size="14px"
                custom-style="vertical-align: bottom"
              ></wd-icon>
              余额：{{ userInfo.balance }} CNY
            </view>
          </view>
        </template>
        <template v-else>
          <image src="/static/icons/user.png" class="avatar-img" />
          <view class="title-col">
            <view>
              <text>未登录</text>
            </view>
            <view class="title-tip">
              <wd-button type="primary" size="small" @click="goLogin">登录/注册</wd-button>
            </view>
          </view>
        </template>
      </view>
    </template>
    <wd-grid>
      <wd-grid-item
        v-for="(item, index) in targetGrid"
        :key="index"
        class="grid-item"
        use-text-slot
        use-icon-slot
        @click="handleClick(item)"
      >
        <template #icon>
          <image class="slot-img" :src="indexData.imagePrefix + item.icon" />
        </template>
        <template #text>
          <view class="text" :style="{ color: item.color }">{{ item.title }}</view>
        </template>
      </wd-grid-item>
    </wd-grid>
  </wd-card>
</template>

<script setup lang="ts">
import { getIndexData } from "@/utils/auth";
import { ref, onMounted } from "vue";
const indexData = ref(getIndexData());
const targetGrid = ref(indexData.value.targetUrl);
import { useUserStore } from "@/store/modules/user";
import { onLoad } from "@dcloudio/uni-app";
const userStore = useUserStore();
const userInfo = ref<any>(userStore.userInfo);

function handleClick(item: any) {
  console.log(item);
}

async function refreshUserInfo() {
  userInfo.value = await userStore.getInfo();
}

async function goLogin() {
  uni.navigateTo({
    url: "/pages/login/index",
  });
}

onLoad(async () => {
  // await refreshUserInfo();
});
onMounted(async () => {
  await refreshUserInfo();
});
</script>

<style lang="scss">
.content {
  justify-content: flex-start;
}
.title {
  justify-content: space-between;
  font-size: 16px;
}
.title-tip {
  margin-top: 10px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
}
.slot-img {
  width: 36px;
  height: 36px;
  margin-left: -5px;
  border-radius: 4px;
}
.text {
  margin-top: 15px;
}
.title-row {
  display: flex;
  align-items: center;
}
.title-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.avatar-img {
  width: 36px;
  height: 36px;
  margin-right: 8px;
  vertical-align: middle;
  border-radius: 50%;
}
</style>
