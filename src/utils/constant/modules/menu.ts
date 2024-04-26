import type { ISelectType } from "@/types";

const CommonMune = [
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
  node: [...CommonMune],
  link: [...CommonMune],
  svg: [
    {
      label: "元素",
      key: "Meta",
      children: [
        {
          label: "文字",
          key: "Text"
        },
        {
          label: "矩形",
          key: "Rect"
        },
        {
          label: "圆形",
          key: "Circle"
        },
        {
          label: "图片",
          key: "Image"
        }
      ]
    }
  ]
};
