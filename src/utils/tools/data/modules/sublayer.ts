import { useDataStore, useMenuStore } from "@/stores";
import type { ISublayer, ISublayerItem, ISublayerModel } from "@/types";

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
export const addNodesLinksToSublayer = (sublayer: ISublayer) => {
  const menuStore = useMenuStore();
  const mapId = menuStore.mapInfo!.mapId;

  const sublayerList = getSublayerList(sublayer);
  const params: ISublayerModel = {
    mapId,
    ...sublayer,
    sublayerList
  };
  console.log("--->>", params);
};
