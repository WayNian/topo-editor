import { useDataStore, useMapStore, useMenuStore } from "@/stores";
import type { ISublayer, ISublayerItem, ISublayerModel } from "@/types";
import { drawNodesLinks } from "@/utils/editor/draw";
import { updateNodesLinksSublayer } from "./data";

const getSublayerList = (sublayer: ISublayer) => {
  const dataStore = useDataStore();
  const sublayerList: ISublayerItem[] = [];
  dataStore.nodesSelected.forEach((node) => {
    sublayerList.push({
      sublayerId: sublayer.sublayerId,
      objType: 1,
      objId: node.nodeId
    });
  });
  dataStore.linksSelected.forEach((link) => {
    sublayerList.push({
      sublayerId: sublayer.sublayerId,
      objType: 2,
      objId: link.linkId
    });
  });

  return sublayerList;
};
// 更新 或者新建子图层
export const addNodesLinksToSublayer = async (sublayer: ISublayer) => {
  const menuStore = useMenuStore();
  const mapStore = useMapStore();
  const mapId = menuStore.mapInfo!.mapId;

  const sublayerList = getSublayerList(sublayer);
  const params: ISublayerModel = {
    mapId,
    ...sublayer,
    sublayerList
  };

  await mapStore.addSublayers(params);
  updateNodesLinksSublayer(sublayer);
  drawNodesLinks();
};
