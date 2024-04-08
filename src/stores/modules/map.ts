import type { ISubLayer, ISubLayerModel } from "@/types";
import {
  addSubLayer as addSubLayerByHttp,
  getSubLayers as getSubLayersByHttp
} from "@/utils/http/apis";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMapStore = defineStore("map", () => {
  const subLayers = ref<ISubLayer[]>([]);
  const subLayerIds = ref<string[]>([]);

  const getSubLayers = async (mapId?: string) => {
    if (mapId) {
      getSubLayersByHttp(mapId).then((res) => {
        subLayers.value = [
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
      subLayers.value = [];
    }
  };

  const addSubLayers = async (params: ISubLayerModel) => {
    addSubLayerByHttp(params).then(() => {
      getSubLayers(params.mapId);
    });
  };
  return { subLayers, subLayerIds, getSubLayers, addSubLayers };
});
