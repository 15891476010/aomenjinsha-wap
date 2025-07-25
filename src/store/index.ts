import type { App } from "vue";
import { createPinia } from "pinia";

const store = createPinia();

// 全局注册 store
export function setupStore(app: App<Element>) {
  app.use(store);
}

export * from "./modules/user";
export * from "./modules/dict";
export * from "./modules/theme";
export * from "./modules/game";
export * from "./modules/recharge";
export { store };
