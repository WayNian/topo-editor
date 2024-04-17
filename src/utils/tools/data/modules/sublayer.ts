import { useCommonStore, useDataStore, useMapStore } from "@/stores";
import type { ISublayerAddModel, ISublayerItemModel, ISublayerModel } from "@/types";
import { drawNodesLinks } from "@/utils/editor/draw";

const getSublayerList = (sublayer: ISublayerAddModel) => {
  const dataStore = useDataStore();
  const mapStore = useMapStore();

  const sublayerList: ISublayerItemModel[] = [];

  const sublayerId = sublayer?.sublayerId;

  if (mapStore.isMoveToSublayerVisible) {
    const { nodeList, linkList } = dataStore.nodeLinkListByImport;
    nodeList.forEach((node) => {
      sublayerList.push({
        sublayerId,
        objType: 1,
        objId: node.nodeId
      });
    });
    linkList.forEach((link) => {
      sublayerList.push({
        sublayerId,
        objType: 2,
        objId: link.linkId
      });
    });
  } else {
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
  }

  return sublayerList;
};

// 更新 或者新建子图层
export const addNodesLinksToSublayer = async (sublayer: ISublayerAddModel) => {
  const mapStore = useMapStore();
  const dataStore = useDataStore();
  const commonStore = useCommonStore();

  const mapId = mapStore.mapInfo!.mapId;

  const sublayerList = getSublayerList(sublayer);
  const params: ISublayerModel = {
    mapId,
    ...sublayer,
    sublayerList
  };
  // 接口设计：全量导入时，会删除之前的子图层，新增子图层不能传sublayerId
  if (commonStore.importType === "importAll") {
    delete params.sublayerId;
  }
  await mapStore.addSublayers(params);
  await dataStore.fetchNodeLinkList(mapId);
  dataStore.renewNodesLinks();
  drawNodesLinks();
};
