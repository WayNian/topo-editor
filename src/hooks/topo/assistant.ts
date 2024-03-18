import { useTopoStore } from "@/stores/topo";
import type { IImportSvgData, ILink, IMapModel, IMapSource, INode } from "@/types";
import { draw, drawMerge } from "@/utils/draw";
import { checkLinks, checkNodes } from "./helper";
import { useCommonStore } from "@/stores/common";
import { addMap, updateMap } from "@/utils/http/apis/menu";

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

const addMapFunc = (name: string) => {
  if (!store.mapInfo) return;
  const { width, height } = store.mapSize;
  const params: IMapModel = {
    ...store.mapInfo,
    mapName: name,
    mapSize: `${width}*${height}`
  };
  return addMap(params);
};

const updateMapFunc = () => {
  if (!store.mapInfo) return;
  const { width, height } = store.mapSize;
  const params: IMapModel = {
    ...store.mapInfo,
    mapSize: `${width}*${height}`
  };
  return updateMap(params);
};

export const importSvg = async (val: IImportSvgData) => {
  let nodes: INode[] = [];
  let links: ILink[] = [];
  const mapId = store.mapInfo?.mapId;
  //   如果直接导入,先生成新的map文件
  if (common.importType === "import") {
    // 全量导入,生成新的map文件

    await addMapFunc(val.name);

    if (!mapId) return;
    nodes = val.nodes.map((node) => {
      return {
        ...node,
        mapId
      };
    });
    links = val.links.map((link) => {
      return {
        ...link,
        mapId
      };
    });
  } else {
    if (!mapId) return;
    await updateMapFunc();

    const { deleteNodeList, mergeNodeList, addNodeList } = checkNodes(store.topoNodes, val.nodes);
    const { deleteLinkList, mergeLinkList, addLinkList } = checkLinks(store.topoLinks, val.links);

    common.mergeNodeList = mergeNodeList;
    common.mergeLinkList = mergeLinkList;

    drawMerge();

    nodes = store.topoNodes
      .concat(addNodeList)
      .filter((node) => {
        return !deleteNodeList.some((item) => item.id === node.id && item.nodeId === node.nodeId);
      })
      .map((node) => {
        return {
          ...node,
          mapId
        };
      });
    links = store.topoLinks
      .concat(addLinkList)
      .filter((link) => {
        return !deleteLinkList.some((item) => item.linkId === link.linkId);
      })
      .map((link) => {
        return {
          ...link,
          mapId
        };
      });
  }

  await store.addNodeLinkListFunc(nodes, links);
  await store.fetchNodeLinkList(mapId);
  draw();
};
