import { defineStore } from "pinia";
import { getGameData } from "@/utils/cache";
import GameApi from "@/api/game";

export const useGameStore = defineStore("game", () => {
  const getUserTransfer = () => {
    if (getGameData()) {
      GameApi.userTransferApi(getGameData()).then((res) => {
        console.log(res);
      });
    }
  };

  return {
    getUserTransfer,
  };
});
