import type {
  ILink,
  IMap,
  IMapSource,
  IMenuCascaderItem,
  IMenuSource,
  INode,
  ITreeItem
} from "@/types";
import { fetchMenuList } from "@/utils/http/apis/";
import { formatMenuCascaderist, formatMenuList, clearData, getSize } from "@/utils/tools";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore("menu", () => {
  const menuList = ref<ITreeItem[]>();
  const menuCascaderList = ref<IMenuCascaderItem[]>();
  const expandedKeys = ref<Array<string | number>>([]);
  const selectedKeys = ref<Array<string | number>>([]);

  const currentMenu = ref<IMapSource | IMenuSource | null>(null);
  const collapsed = ref(false);

  const getMenuList = async () => {
    const res = await fetchMenuList();
    menuList.value = formatMenuList(res[0].children || [], expandedKeys.value);
    menuCascaderList.value = formatMenuCascaderist(res);
  };

  return {
    menuList,
    menuCascaderList,
    expandedKeys,
    selectedKeys,
    currentMenu,
    collapsed,
    getMenuList
  };
});
