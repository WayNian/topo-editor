import Path from "@/assets/images/meta/Path.svg?url";
import Text from "@/assets/images/meta/Text.svg?url";
import Rect from "@/assets/images/meta/Rect.svg?url";
import Circle from "@/assets/images/meta/Circle.svg?url";
import Image from "@/assets/images/meta/Image.svg?url";
import type { IMetaSource } from "@/types";

export const MetaBaseIconList: IMetaSource = {
  groupId: "base",
  groupName: "基本图元",
  objList: [
    {
      objType: "path",
      objName: "直线",
      groupId: "base",
      objImg: Path
    },
    {
      objType: "text",
      objName: "文字",
      groupId: "base",
      objImg: Text
    },
    {
      objType: "rect",
      objName: "矩形",
      groupId: "base",
      objImg: Rect
    },
    {
      objType: "circle",
      objName: "圆形",
      groupId: "base",
      objImg: Circle
    },
    {
      objType: "image",
      objName: "图片",
      groupId: "base",
      objImg: Image
    }
  ]
};
