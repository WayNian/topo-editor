import { ref } from "vue";
import { defineStore } from "pinia";
import type { ILink, IMap, IMapSource, IMenuCascaderItem, INode, ITreeItem } from "@/types/";
import { fetchMenuList } from "@/utils/http/apis/menu";
import { formatMenuCascaderist, formatMenuList } from "@/utils/tools/menu";
import { fetchNodeLinkListByMapId } from "@/utils/http/apis/topo";
import { formatLinks, formatNodes } from "./assistant/topo";
import { getSize } from "@/utils/tools/common";

export const useTopoStore = defineStore("topo", () => {
  const menuList = ref<ITreeItem[]>();
  const menuCascaderList = ref<IMenuCascaderItem[]>();
  const mapSize = ref({ width: 0, height: 0 });
  const topoNodes = ref<INode[]>([]);
  const topoLinks = ref<ILink[]>([]);
  const currentNode = ref<INode | null>(null);
  const currentLink = ref<ILink | null>(null);
  const svgSize = ref({ width: 0, height: 0 });
  const mapInfo = ref<IMap>();
  const isSelectViewVisible = false;

  const setMapSize = (width: number, height: number) => {
    mapSize.value = { width, height };
  };

  const setMapInfo = (info: IMapSource) => {
    const { width, height } = getSize(info.mapSize);
    setMapSize(width, height);
    mapInfo.value = {
      ...info,
      width,
      height
    };
  };

  const getMenuList = () => {
    fetchMenuList().then((res) => {
      menuList.value = formatMenuList(res[0].children);
      menuCascaderList.value = formatMenuCascaderist(res);
    });
  };

  const fetchNodeLinkList = async (mapId: string) => {
    const res = await fetchNodeLinkListByMapId(mapId);
    topoNodes.value = formatNodes(res.nodes);
    topoLinks.value = formatLinks(res.links);
  };

  return {
    menuList,
    menuCascaderList,
    mapSize,
    topoNodes,
    topoLinks,
    currentNode,
    currentLink,
    isSelectViewVisible,
    svgSize,
    setMapSize,
    getMenuList,
    fetchNodeLinkList,
    setMapInfo
  };
});
