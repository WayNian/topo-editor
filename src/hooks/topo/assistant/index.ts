import { useTopoStore } from "@/stores/topo";
import type { IMapSource } from "@/types";
import { draw } from "@/utils/draw";
const store = useTopoStore();

/**
 * 选择画布后，设置map(画布)信息，并获取节点和连线列表
 * @param map
 */
export const selectMap = async (map: IMapSource) => {
  store.setMapInfo(map);
  await store.fetchNodeLinkList(map.mapId);
  draw();
};
