import { App } from "vue";

// 渐进式背景图加载指令
export const progressiveBackground = {
  mounted(el: HTMLElement, binding: any) {
    // 保存原始背景样式
    const originalBackground = el.style.background;

    // 设置骨架屏背景
    el.style.background = "linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0)";
    el.style.backgroundSize = "200% 100%";
    el.style.animation = "shimmer 1.5s infinite";
    el.style.transition = "background 0.5s ease";

    // 如果没有有效的图片URL，则不进行加载
    if (!binding.value) {
      return;
    }

    // 创建图片对象预加载
    const img = new Image();
    img.src = binding.value;

    // 图片加载完成后应用背景
    img.onload = () => {
      // 使用setTimeout增加一点延迟，让骨架屏过渡更平滑
      setTimeout(() => {
        // 恢复原始背景样式
        el.style.background = originalBackground;
        el.style.backgroundImage = `url(${binding.value})`;
        el.style.animation = "none";
        el.style.transition = "background-image 0.5s ease";
      }, 100);
    };

    // 图片加载失败处理
    img.onerror = () => {
      el.style.animation = "none";
      el.style.background = "#f8f8f8";

      // 可以选择添加一个错误标记
      const errorMark = document.createElement("div");
      errorMark.style.position = "absolute";
      errorMark.style.top = "50%";
      errorMark.style.left = "50%";
      errorMark.style.transform = "translate(-50%, -50%)";
      errorMark.style.fontSize = "22rpx";
      errorMark.style.color = "#999";
      errorMark.textContent = "图片加载失败";

      // 确保el是相对定位或绝对定位
      const position = window.getComputedStyle(el).position;
      if (position === "static") {
        el.style.position = "relative";
      }

      el.appendChild(errorMark);
    };
  },
  updated(el: HTMLElement, binding: any) {
    if (binding.oldValue !== binding.value) {
      // 保存原始背景样式
      const originalBackground = el.style.background;

      // 设置骨架屏背景
      el.style.background = "linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0)";
      el.style.backgroundSize = "200% 100%";
      el.style.animation = "shimmer 1.5s infinite";

      // 如果没有有效的图片URL，则不进行加载
      if (!binding.value) {
        return;
      }

      // 创建图片对象预加载
      const img = new Image();
      img.src = binding.value;

      // 图片加载完成后应用背景
      img.onload = () => {
        // 使用setTimeout增加一点延迟，让骨架屏过渡更平滑
        setTimeout(() => {
          // 恢复原始背景样式
          el.style.background = originalBackground;
          el.style.backgroundImage = `url(${binding.value})`;
          el.style.animation = "none";
          el.style.transition = "background-image 0.5s ease";
        }, 100);
      };

      // 图片加载失败处理
      img.onerror = () => {
        el.style.animation = "none";
        el.style.background = "#f8f8f8";
      };
    }
  },
};

// 注册全局指令
export default {
  install(app: App): void {
    app.directive("bg-load", progressiveBackground);
  },
};
