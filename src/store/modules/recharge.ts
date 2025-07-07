import { defineStore } from "pinia";
import { setRechargeList, getRechargeList } from "@/utils/cache";
import RechargeApi from "@/api/recharge";

export const useRechargeStore = defineStore("recharge", () => {
  const rechargeList = ref<any[]>([]);
  const getRechargeListStore = () => {
    uni.hideLoading();
    const list = getRechargeList();
    if (list) {
      rechargeList.value = list;
      RechargeApi.getRecharge().then((res) => {
        if (list == res) {
          return;
        }
        rechargeList.value = res;
        setRechargeList(res);
      });
    } else {
      RechargeApi.getRecharge().then((res) => {
        rechargeList.value = res;
        setRechargeList(res);
      });
    }
  };

  return {
    rechargeList,
    getRechargeListStore,
  };
});
