import { useDataStore } from "@/stores/modules/data";
import type { IImportData, ILink, IMapSource, INode } from "@/types";
import { draw, drawMerge, drawNodes, drawNodesLinks } from "@/utils/editor/draw/";
import { checkLinks, checkNodes } from "./helper";
import { useCommonStore } from "@/stores/modules/common";
import { addMap, updateMap } from "@/utils/http/apis/";
import { useMenuStore } from "@/stores/modules/menu";
import { useMapStore } from "@/stores";

/**
 * 选择画布后，设置map(画布)信息，并获取节点和连线列表
 * @param map
 */
export const selectMap = async (map: IMapSource) => {
  const dataStore = useDataStore();
  const commonStore = useCommonStore();
  const mapStore = useMapStore();

  commonStore.isLoading = true;
  mapStore.setMapInfo(map);
  await dataStore.fetchNodeLinkList(map.mapId);
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
  const dataStore = useDataStore();

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

  await dataStore.addNodeLinkListFunc(nodes, links);
  window.$message.success("导入成功");
};

const importPartSvg = async (val: IImportData) => {
  const dataStore = useDataStore();
  const mapStore = useMapStore();

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

  await addUpdataMapFunc();
  await dataStore.deleteNodeFunc(deleteNodeList);
  await dataStore.deleteLinkFunc(deleteLinkList);
  await dataStore.addNodeLinkListFunc(nodes, links);

  //   if (!mergeNodeList.length && !mergeLinkList.length && !nodes.length && !links.length) {
  //     window.$message.info("无新数据导入");
  //   } else {
  window.$message.success("导入成功");
  //   }

  if (mapStore.mergeLinkList.length || mapStore.mergeNodeList.length) {
    dataStore.renewMergeNodesLinks();
    drawMerge();
    drawNodesLinks();
  } else {
    if (deleteNodeList.length || deleteLinkList.length || nodes.length || links.length) {
      await dataStore.fetchNodeLinkList(mapId);
      dataStore.renewNodesLinks();
      drawNodesLinks();
    }
  }
};
