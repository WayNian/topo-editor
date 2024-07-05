import { h } from "vue";
import { FileTrayFullOutline, Folder, FolderOpenOutline } from "@vicons/ionicons5";
import { type TreeOption } from "naive-ui";
import { NIcon } from "naive-ui";

import { useMapStore } from "@/stores";
import type { IMapSource, IMenuCascaderItem, IMenuSource, ITreeItem } from "@/types";

export const getContextMenu = (option?: TreeOption) => {
  const mapStore = useMapStore();

  let menus: TreeOption[] = [];
  if (!option) {
    menus = [
      {
        label: "新建",
        key: "create"
      }
    ];
    return menus;
  }
  if (option.children) {
    menus = [
      {
        label: "新建",
        key: "create"
      },
      {
        label: "编辑",
        key: "edit"
      },
      {
        label: "导入",
        key: "import"
      },
      {
        label: "删除",
        key: "delete"
      }
    ];
  } else {
    if (mapStore.mapInfo?.mapId === option.key) {
      menus = [
        {
          label: "编辑",
          key: "edit"
        },
        {
          label: "导入",
          key: "import",
          children: [
            {
              label: "增量",
              key: "importPart"
            },
            {
              label: "全量",
              key: "importAll"
            }
          ]
        },
        {
          label: "删除",
          key: "delete"
        }
      ];
    } else {
      menus = [
        {
          label: "编辑",
          key: "edit"
        },
        {
          label: "删除",
          key: "delete"
        }
      ];
    }
  }

  return menus;
};

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
