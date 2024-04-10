import { useDataStore, useMapStore, useMenuStore } from "@/stores";
import type { ISublayerAddModel, ISublayerItemModel, ISublayerModel } from "@/types";
import { drawNodesLinks } from "@/utils/editor/draw";
import { clearNodesLinksSubler, updateNodesLinksSublayer } from "./data";
import { updateNodesLinks } from "@/utils/http/apis";

const getSublayerList = (sublayer: ISublayerAddModel) => {
  const dataStore = useDataStore();
  const sublayerList: ISublayerItemModel[] = [];

  const sublayerId = sublayer?.sublayerId;
  dataStore.nodesSelected.forEach((node) => {
    sublayerList.push({
      sublayerId,
      objType: 1,
      objId: node.nodeId
    });
  });
  dataStore.linksSelected.forEach((link) => {
    sublayerList.push({
      sublayerId,
      objType: 2,
      objId: link.linkId
    });
  });

  return sublayerList;
};

// 更新 或者新建子图层
export const addNodesLinksToSublayer = async (sublayer: ISublayerAddModel) => {
  const menuStore = useMenuStore();
  const mapStore = useMapStore();
  const dataStore = useDataStore();

  const mapId = menuStore.mapInfo!.mapId;

  const sublayerList = getSublayerList(sublayer);
  const params: ISublayerModel = {
    mapId,
    ...sublayer,
    sublayerList
  };
  await mapStore.addSublayers(params);
  await dataStore.fetchNodeLinkList(mapId);
  dataStore.renewNodesLinks();
  drawNodesLinks();
};
