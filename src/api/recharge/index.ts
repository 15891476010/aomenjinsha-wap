import request from "@/utils/request";

const RECHARGE_BASE_URL = "/api/v2/front";

const RechargeApi = {
  getRecharge() {
    return request<any>({
      url: `${RECHARGE_BASE_URL}/recharge`,
      method: "GET",
    });
  },

  addRechargeApi(data: any) {
    return request<any>({
      url: `/api/v2/auth/front/recharge`,
      method: "POST",
      data,
    });
  },
};

export default RechargeApi;
