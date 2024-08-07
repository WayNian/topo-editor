import { ref } from "vue";
import { defineStore } from "pinia";

import type {
  ILink,
  IMap,
  IMapSource,
  INode,
  IPosition,
  ISelectType,
  ISublayer,
  ISublayerDeleteModel,
  ISublayerModel
} from "@/types";
import {
  addSublayer as addSublayerByHttp,
  deleteSublayer as deleteSublayerByHttp,
  getSublayers as getSublayersByHttp
} from "@/utils/http/apis";
import { clearData, getSize } from "@/utils/tools";

export const useMapStore = defineStore("map", () => {
  const sublayers = ref<ISublayer[]>([]);
  const sublayerIds = ref<string[]>([]);
  const isMenuVisible = ref(false);
  const menuePosition = ref<IPosition>({
    x: 0,
    y: 0
  });

  const mapInfo = ref<IMap | null>(null);
  const mapSize = ref({ width: 0, height: 0 });

  const mergeNodeList = ref<INode[]>([]);
  const mergeLinkList = ref<ILink[]>([]);
  const selectType = ref<ISelectType>("svg");

  const isMoveToSublayerVisible = ref(false);

  const showMapMenu = (position: IPosition, type: ISelectType) => {
    menuePosition.value = position;
    isMenuVisible.value = true;
    selectType.value = type;
  };

  const setMapSize = (width: number, height: number) => {
    mapSize.value = { width, height };
  };

  const setMapInfo = (info?: IMapSource) => {
    if (!info) {
      mapInfo.value = null;
      setMapSize(0, 0);
      clearData();
      return;
    }
    const { width, height } = getSize(info.mapSize);
    setMapSize(width, height);
    mapInfo.value = {
      ...info,
      width,
      height
    };
  };

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
    await addSublayerByHttp(params);
    window.$message.success("修改成功");
    getSublayers(params.mapId);
  };

  const deleteSublayer = async (params: ISublayerDeleteModel) => {
    await deleteSublayerByHttp(params);
    window.$message.success("移除成功");
    getSublayers(params.mapId);
  };
  return {
    mapInfo,
    mapSize,
    selectType,
    mergeNodeList,
    mergeLinkList,
    isMoveToSublayerVisible,
    sublayers,
    sublayerIds,
    menuePosition,
    isMenuVisible,
    getSublayers,
    addSublayers,
    deleteSublayer,
    setMapInfo,
    setMapSize,
    showMapMenu
  };
});
