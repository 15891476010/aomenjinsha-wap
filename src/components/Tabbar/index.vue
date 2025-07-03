<template>
  <wd-tabbar
    v-model="tabbar"
    fixed
    :active-color="indexData.tabbar[0].choose_text_color"
    :inactive-color="indexData.tabbar[0].no_choose_text_color"
    :z-index="1000"
    class="tabbar-container"
    @change="handleChange"
  >
    <wd-tabbar-item
      v-for="(item, index) in indexData.tabbar"
      :key="index"
      :title="item.title"
      :value="item.tag"
    >
      <template #icon>
        <wd-img
          v-show="index === tabbar"
          height="40px"
          width="40px"
          :src="indexData.imagePrefix + item.choose_icon"
          class="tab-icon"
        ></wd-img>
        <wd-img
          v-show="index !== tabbar"
          height="30px"
          width="30px"
          :src="indexData.imagePrefix + item.no_choose_icon"
          class="tab-icon"
        ></wd-img>
      </template>
    </wd-tabbar-item>
  </wd-tabbar>
  <wd-toast />
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getIndexData } from "@/utils/auth";
const indexData = ref(getIndexData());
const tabbar = ref(0);

function handleChange() {
  const item = indexData.value.tabbar[tabbar.value];
  if (item && item.target_url) {
    // 获取当前页面路径
    const pages = getCurrentPages();
    const currentRoute = pages[pages.length - 1].route;

    // 去掉 target_url 前面的斜杠
    const targetRoute = item.target_url;
    if (currentRoute === targetRoute) {
      return;
    }
    // 处理路径格式，确保以/开头
    let url = item.target_url;
    if (!url.startsWith("/")) {
      url = "/" + url;
    }

    uni.redirectTo({
      url: url,
    });
  }
}

onMounted(() => {
  const pages = getCurrentPages();
  const currentRoute = pages[pages.length - 1].route;
  // 遍历tabbar，找到匹配的index
  const index = indexData.value.tabbar.findIndex(
    (item: any) => item.target_url && item.target_url === currentRoute
  );
  if (index !== -1) {
    tabbar.value = index;
  }
});
</script>

<style lang="scss">
.tabbar-container {
  :deep(.wd-tabbar) {
    height: 70px;
  }

  .tab-icon {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .tab-icon[v-show="false"] {
    opacity: 0;
    transform: scale(0.8);
  }
}
</style>
