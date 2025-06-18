import { useUserStore } from "@/store/modules/user";
import { decrypt, encrypt } from "@/utils/AESUtil";

// 前端全局缓存的信息
const INDEX_DATA_KEY = "INDEX_DATA_KEY";

/**
 * 检查用户登录状态，未登录则跳转到登录页面
 * @returns 返回用户是否已登录
 */
export function checkLogin(): boolean {
  const userStore = useUserStore();

  if (!userStore.userInfo) {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const currentPagePath = `/${currentPage.route}`;

    uni.navigateTo({
      url: `/pages/login/index?redirect=${encodeURIComponent(currentPagePath)}`,
    });
    return false;
  }

  return true;
}

export function setIndexData(data: any) {
  uni.removeStorageSync(INDEX_DATA_KEY);
  uni.setStorageSync(INDEX_DATA_KEY, encrypt(data));
}

export function getIndexData() {
  return decrypt(uni.getStorageSync(INDEX_DATA_KEY)) || null;
}
