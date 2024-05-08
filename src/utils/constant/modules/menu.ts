import type { ISelectType } from "@/types";

const AlignMenu = [
  {
    label: "对齐",
    key: "Align",
    children: [
      {
        label: "左对齐",
        key: "Left",
        parent: "Align"
      },
      {
        label: "右对齐",
        key: "Right",
        parent: "Align"
      },
      {
        label: "顶对齐",
        key: "Top",
        parent: "Align"
      },
      {
        label: "底对齐",
        key: "Bottom",
        parent: "Align"
      },
      {
        label: "水平居中",
        key: "CenterX",
        parent: "Align"
      },
      {
        label: "垂直居中",
        key: "CenterY",
        parent: "Align"
      },
      {
        label: "水平分布",
        key: "DistributeX",
        parent: "Align"
      },
      {
        label: "垂直分布",
        key: "DistributeY",
        parent: "Align"
      }
    ]
  }
];
const CommonMenu = [
  {
    label: "子图层",
    key: "Sublayer",
    children: [
      {
        label: "添加",
        key: "UpdateSublayer"
      },
      {
        label: "移除",
        key: "RemoveMultiFromSublayer"
      }
    ]
  },
  {
    label: "删除",
    key: "Delete"
  }
];

export const EditMenu: Record<ISelectType, any> = {
  node: [...AlignMenu, ...CommonMenu],
  link: [...AlignMenu, ...CommonMenu],
  svg: [...AlignMenu]
};
