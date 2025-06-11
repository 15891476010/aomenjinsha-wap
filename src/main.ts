import { createSSRApp } from "vue";
import App from "./App.vue";
import setupPlugins from "@/plugins";

import "uno.css";
import "@/styles/global.scss";

import { setupStore } from "@/store";

import PublicApi from "@/api/public";
import { setIndexData } from "@/utils/auth";

// 创建响应式的全局数据
const indexData = ref(null);

async function loadIndexData() {
  try {
    const res = await PublicApi.getIndexDataApi();
    setIndexData(res);
    indexData.value = res;
  } catch (error) {
    console.error("Failed to load index data:", error);
    // 可以在这里设置默认值或错误状态
    indexData.value = null;
  }
}

// 在挂载后异步加载数据
loadIndexData();

export function createApp() {
  const app = createSSRApp(App);

  setupStore(app);
  app.use(setupPlugins);
  return {
    app,
  };
}
