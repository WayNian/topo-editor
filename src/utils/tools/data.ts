import type { ILink, INode, ISourceLink, ISourceNode } from "@/types/data";

export const formatNodes = (data: ISourceNode[]): INode[] => {
  return data.map((item) => {
    const { nodePosition, nodeSize, nodeStyles, textStyles } = item;
    const [x, y] = nodePosition.split(",").map((item) => Number(item));
    const [width, height] = nodeSize.split("*").map((item) => Number(item));

    console.log(x, y, width, height, item);

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
      linkStyles: typeof linkStyles === "string" ? JSON.parse(linkStyles) : linkStyles
    };
  });
};
