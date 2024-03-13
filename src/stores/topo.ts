import { ref } from "vue";
import { defineStore } from "pinia";
import testData from "@/assets/data/testData.json";
import { formatLinks, formatNodes } from "@/utils/tools/data";
import type { ILink, IMenuCascaderItem, INode, ITreeItem } from "@/types/";
import { fetchMenuList } from "@/utils/http/apis/menu";
import { formatMenuCascaderist, formatMenuList } from "@/utils/tools/menu";

export const useTopoStore = defineStore("topo", () => {
  const menuList = ref<ITreeItem[]>();
  const menuCascaderList = ref<IMenuCascaderItem[]>();
  const mapSize = ref({ width: 1000, height: 800 });
  const topoNodes = ref(formatNodes(testData.data.nodes));
  const topoLinks = ref(formatLinks(testData.data.links));
  const currentNode = ref<INode | null>(null);
  const currentLink = ref<ILink | null>(null);
  const svgSize = ref({ width: 0, height: 0 });
  const isSelectViewVisible = false;

  const setMapSize = (width: number, height: number) => {
    mapSize.value = { width, height };
  };

  const getMenuList = () => {
    fetchMenuList().then((res) => {
      menuList.value = formatMenuList(res[0].children);
      menuCascaderList.value = formatMenuCascaderist(res);
      console.log("🚀 ~ fetchMenuList ~ menuCascaderList.value:", menuCascaderList.value);
    });
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
    getMenuList
  };
});
