import { useDataStore } from "@/stores/modules/data";
import type { IImportData, ILink, IMapSource, INode } from "@/types";
import { clearSvg, draw, drawMerge } from "@/utils/editor/draw/";
import { checkLinks, checkNodes } from "./helper";
import { useCommonStore } from "@/stores/modules/common";
import { addMap, updateMap } from "@/utils/http/apis/";
import { useMenuStore } from "@/stores/modules/menu";
import { useMapStore } from "@/stores";
import {
  addNodeLinkList,
  clearNodesLinksSelected,
  deleteLinks,
  deleteNodes,
  getNodeLinkList,
  renewMergeNodesLinks,
  renewNodesLinks
} from "../../data";

/**
 * 选择画布后，设置map(画布)信息，并获取节点和连线列表
 * @param map
 */
export const selectMap = async (map: IMapSource) => {
  const commonStore = useCommonStore();
  const mapStore = useMapStore();

  commonStore.isLoading = true;
  clearSvg();
  mapStore.sublayerIds = [];
  mapStore.setMapInfo(map);
  await getNodeLinkList(map.mapId);
  draw();
  commonStore.isLoading = false;
};

const generateMap = (name?: string) => {
  const menuStore = useMenuStore();
  const mapStore = useMapStore();

  const { width, height } = mapStore.mapSize;
  if (name) {
    //  新增
    return {
      mapName: name,
      height,
      width,
      mapSize: `${width}*${height}`,
      background: "",
      mapIndex: 1,
      externalBind: {},
      internalBind: {},
      description: {},
      menuId: menuStore.currentMenu?.menuId || "0"
    };
  }
  if (mapStore.mapInfo) {
    return {
      ...mapStore.mapInfo,
      mapSize: `${width}*${height}`
    };
  }
};

const addUpdataMapFunc = async (name?: string) => {
  const params = generateMap(name);
  if (!params) return;
  return name ? await addMap(params) : await updateMap(params);
};

export const importSvg = async (val: IImportData) => {
  const commonStore = useCommonStore();
  commonStore.isLoading = true;

  clearNodesLinksSelected();

  if (commonStore.importType === "import") {
    await importAllSvg(val);
  } else {
    await importPartSvg(val);
  }

  commonStore.isLoading = false;
};

const importAllSvg = async (val: IImportData) => {
  let nodes: INode[] = [];
  let links: ILink[] = [];
  const menuStore = useMenuStore();

  // 全量导入,生成新的map文件
  const mapId = await addUpdataMapFunc(val.name);
  await menuStore.getMenuList();
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

  await addNodeLinkList(nodes, links);
  window.$message.success("导入成功");
};

const importPartSvg = async (val: IImportData) => {
  const dataStore = useDataStore();
  const mapStore = useMapStore();
  const commonStore = useCommonStore();

  let nodes: INode[] = [];
  let links: ILink[] = [];

  const mapId = mapStore.mapInfo?.mapId;
  if (!mapId) return;

  const { deleteNodeList, mergeNodeList, addNodeList } = checkNodes(dataStore.nodesAll, val.nodes);
  const { deleteLinkList, mergeLinkList, addLinkList } = checkLinks(dataStore.linksAll, val.links);

  mapStore.mergeNodeList = mergeNodeList;
  mapStore.mergeLinkList = mergeLinkList;
  nodes = addNodeList.map((node) => {
    return {
      ...node,
      mapId
    };
  });

  links = addLinkList.map((link) => {
    return {
      ...link,
      mapId
    };
  });

  if (commonStore.importType === "importAll") {
    await addUpdataMapFunc();
  }
  await deleteNodes(deleteNodeList);
  await deleteLinks(deleteLinkList);
  await addNodeLinkList(nodes, links);

  window.$message.success("导入成功");

  if (mapStore.mergeLinkList.length || mapStore.mergeNodeList.length) {
    renewMergeNodesLinks();
    drawMerge();
    draw();
  } else {
    if (deleteNodeList.length || deleteLinkList.length) {
      renewNodesLinks();
      draw();
    }
  }

  //   有新数据，是否移动到其他子图层
  if (nodes.length || links.length) {
    mapStore.isMoveToSublayerVisible = true;
  }
};
