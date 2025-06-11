import { getToken, clearAll } from "@/utils/cache";
import { ResultCodeEnum } from "@/enums/ResultCodeEnum";
import { decrypt, encrypt } from "@/utils/AESUtil";
import { showLoading, hideLoading } from "@/utils/loading";

export default function request<T>(options: UniApp.RequestOptions): Promise<T> {
  // H5 使用 VITE_APP_BASE_API 作为代理路径，其他平台使用 VITE_APP_API_URL 作为请求路径
  let baseApi = import.meta.env.VITE_APP_API_URL;
  // #ifdef H5
  // baseApi = import.meta.env.VITE_APP_BASE_API;
  // #endif

  // 显示自定义加载图标 - 确保在请求前调用
  showLoading({
    title: "加载中...",
    mask: true,
  });

  return new Promise((resolve, reject) => {
    // 判断是否需要加密请求体
    let requestData = options.data;
    if (requestData && typeof requestData === "object") {
      requestData = encrypt(requestData);
    }

    // 设置超时时间，确保请求不会无限等待
    const timeout = options.timeout || 30000;

    uni.request({
      ...options,
      url: `${baseApi}${options.url}`,
      data: requestData,
      timeout: timeout,
      header: {
        ...options.header,
        Authorization: getToken() ? `Bearer ${getToken()}` : "",
      },
      success: (response) => {
        // 隐藏加载动画
        hideLoading();

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
        // 隐藏加载动画
        hideLoading();

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
        // 确保在任何情况下都隐藏加载动画
        hideLoading();
      },
    });
  });
}
