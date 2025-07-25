import { defineStore } from "pinia";
import { ref } from "vue";
import { applyThemeToMiniProgram } from "@/utils/theme";
import { getLighterColor, getDarkerColor } from "@/utils/colorUtils";

// 从缓存获取主题色
const getThemeColor = (): string => {
  const savedColor = uni.getStorageSync("themeColor");
  return savedColor || "#165DFF"; // 默认Arco蓝色
};

// 保存主题色到缓存
const setThemeColorCache = (color: string) => {
  uni.setStorageSync("themeColor", color);
};

export const useThemeStore = defineStore("theme", () => {
  // 主题色
  const primaryColor = ref<string>(getThemeColor());

  // 设置主题色
  const setPrimaryColor = (color: string) => {
    primaryColor.value = color;
    setThemeColorCache(color);

    // 检测运行环境，区分处理
    if (typeof document !== "undefined") {
      // H5环境
      document.documentElement.style.setProperty("--primary-color", color);

      // 计算衍生色
      const lighterColor = getLighterColor(color, 0.8);
      const darkerColor = getDarkerColor(color, 0.8);
      document.documentElement.style.setProperty("--primary-color-light", lighterColor);
      document.documentElement.style.setProperty("--primary-color-dark", darkerColor);
    } else {
      // 小程序环境
      applyThemeToMiniProgram(color);
    }
  };

  // 初始化，应用主题色
  const initTheme = () => {
    setPrimaryColor(primaryColor.value);
  };

  return {
    primaryColor,
    setPrimaryColor,
    initTheme,
  };
});
