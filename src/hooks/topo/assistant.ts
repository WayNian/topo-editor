import { useTopoStore } from "@/stores/topo";
import type { IImportSvgData, IMapSource } from "@/types";
import { draw, drawMerge } from "@/utils/draw";
import { checkLinks, checkNodes } from "./helper";
import { useCommonStore } from "@/stores/common";

const store = useTopoStore();
const common = useCommonStore();

/**
 * 选择画布后，设置map(画布)信息，并获取节点和连线列表
 * @param map
 */
export const selectMap = async (map: IMapSource) => {
  store.setMapInfo(map);
  await store.fetchNodeLinkList(map.mapId);
  draw();
};

export const importSvg = async (val: IImportSvgData) => {
  // 全量导入,生成新的map文件
  if (common.importType === "import") {
    store.topoNodes = val.nodes;
    store.topoLinks = val.links;
  } else {
    const { deleteNodeList, mergeNodeList, addNodeList } = checkNodes(store.topoNodes, val.nodes);
    const { deleteLinkList, mergeLinkList, addLinkList } = checkLinks(store.topoLinks, val.links);

    common.mergeNodeList = mergeNodeList;
    common.mergeLinkList = mergeLinkList;

    drawMerge();

    store.topoNodes = store.topoNodes.concat(addNodeList).filter((node) => {
      return !deleteNodeList.some((item) => item.id === node.id && item.nodeId === node.nodeId);
    });
    store.topoLinks = store.topoLinks.concat(addLinkList).filter((link) => {
      return !deleteLinkList.some((item) => item.linkId === link.linkId);
    });
  }

  //   const mapId = store.mapInfo?.mapId;
  //   if (!mapId) return;
  //   const nodes = val.nodes.map((node) => {
  //     return {
  //       ...node,
  //       mapId
  //     };
  //   });
  //   const links = val.links.map((link) => {
  //     return {
  //       ...link,
  //       mapId
  //     };
  //   });
  //   await store.addNodeLinkListFunc(nodes, links);
  //   await store.fetchNodeLinkList(mapId);
  draw();
};
