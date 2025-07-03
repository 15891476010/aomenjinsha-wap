import { ref } from "vue";
import { defineStore } from "pinia";
import AuthAPI, { type LoginFormData } from "@/api/auth";
import UserAPI, { type UserInfo } from "@/api/system/user";
import { setToken, getUserInfo, setUserInfo, clearAll, getToken } from "@/utils/cache";
const isSecret = import.meta.env.VITE_APP_ENCRYPTION === "true";

export const useUserStore = defineStore("user", () => {
  const userInfo = ref<UserInfo | undefined>(getUserInfo());
  const isLogin = () => {
    return isSecret ? userInfo.value : userInfo.value && userInfo.value.username;
  };
  // 登录
  const login = (data: LoginFormData) => {
    return new Promise((resolve, reject) => {
      AuthAPI.login(data)
        .then((data) => {
          setToken(data.accessToken);
          resolve(data);
        })
        .catch((error) => {
          console.error("登录失败", error);
          reject(error);
        });
    });
  };

  // 微信登录
  const loginByWechat = (code: string) => {
    return new Promise((resolve, reject) => {
      AuthAPI.wechatLogin(code)
        .then((data) => {
          setToken(data.accessToken);
          resolve(data);
        })
        .catch((error) => {
          console.error("微信登录失败", error);
          reject(error);
        });
    });
  };

  // 获取用户信息
  const getInfo = () => {
    return new Promise((resolve, reject) => {
      if (isLogin() || getToken()) {
        UserAPI.checkLoginApi().then((data: any) => {
          if (data) {
            UserAPI.getUserInfo()
              .then((data) => {
                setUserInfo(data);
                userInfo.value = data;
                resolve(data);
              })
              .catch((error) => {
                console.error("获取用户信息失败", error);
                reject(error);
              });
          }
        });
      }
    });
  };

  // 登出
  const logout = async () => {
    try {
      await AuthAPI.logout(); // 调用后台注销接口
    } catch (error) {
      console.error("登出失败", error);
    } finally {
      clearAll(); // 清除本地的 token 和用户信息缓存
      userInfo.value = undefined; // 清空用户信息
    }
  };

  // 判断用户信息是否完整
  const isUserInfoComplete = (): boolean => {
    if (!userInfo.value) return false;

    return !!(userInfo.value.nickname && userInfo.value.avatar);
  };

  return {
    userInfo,
    login,
    loginByWechat,
    logout,
    getInfo,
    isUserInfoComplete,
  };
});
