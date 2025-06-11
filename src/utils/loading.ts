import { ref } from "vue";

// 使用Vue的响应式API创建全局状态
const isLoading = ref(false);
const loadingTitle = ref("加载中...");
const loadingIcon = ref("");
const loadingMask = ref(true);

// 显示加载
export function showLoading(options?: { title?: string; icon?: string; mask?: boolean }) {
  if (options?.title) loadingTitle.value = options.title;

  // 处理图标路径，确保正确解析@开头的路径
  if (options?.icon) {
    // 如果路径以@开头，替换为正确的静态资源路径
    if (options.icon.startsWith("@/")) {
      loadingIcon.value = options.icon.replace("@/", "/");
    } else {
      loadingIcon.value = options.icon;
    }
  } else {
    // 如果没有提供图标，确保清空之前的图标
    loadingIcon.value = "";
  }

  if (options?.mask !== undefined) loadingMask.value = options.mask;

  // 确保状态更新后再设置为显示
  setTimeout(() => {
    isLoading.value = true;
  }, 0);
}

// 隐藏加载
export function hideLoading() {
  // 使用setTimeout确保状态更新在下一个事件循环中执行
  setTimeout(() => {
    isLoading.value = false;
  }, 0);
}

// 获取当前加载状态
export function getLoadingState() {
  return {
    show: isLoading.value,
    title: loadingTitle.value,
    customIcon: loadingIcon.value,
    mask: loadingMask.value,
  };
}
