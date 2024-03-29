import Path from "@/assets/images/meta/Path.svg?url";
import Text from "@/assets/images/meta/Text.svg?url";
import Rect from "@/assets/images/meta/Rect.svg?url";
import Circle from "@/assets/images/meta/Circle.svg?url";
import Image from "@/assets/images/meta/Image.svg?url";

export const MetaBaseIconList = {
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

// const generatePath = ({ x, y }) => {
//   let path = [{ x, y }];
//   for (let i = 1; i <= 2; i++) {
//     path.push({ x: x + i * 100, y });
//   }
//   return path;
// };

/**
 *
 * @param {*} type String
 * @param {*} position {x: number, y: number}
 * @param {*} mapId String
 */
// export const generateNodeLink = (type, position, mapId) => {
//   let params = {};

//   const { x, y } = position;
//   if (mapDataBase.objList.find((obj) => obj.objType === type)) {
//     if (type === "path") {
//       params = {
//         mapId, //图层id
//         linkType: "实线", //连线类型
//         dashedLink: "5,5", //虚线类型
//         compClass: "", //关联组件
//         pathPoints: generatePath(position),
//         linkWidth: 5, //线宽
//         linkStyles: '{"color":"#a1a2a2"}', //线样式
//         linkAnimations: { fadeOut: "12" }, //线动效
//         fromObj: "", //起始对象id
//         endObj: "", //终止对象id
//         bindData: {}, //关联数据
//         bindMap: {}, //关联图层
//       };
//     } else {
//       const t = ["ji", "jianxiu"].includes(type) ? "image" : type;

//       const { objImg } =
//         store.state.topoStore.objectList.find((ele) => ele.objType === type) ||
//         {};

//       params = {
//         mapId,
//         nodeType: t,
//         compClass: "",
//         nodePosition: `${x},${y}`,
//         nodeSize: type === "text" ? "120*30" : "100*100",
//         rotate: 0,
//         nodeStyles: `{"fill": "#19be6b","image":"${objImg}"}`,
//         nodeText: "",
//         fontSize: "16",
//         fontColor: "#ffffff",
//         textPosition: "0,0",
//         textStyles: `{"color": "#ffffff"}`,
//         bindData: {},
//         bindMap: {},
//       };
//     }
//   } else {
//     const power = mapDataPower.objList.find((obj) => obj.objType === type);
//     const {
//       compClass,
//       imgScale = 1,
//       objImg,
//       objType,
//     } = store.state.topoStore.objectList.find((ele) => ele.objType === type) ||
//     {};

//     const nodeType = power ? power.objType.split("_")[0] : objType;
//     const imgUrl = power ? power.objImg : objImg;

//     params = {
//       nodeType,
//       mapId,
//       compClass,
//       position,
//       nodePosition: `${x},${y}`,
//       nodeSize: `100*${Math.round(100 / imgScale)}`,
//       rotate: 0,
//       nodeStyles: `{"fill": "#19be6b", "image": "${imgUrl}"}`,
//       nodeText: "",
//       fontSize: "16",
//       fontColor: "#ffffff",
//       textPosition: "0,0",
//       textStyles: `{"color": "#19be6b"}`,
//       metaData: power ? power.metaData : {},
//       bindData: {},
//       bindMap: {},
//     };
//   }

//   return params;
// };
