import { ref } from "vue";
import { defineStore } from "pinia";

import type {
  IMapSource,
  IMenuCascaderItem,
  IMenuSource,
  ITreeItem
} from "@/types";
import { fetchMenuList } from "@/utils/http/apis/";
import { formatMenuCascaderist, formatMenuList } from "@/utils/tools";

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
