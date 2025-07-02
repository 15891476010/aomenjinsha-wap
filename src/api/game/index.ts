import request from "@/utils/request";

const CONFIG_BASE_URL = "/api/v1/game";

const GameApi = {
  /** 获取系统配置分页数据 */
  getGameUrlApi(id: number | string, type?: boolean) {
    type = type ? type : false;
    return request<any>({
      url: `${CONFIG_BASE_URL}/getUrl?id=${id}&type=${type}`,
      method: "get",
    });
  },
  /** 用户额度归户 */
  userTransferApi(data: string) {
    return request<any>({
      url: `${CONFIG_BASE_URL}/userTransfer?gamePlate=${data}`,
      method: "POST",
    });
  },
};

export default GameApi;
