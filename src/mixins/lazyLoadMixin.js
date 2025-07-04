/**
 * 全局图片懒加载mixin
 * 可用于统一处理项目中所有图片的延迟加载策略
 */
export default {
  data() {
    return {
      observer: null,
      lazyImagesMap: new Map(), // 用于存储需要懒加载的图片元素
    };
  },
  mounted() {
    // 延迟执行，确保DOM已渲染
    setTimeout(() => {
      this.initLazyLoad();
    }, 200);
  },
  beforeDestroy() {
    // 清理资源
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.lazyImagesMap.clear();
  },
  methods: {
    initLazyLoad() {
      // 如果浏览器支持IntersectionObserver
      if ("IntersectionObserver" in window) {
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const target = entry.target;
                const src = this.lazyImagesMap.get(target);

                if (src) {
                  // 设置图片源，触发加载
                  setTimeout(() => {
                    target.src = src;
                  }, 100);

                  // 已处理，从Map中移除
                  this.lazyImagesMap.delete(target);

                  // 图片已加载，取消观察
                  this.observer.unobserve(target);
                }
              }
            });
          },
          {
            rootMargin: "0px 0px 100px 0px", // 提前100px触发加载
            threshold: 0.01, // 只要出现1%就触发
          }
        );

        // 查找页面中所有需要延迟加载的图片
        this.findLazyImages();
      }
    },

    findLazyImages() {
      // 查找所有有data-lazy属性的图片
      const images = document.querySelectorAll("img[data-lazy]");

      images.forEach((img) => {
        const src = img.getAttribute("data-lazy");
        if (src) {
          // 保存原始src到Map
          this.lazyImagesMap.set(img, src);

          // 开始观察
          this.observer.observe(img);
        }
      });
    },

    // 手动刷新懒加载，在动态添加图片后调用
    refreshLazyLoad() {
      this.$nextTick(() => {
        this.findLazyImages();
      });
    },
  },
};
