import { getToken, clearAll } from "@/utils/cache";
import { ResultCodeEnum } from "@/enums/ResultCodeEnum";
import { decrypt, encrypt } from "@/utils/AESUtil";

// 全局加载状态管理
import { ref } from "vue";

// 创建响应式的加载状态
export const loadingState = ref({
  show: false,
  title: "加载中...",
  customIcon: "/static/images/loading.svg",
  mask: true,
});

// 显示自定义加载
export function showCustomLoading(title?: string, customIcon?: string) {
  console.log("showCustomLoading", title, customIcon);

  // 先强制设置为false，然后在nextTick中设置为true，以确保状态变化能被检测到
  loadingState.value = {
    show: false,
    title: title || "加载中...",
    customIcon: customIcon || "/static/images/loading.svg",
    mask: true,
  };

  // 使用setTimeout确保上述状态变化已经被应用
  setTimeout(() => {
    loadingState.value = {
      show: true,
      title: title || "加载中...",
      customIcon: customIcon || "/static/images/loading.svg",
      mask: true,
    };
    console.log("showCustomLoading设置后状态:", JSON.stringify(loadingState.value));
  }, 10);
}

// 隐藏自定义加载
export function hideCustomLoading() {
  console.log("hideCustomLoading被调用");
  loadingState.value.show = false;
  console.log("hideCustomLoading后状态:", loadingState.value.show);
}

// 基础URL
const baseUrl = import.meta.env.VITE_APP_API_URL;

// 简单请求接口定义
export interface RequestOptions {
  url: string;
  method?: string;
  data?: any;
  header?: Record<string, string>;
  loading?: boolean;
  success?: (data: any) => void;
  fail?: (error: any) => void;
  complete?: () => void;
}

// 简化版请求函数
export function requestSimple(options: RequestOptions) {
  const { url, method = "GET", data = {}, header = {} } = options;
  // 打印请求信息，便于调试
  console.log(`发起请求: ${method} ${url}`, { data, header });

  // 创建请求任务
  const requestTask = uni.request({
    url: baseUrl + url,
    method: method as any,
    data,
    header: {
      ...header,
      "Content-Type": header["Content-Type"] || "application/json",
    },
    success: (res) => {
      console.log(`请求成功: ${method} ${url}`, res);

      // 处理响应
      if (res.statusCode === 200) {
        if (options.success) {
          options.success(res.data);
        }
      } else {
        // 处理错误
        if (options.fail) {
          options.fail(res);
        }
      }
    },
    fail: (err) => {
      console.log(`请求失败: ${method} ${url}`, err);

      if (options.fail) {
        options.fail(err);
      }
    },
    complete: () => {
      console.log(`请求完成: ${method} ${url}`);

      if (options.complete) {
        options.complete();
      }
    },
  });

  // 返回请求任务，以便可以取消请求
  return requestTask;
}

// 原有的完整请求函数
export default function request<T>(
  options: UniApp.RequestOptions & {
    loading?: boolean;
    loadingTitle?: string;
    loadingIcon?: string;
  }
): Promise<T> {
  // H5 使用 VITE_APP_BASE_API 作为代理路径，其他平台使用 VITE_APP_API_URL 作为请求路径
  let baseApi = import.meta.env.VITE_APP_API_URL;
  // #ifdef H5
  // baseApi = import.meta.env.VITE_APP_BASE_API;
  // #endif

  // 显示加载图标，默认显示
  // const showLoading = options.loading !== false;
  const showLoading = true;
  options.loadingIcon = "/static/images/loading.svg";
  // 记录是否使用了自定义加载
  let isUsingCustomLoading = false;

  if (showLoading) {
    // 使用自定义加载组件或默认的uni.showLoading
    if (options.loadingIcon) {
      console.log("使用自定义加载组件");
      // 使用自定义加载组件
      showCustomLoading(options.loadingTitle, options.loadingIcon);
      isUsingCustomLoading = true;
    } else {
      // 使用默认加载
      uni.showLoading({
        title: options.loadingTitle || "加载中...",
        mask: true,
      });
    }
  }

  return new Promise((resolve, reject) => {
    // 判断是否需要加密请求体
    let requestData = options.data;
    if (requestData && typeof requestData === "object") {
      requestData = encrypt(requestData);
    }

    // 设置超时时间，确保请求不会无限等待
    const timeout = options.timeout || 30000;

    // 打印请求信息
    console.log("发起请求:", options.url);

    // 使用 uni.request 发起请求
    const requestTask = uni.request({
      ...options,
      url: `${baseApi}${options.url}`,
      data: requestData,
      timeout: timeout,
      header: {
        ...options.header,
        Authorization: getToken() ? `Bearer ${getToken()}` : "",
      },
      success: (response) => {
        let resData = response.data;
        // 尝试解密响应
        if (typeof resData === "string") {
          const decrypted = decrypt(resData);
          if (decrypted && typeof decrypted === "object" && "code" in decrypted) {
            resData = decrypted;
          }
        }
        // 业务状态码 00000 表示成功
        if ((resData as any).code === ResultCodeEnum.SUCCESS) {
          resolve((resData as any).data);
        }
        // 令牌失效或过期处理
        else if ((resData as any).code === ResultCodeEnum.TOKEN_INVALID) {
          console.log("令牌失效或过期处理");
          clearAll();
          // 跳转到登录页
          uni.navigateTo({
            url: "/pages/login/index",
          });
          reject({
            message: "令牌失效或过期",
            code: (resData as any).code,
          });
        } else {
          // 其他业务处理失败
          uni.showToast({
            title: (resData as any).msg || "业务处理失败",
            icon: "none",
          });
          reject({
            message: (resData as any).msg || "业务处理失败",
            code: (resData as any).code,
          });
        }
      },
      fail: (error) => {
        console.log("fail error", error);
        uni.showToast({
          title: "网络请求失败",
          icon: "none",
          duration: 2000,
        });
        reject({
          message: "网络请求失败",
          error,
        });
      },
      complete: () => {
        // 请求完成时隐藏加载图标
        if (showLoading) {
          if (isUsingCustomLoading) {
            hideCustomLoading();
          } else {
            uni.hideLoading();
          }
        }
      },
    });

    // 返回请求任务，便于取消请求
    return requestTask;
  });
}
