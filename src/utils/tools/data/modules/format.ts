import type { ILink, INode, ISourceLink, ISourceNode } from "@/types";

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

const formatObject = (data: string): Record<string, string> => {
  if (!data) return {};
  if (typeof data === "object") return data;
  try {
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};
export const formatNodes = (data: ISourceNode[]): INode[] => {
  return data.map((item) => {
    const { nodePosition, nodeSize, nodeStyles, textStyles } = item;
    const [x, y] = nodePosition.split(",").map((item) => Number(item));
    const [width, height] = nodeSize.split("*").map((item) => Number(item));

    return {
      ...item,
      id: item.nodeId,
      x,
      y,
      width,
      height,
      position: { x, y },
      size: { width, height },
      style: formatObject(nodeStyles),
      textStyle: formatObject(textStyles)
    };
  });
};

export const formatLinks = (data: ISourceLink[]): ILink[] => {
  return data.map((item) => {
    const { linkStyles } = item;
    return {
      ...item,
      pathArray: parseSvgPath(item.linkPath),
      style: formatObject(linkStyles)
    };
  });
};
