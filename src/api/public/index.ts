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
  },
  /**
   * 前端根据id获取游戏分类
   */
  getGameCategoryByIdApi(id: number) {
    return request<any>({
      url: `${CONFIG_BASE_URL}/getGameCategoryById`,
      method: "POST",
      data: id
    })
  },
  /**
   * 根据平台类型获取游戏列表
   */
  getGameListByPlatformApi(data: any) {
    return request<any>({
      url: `${CONFIG_BASE_URL}/getGamePlatTypeList`,
      method: "POST",
      data
    })
  },
  /**
   * 前端根据id获取游戏平台列表
   */
  getGamePlatTypeByCaIdApi(id: number) {
    return request<any>({
      url: `${CONFIG_BASE_URL}/getGamePlatTypeByCaId`,
      method: "POST",
      data: id
    })
  },
  /**
   * 获取我的页面跳转列表
   */
  getMinePagesListApi() {
    return request<any>({
      url: `${CONFIG_BASE_URL}/getMinePagesList`,
      method: "GET",
    })
  },
  /**
   * 获取我的页面底部跳转列表
   */
  getMinePagesBottomListApi() {
    return request<any>({
      url: `${CONFIG_BASE_URL}/getMinePagesBottomList`,
      method: "GET",
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
