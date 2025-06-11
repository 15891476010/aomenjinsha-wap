import request from "@/utils/request";

const CONFIG_BASE_URL = "/api/v2/front";

const PublicApi = {
  /** 获取系统配置分页数据 */
  getIndexDataApi() {
    return request<any>({
      url: `${CONFIG_BASE_URL}/index`,
      method: "GET",
    });
  },
  getGamePageApi(data: GamePageQuery) {
    return request<any>({
      url: `${CONFIG_BASE_URL}/page`,
      method: "POST",
      data
    })
  }
};

export interface GamePageQuery {
  one: {
    pageNum: number;
    pageSize: number;
  },
  two: {
    pageNum: number;
    pageSize: number;
  }
}

export default PublicApi;
