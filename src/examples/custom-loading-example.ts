// 使用自定义loading.svg图片作为加载图标的示例
import request, { requestSimple } from "@/utils/request";

/**
 * 使用自定义loading.svg图片作为加载图标的示例
 * 这个示例展示了如何在请求时使用项目中的loading.svg图片作为加载图标
 */
export async function fetchDataWithCustomSvgLoading() {
  try {
    // 使用自定义SVG加载图标
    const result = await request({
      url: "/api/data",
      method: "GET",
      loading: true,
      loadingTitle: "加载中...",
      loadingIcon: "/static/images/loading.svg", // 使用项目中的SVG图片作为加载图标
    });
    return result;
  } catch (error) {
    console.error("请求失败", error);
    throw error;
  }
}

/**
 * 使用简化版请求函数显示自定义SVG加载图标
 */
export function fetchDataWithSimpleRequestAndSvg() {
  // 使用自定义SVG加载图标
  return requestSimple({
    url: "/api/data",
    method: "GET",
    loading: true,
    loadingTitle: "加载中...",
    loadingIcon: "/static/images/loading.svg", // 使用项目中的SVG图片作为加载图标
    success: (data) => {
      console.log("请求成功", data);
      // 处理成功响应
      return data;
    },
    fail: (error) => {
      console.error("请求失败", error);
      // 处理失败响应
    },
  });
}
