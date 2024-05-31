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
  getMapGroupData,
  getNodeLinkList,
  renewMergeNodesLinks,
  renewNodesLinks
} from "../../data";

const mergeDefs = (defs: string, newDefs: string) => {
  const svgDefs = defs + newDefs;
  // 使用正则表达式匹配所有具有id属性的SVG元素
  const elementsById: Record<string, any> = {};
  const elementRegex = /<([a-z][a-z0-9]*)\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/gi;

  let match;
  while ((match = elementRegex.exec(svgDefs)) !== null) {
    const tagName = match[1]; // 元素标签名
    const id = match[2]; // id属性值
    const elementContent = match[0]; // 元素内容

    // 如果该id尚未记录，则添加
    if (!elementsById[id]) {
      elementsById[id] = { tagName, content: elementContent };
    }
  }

  // 重新构建没有重复id的SVG defs字符串
  let uniqueDefs = "";
  for (const id in elementsById) {
    const { content } = elementsById[id];
    uniqueDefs += content;
  }

  return uniqueDefs;
};
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
  await mapStore.getSublayers(map.mapId);
  await getNodeLinkList(map.mapId);
  draw();
  await getMapGroupData(map.mapId);
  commonStore.isLoading = false;
};

/**
 *
 * @param val
 * @param isAdd 新增
 * @param isCover  是否覆盖mapInfo属性，用于全量导入
 * @returns
 */
const generateMap = (val: IImportData, isAdd: Boolean, isCover: boolean) => {
  const menuStore = useMenuStore();
  const mapStore = useMapStore();

  const { width, height } = mapStore.mapSize;
  if (isAdd) {
    //  新增
    return {
      mapName: val.name,
      height,
      width,
      mapSize: `${width}*${height}`,
      background: "",
      mapIndex: 1,
      externalBind: {},
      internalBind: {},
      description: {},
      defs: val.defs,
      menuId: menuStore.currentMenu?.menuId || "0"
    };
  }
  if (mapStore.mapInfo) {
    return {
      ...mapStore.mapInfo,
      defs: isCover ? val.defs : mergeDefs(mapStore.mapInfo.defs || "", val.defs),
      mapSize: `${width}*${height}`
    };
  }
};

const addUpdataMapFunc = async (val: IImportData, isAdd: Boolean, isCover: boolean) => {
  const params = generateMap(val, isAdd, isCover);
  if (!params) return;
  return isAdd ? await addMap(params) : await updateMap(params);
};

export const importSvg = async (val: IImportData) => {
  const commonStore = useCommonStore();
  commonStore.isLoading = true;

  clearNodesLinksSelected();

  try {
    if (commonStore.importType === "import") {
      await importAllSvg(val);
    } else {
      await importPartSvg(val);
    }
    commonStore.isLoading = false;
  } catch (error) {
    commonStore.isLoading = false;
  }
};

const importAllSvg = async (val: IImportData) => {
  let nodes: INode[] = [];
  let links: ILink[] = [];
  const menuStore = useMenuStore();

  // 全量导入,生成新的map文件
  const mapId = await addUpdataMapFunc(val, true, false);
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

  // 全量导入
  if (commonStore.importType === "importAll") {
    await addUpdataMapFunc(val, false, true);
  } else {
    await addUpdataMapFunc(val, false, false);
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
