import type { ILink, INode, ISourceLink, ISourceNode } from "@/types";
import { formatObject } from "../..";

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

export const formatNode = (data: ISourceNode): INode => {
  const { nodePosition, nodeSize, nodeStyles, textStyles } = data;
  const [x, y] = nodePosition.split(",").map((item) => Number(item));
  const [width, height] = nodeSize.split("*").map((item) => Number(item));

  return {
    ...data,
    id: data.nodeId,
    x,
    y,
    width,
    height,
    style: formatObject(nodeStyles),
    textStyle: formatObject(textStyles)
  };
};
export const formatNodes = (data: ISourceNode[]): INode[] => {
  return data.map((item) => {
    return formatNode(item);
  });
};

export const formatLink = (link: ISourceLink): ILink => {
  const { linkStyles } = link;
  return {
    ...link,
    pathArray: parseSvgPath(link.linkPath),
    style: formatObject(linkStyles)
  };
};

export const formatLinks = (data: ISourceLink[]): ILink[] => {
  return data.map((item) => {
    return formatLink(item);
  });
};

export function getRgb(colorName: string) {
  if (colorName === "transparent") return colorName;
  if (colorName === "none") return "rgba(0, 0, 0, 0)";
  const el = document.createElement("div");
  el.style.color = colorName;
  document.body.appendChild(el);
  const rgbColor = getComputedStyle(el).color;
  document.body.removeChild(el);
  return rgbColor;
}
