import { defineStore } from "pinia";
import { ref } from "vue";
import { setRechargeList, getRechargeList } from "@/utils/cache";
import RechargeApi from "@/api/recharge";

/**
 * 充值相关的状态管理
 */
export const useRechargeStore = defineStore("recharge", () => {
  const rechargeList = ref<any[]>([]);
  // 添加状态标记，用于告知组件是否需要显示更新提示
  const needRefreshConfirm = ref(false);
  // 存储最新的API数据，以便确认后更新
  const latestApiData = ref<any[]>([]);

  const getRechargeListStore = () => {
    uni.hideLoading();
    const list = getRechargeList();
    if (list) {
      rechargeList.value = list;
      RechargeApi.getRecharge().then((res) => {
        if (JSON.stringify(list) == JSON.stringify(res)) {
          return;
        }

        // 数据不同，设置状态并保存最新数据，让组件处理确认框逻辑
        needRefreshConfirm.value = true;
        latestApiData.value = res;
      });
    } else {
      RechargeApi.getRecharge().then((res) => {
        rechargeList.value = res;
        setRechargeList(res);
      });
    }
  };

  // 更新数据并刷新页面的方法，由组件在确认后调用
  const updateDataAndRefresh = () => {
    if (latestApiData.value) {
      rechargeList.value = latestApiData.value;
      setRechargeList(latestApiData.value);
      needRefreshConfirm.value = false;

      // 返回true表示更新成功
      return true;
    }
    return false;
  };

  // 取消更新
  const cancelUpdate = () => {
    needRefreshConfirm.value = false;
  };

  return {
    rechargeList,
    needRefreshConfirm,
    latestApiData,
    getRechargeListStore,
    updateDataAndRefresh,
    cancelUpdate,
  };
});
