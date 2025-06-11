import request from "@/utils/request";

const ACTIVITE_BASE_URL = "/api/v2/front";

const FrontApi = {
  getOptionsApi() {
    return request<any>({
      url: `${ACTIVITE_BASE_URL}/getActivityTypeOptions`,
      method: "GET",
    });
  },
  getActiviteListApi(data: { pid: number }) {
    return request<any>({
      url: `${ACTIVITE_BASE_URL}/getActiviteList`,
      method: "GET",
      data: data,
    });
  },
  getActiviteApi(id: number) {
    return request<any>({
      url: `${ACTIVITE_BASE_URL}/getActivite/${id}`,
      method: "GET",
    });
  },
  /**
   * 活动申请
   */
  applyActiviteApi(id: number) {
    return request<any>({
      url: `/api/v2/auth/front/apply/${id}`,
      method: "POST",
    });
  },
};

export default FrontApi;
