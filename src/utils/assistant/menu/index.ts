import { useCanvasStore } from "@/stores";
import { type TreeOption } from "naive-ui";

export const getContextMenu = (option?: TreeOption) => {
  const store = useCanvasStore();

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
    if (store.mapInfo?.mapId === option.key) {
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
              key: "importAddition"
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
