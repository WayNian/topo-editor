import type { ILink, INode, ISVGG, ISVGText, ISourceLink, ISourceNode, ISublayer } from "@/types";
import { formatObject } from "../..";
import { useMapStore } from "@/stores";

// 解析路径为数组 js实现path路径解析为数组  M 283.00767973501206 301.5652924636853 L 716 673
export function parseSvgPath(svgPath: string) {
  const regex = /(\d+\.\d+|\d+)/g;
  const matches = svgPath.match(regex);

  if (!matches || matches.length % 2 !== 0) {
    // 处理错误情况，例如无效的路径数据
    console.error("无效的SVG路径数据");
    return [];
  }

  const coordinates = [];

  for (let i = 0; i < matches.length; i += 2) {
    const x = parseFloat(matches[i]);
    const y = parseFloat(matches[i + 1]);
    coordinates.push([x, y]);
  }

  return coordinates;
}

export const formatNode = (data: ISourceNode, sublayers?: ISublayer[]): INode => {
  const { nodePosition, nodeSize, nodeStyles, textStyles } = data;
  const [x, y] = nodePosition.split(",").map((item) => Number(item));
  const [width, height] = nodeSize.split("*").map((item) => Number(item));

  const sublayersFromNode =
    data.sublayerList?.length && sublayers
      ? sublayers
          .filter((sublayer) =>
            data.sublayerList.some((item) => item.sublayerId === sublayer.sublayerId)
          )
          .map((sublayer) => sublayer.listOrder)
      : [-1];

  const maxOrder = Math.max(...sublayersFromNode);
  return {
    ...data,
    id: data.nodeId,
    x,
    y,
    width,
    height,
    style: formatObject(nodeStyles),
    textStyle: formatObject(textStyles),
    zIndex: maxOrder
  };
};
export const formatNodes = (data: ISourceNode[]): INode[] => {
  const mapInfo = useMapStore();
  return data.map((item) => {
    return formatNode(item, mapInfo.sublayers);
  });
};

const formatLinkStyle = (link: ISourceLink, style: Record<string, string>) => {
  const { volt } = link.metaData || {};
  let stroke = style.stroke;

  if (volt === "_110KV") {
    stroke = stroke || "#000000";
  }

  return {
    ...style,
    stroke,
    "stroke-width": (link.linkWidth ? link.linkWidth : parseFloat(style["stroke-width"])) || 1
  };
};
export const formatLink = (link: ISourceLink): ILink => {
  const { linkStyles } = link;
  const style = formatObject(linkStyles);
  return {
    ...link,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    transform: {
      x: 0,
      y: 0
    },
    linkWidth: link.linkWidth ? link.linkWidth : parseFloat(style["stroke-width"]),
    style: formatLinkStyle(link, style)
  };
};

export const formatLinks = (data: ISourceLink[]): ILink[] => {
  return data.map((item) => {
    return formatLink(item);
  });
};

/**
 * 设置连接线的rect
 * @param enterG
 */
export const setLinkRect = (enterG: ISVGG<ILink, SVGGElement>) => {
  enterG.each(function (d) {
    const { x, y, width, height } = this.getBBox();
    d.x = x;
    d.y = y;
    d.width = width;
    d.height = height;
  });
};

/**
 * 设置连接线的text
 * @param enterG
 */
export const setTextRect = (text: ISVGText<INode>) => {
  text.each(function (d) {
    const { width, height } = this.getBBox();
    console.log("🚀 ~  width, height:", width, height);
    d.width = width;
    d.height = height;
  });
};

export function getRgb(colorName?: string | number | undefined) {
  if (!colorName || colorName === "none") return "rgba(0, 0, 0, 0)";
  if (colorName === "transparent") return colorName;
  const el = document.createElement("div");
  el.style.color = colorName + "";
  document.body.appendChild(el);
  const rgbColor = getComputedStyle(el).color;
  document.body.removeChild(el);
  return rgbColor;
}

export const formatNodesAttribute = (nodes: INode[]) => {
  nodes.forEach((node) => {
    node.nodeStyles = JSON.stringify(node.style);
    node.nodePosition = `${node.x},${node.y}`;
    node.nodeSize = `${node.width}*${node.height}`;
  });

  return nodes;
};
