import { useDataStore } from "@/stores/modules/data";
import type { IImportSvgData, ILink, IMapSource, INode } from "@/types";
import { draw, drawMerge } from "@/utils/editor/draw/";
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

const addUpdataMapFunc = (name?: string) => {
  const params = generateMap(name);
  if (!params) return;
  return name ? addMap(params) : updateMap(params);
};

export const importSvg = async (val: IImportSvgData) => {
  const dataStore = useDataStore();
  const commonStore = useCommonStore();
  const menuStore = useMenuStore();
  const mapStore = useMapStore();

  commonStore.isLoading = true;

  let nodes: INode[] = [];
  let links: ILink[] = [];
  //   如果直接导入,先生成新的map文件
  if (commonStore.importType === "import") {
    // 全量导入,生成新的map文件
    addUpdataMapFunc(val.name)?.then(async (mapId) => {
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
      commonStore.isLoading = false;
    });
  } else {
    const mapId = mapStore.mapInfo?.mapId;
    if (!mapId) return;

    // 增量
    const { deleteNodeList, mergeNodeList, addNodeList } = checkNodes(dataStore.nodes, val.nodes);
    const { deleteLinkList, mergeLinkList, addLinkList } = checkLinks(dataStore.links, val.links);

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
    await dataStore.fetchNodeLinkList(mapId);
    window.$message.success("导入成功");

    draw();
    if (mapStore.mergeLinkList.length || mapStore.mergeNodeList.length) {
      drawMerge();
    }

    commonStore.isLoading = false;
  }
};
