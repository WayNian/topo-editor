import type { ILink, INode, ISourceLink, ISourceNode } from "@/types/topo";

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

export const formatNodes = (data: ISourceNode[]): INode[] => {
  return data.map((item) => {
    const { nodePosition, nodeSize, nodeStyles, textStyles } = item;
    const [x, y] = nodePosition.split(",").map((item) => Number(item));
    const [width, height] = nodeSize.split("*").map((item) => Number(item));

    return {
      ...item,
      x,
      y,
      width,
      height,
      nodeStyles: typeof nodeStyles === "string" ? JSON.parse(nodeStyles) : nodeStyles,
      textStyles: typeof textStyles === "string" ? JSON.parse(textStyles) : textStyles
    };
  });
};

export const formatLinks = (data: ISourceLink[]): ILink[] => {
  return data.map((item) => {
    const { linkStyles } = item;
    return {
      ...item,
      pathArray: parseSvgPath(item.linkPath),
      linkStyles: typeof linkStyles === "string" ? JSON.parse(linkStyles) : linkStyles
    };
  });
};
