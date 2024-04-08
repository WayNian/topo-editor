import type { ISublayer, ISublayerModel } from "@/types";
import {
  addSublayer as addSublayerByHttp,
  getSublayers as getSublayersByHttp
} from "@/utils/http/apis";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMapStore = defineStore("map", () => {
  const sublayers = ref<ISublayer[]>([]);
  const sublayerIds = ref<string[]>([]);

  const getSublayers = async (mapId?: string) => {
    if (mapId) {
      getSublayersByHttp(mapId).then((res) => {
        sublayers.value = [
          {
            sublayerId: "other",
            sublayerName: "其他",
            isVisible: 1,
            listOrder: 0
          },
          ...res.sort((a, b) => a.listOrder - b.listOrder)
        ];
      });
    } else {
      sublayers.value = [];
    }
  };

  const addSublayers = async (params: ISublayerModel) => {
    addSublayerByHttp(params).then(() => {
      getSublayers(params.mapId);
    });
  };
  return { sublayers, sublayerIds, getSublayers, addSublayers };
});
