import type { IMapSource, IMenuCascaderItem, IMenuSource, ITreeItem } from "@/types";
import { Folder, FileTrayFullOutline, FolderOpenOutline } from "@vicons/ionicons5";
import { NIcon } from "naive-ui";
import { h } from "vue";

const formatMapList = (mapList: IMapSource[]): ITreeItem[] => {
  if (!mapList) return [];
  return mapList.map((item) => {
    return {
      key: item.mapId,
      label: item.mapName,
      raw: item,
      prefix: () =>
        h(NIcon, null, {
          default: () => h(FileTrayFullOutline)
        })
    };
  });
};
export const formatMenuList = (
  menuList: IMenuSource[],
  keys: Array<string | number>
): ITreeItem[] => {
  if (!menuList) return [];
  return menuList.map((item) => {
    return {
      key: item.menuId,
      label: item.menuName,
      isMenu: true,
      raw: item,
      prefix: () =>
        h(NIcon, null, {
          default: () => h(keys.includes(item.menuId) ? FolderOpenOutline : Folder)
        }),
      children: [...formatMenuList(item.children || [], keys), ...formatMapList(item.maps)]
    };
  });
};

export const formatMenuCascaderist = (menuList?: IMenuSource[]): IMenuCascaderItem[] => {
  if (!menuList) return [];
  return menuList.map((item) => {
    const menu: IMenuCascaderItem = {
      value: item.menuId,
      label: item.menuName
    };
    if (item.children && item.children.length) {
      menu.children = formatMenuCascaderist(item.children);
    }

    return menu;
  });
};
