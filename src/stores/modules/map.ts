import type { ISublayer, ISublayerDeleteModel, ISublayerModel } from "@/types";
import {
  addSublayer as addSublayerByHttp,
  deleteSublayer as deleteSublayerByHttp,
  getSublayers as getSublayersByHttp
} from "@/utils/http/apis";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMapStore = defineStore("map", () => {
  const sublayers = ref<ISublayer[]>([]);
  const sublayerIds = ref<string[]>([]);

  const getSublayers = async (mapId?: string) => {
    console.log("🚀 ~ getSublayers ~ mapId:", mapId);
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
    await addSublayerByHttp(params);
    window.$message.success("修改成功");
    getSublayers(params.mapId);
  };

  const deleteSublayer = async (params: ISublayerDeleteModel) => {
    await deleteSublayerByHttp(params);
    window.$message.success("移除成功");
    getSublayers(params.mapId);
  };
  return { sublayers, sublayerIds, getSublayers, addSublayers, deleteSublayer };
});
