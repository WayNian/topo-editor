import { useCanvasStore } from "@/stores/modules/canvas";
import type { IImportSvgData, ILink, IMapSource, INode } from "@/types";
import { draw, drawMerge } from "@/utils/canvas/draw/svg";
import { checkLinks, checkNodes } from "./helper";
import { useCommonStore } from "@/stores/modules/common";
import { addMap, updateMap } from "@/utils/http/apis/menu";
import { useMenuStore } from "@/stores/modules/menu";

const store = useCanvasStore();
const commonStore = useCommonStore();
const menuStore = useMenuStore();

/**
 * 选择画布后，设置map(画布)信息，并获取节点和连线列表
 * @param map
 */
export const selectMap = async (map: IMapSource) => {
  menuStore.setMapInfo(map);
  await store.fetchNodeLinkList(map.mapId);
  draw();
};

const generateMap = (name?: string) => {
  const { width, height } = menuStore.mapSize;
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
  if (menuStore.mapInfo) {
    return {
      ...menuStore.mapInfo,
      mapSize: `${width}*${height}`
    };
  }
};

const addUpdataMapFunc = (name?: string) => {
  const params = generateMap(name);
  if (!params) return;
  return name ? addMap(params) : updateMap(params);
};

export const importSvg = (val: IImportSvgData) => {
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

      await store.addNodeLinkListFunc(nodes, links);
      window.$message.success("导入成功");
      //   draw();
    });
  } else {
    const mapId = menuStore.mapInfo?.mapId;
    if (!mapId) return;
    addUpdataMapFunc()?.then(async () => {
      const { deleteNodeList, mergeNodeList, addNodeList } = checkNodes(store.topoNodes, val.nodes);
      const { deleteLinkList, mergeLinkList, addLinkList } = checkLinks(store.topoLinks, val.links);

      menuStore.mergeNodeList = mergeNodeList;
      menuStore.mergeLinkList = mergeLinkList;

      drawMerge();

      //   nodes = store.topoNodes
      //     .concat(addNodeList)
      //     .filter((node) => {
      //       return !deleteNodeList.some((item) => item.id === node.id && item.nodeId === node.nodeId);
      //     })
      //     .map((node) => {
      //       return {
      //         ...node,
      //         mapId
      //       };
      //     });
      //   links = store.topoLinks
      //     .concat(addLinkList)
      //     .filter((link) => {
      //       return !deleteLinkList.some((item) => item.linkId === link.linkId);
      //     })
      //     .map((link) => {
      //       return {
      //         ...link,
      //         mapId
      //       };
      //     });

      console.log("links", links);

      await store.deleteLinkFunc(deleteLinkList);
      await store.addNodeLinkListFunc(nodes, links);
      await store.fetchNodeLinkList(mapId);
      draw();
    });
  }
};
