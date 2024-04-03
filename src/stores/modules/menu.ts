import type {
  ILink,
  IMap,
  IMapSource,
  IMenuCascaderItem,
  IMenuSource,
  INode,
  ITreeItem
} from "@/types";
import { fetchMenuList } from "@/utils/http/apis/menu";
import { formatMenuCascaderist, formatMenuList, clearData, getSize } from "@/utils/tools";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore("menu", () => {
  const menuList = ref<ITreeItem[]>();
  const menuCascaderList = ref<IMenuCascaderItem[]>();
  const expandedKeys = ref<Array<string | number>>([]);
  const selectedKeys = ref<Array<string | number>>([]);

  const mapInfo = ref<IMap | null>(null);
  const mapSize = ref({ width: 0, height: 0 });

  const currentMenu = ref<IMapSource | IMenuSource | null>(null);
  const collapsed = ref(false);

  const mergeNodeList = ref<INode[]>([]);
  const mergeLinkList = ref<ILink[]>([]);

  const getMenuList = () => {
    fetchMenuList().then((res) => {
      menuList.value = formatMenuList(res[0].children || [], expandedKeys.value);
      menuCascaderList.value = formatMenuCascaderist(res);
    });
  };

  const setMapSize = (width: number, height: number) => {
    mapSize.value = { width, height };
  };

  const setMapInfo = (info?: IMapSource) => {
    if (!info) {
      mapInfo.value = null;
      setMapSize(0, 0);
      clearData();
      return;
    }
    const { width, height } = getSize(info.mapSize);
    setMapSize(width, height);
    mapInfo.value = {
      ...info,
      width,
      height
    };
  };

  return {
    menuList,
    menuCascaderList,
    expandedKeys,
    selectedKeys,
    currentMenu,
    mapInfo,
    mapSize,
    collapsed,
    mergeNodeList,
    mergeLinkList,
    getMenuList,
    setMapInfo,
    setMapSize
  };
});
