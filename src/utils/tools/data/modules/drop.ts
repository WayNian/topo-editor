import { useMapStore } from "@/stores";
import type { IOriginalNode, IOriginalLink, IMetaItem, IPosition } from "@/types";
import { addLinkFunc, addNodeFunc, formatObject, getTransPosition } from "@/utils/tools";

export const onDroped = (evt: DragEvent) => {
  const val = evt.dataTransfer?.getData("text/plain");
  const svgEl = document.querySelector("#svgEditor") as SVGSVGElement;
  if (!svgEl) return;
  const rect = svgEl.getBoundingClientRect();
  const x1 = evt.x - rect.x;
  const y1 = evt.y - rect.y;

  const [x, y] = getTransPosition(x1, y1);
  const obj = formatObject(val) as unknown as IMetaItem;
  const [node, link] = generateNodeLink(obj, { x, y });

  node && addNodeFunc(node);
  link && addLinkFunc(link);
};

export const generateNodeLink = (
  val: IMetaItem,
  position: IPosition
): [IOriginalNode | null, IOriginalLink | null] => {
  const mapStore = useMapStore();
  const mapId = mapStore.mapInfo?.mapId || "";
  let node: IOriginalNode | null = null;
  let link: IOriginalLink | null = null;

  if (!mapId) {
    window.$message.error("请先选择图层");
    return [node, link];
  }
  const { x, y } = position;

  if (val.objType === "path") {
    link = {
      mapId, //图层id
      linkType: "实线", //连线类型
      dashedLink: "", //虚线类型
      compClass: "", //关联组件
      domId: "",
      linkPath: "",
      metaData: {},
      linkWidth: 5, //线宽
      linkStyles: '{"color":"#a1a2a2"}', //线样式
      linkAnimations: { fadeOut: "12" }, //线动效
      fromObj: "", //起始对象id
      endObj: "", //终止对象id
      bindData: {}, //关联数据
      bindMap: {},
      sublayerList: [] //关联图层
    };
  } else {
    const nodeType = ["ji", "jianxiu"].includes(val.objType) ? "image" : val.objType;
    node = {
      mapId,
      nodeType,
      domId: "",
      metaData: {},
      compClass: "",
      nodePosition: `${x},${y}`,
      nodeSize: val.objType === "text" ? "120*30" : "100*100",
      rotate: 0,
      nodeStyles: `{"fill": "#19be6b","image":"${val.objImg}"}`,
      nodeText: "",
      fontSize: "16",
      fontColor: "#ffffff",
      textPosition: "0,0",
      textStyles: `{"color": "#ffffff"}`,
      bindData: {},
      bindMap: {},
      sublayerList: [] //关联图层
    };
  }
  return [node, link];
};
