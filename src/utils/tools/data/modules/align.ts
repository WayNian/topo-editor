import { SVGPathData } from "svg-pathdata";

import { useDataStore, useMapStore } from "@/stores";
import type { ILink, INode } from "@/types";
import { updateNodesLinks } from "@/utils/http/apis";

// {
//     label: "左对齐",
//     key: "Left",
//     parent: "Align"
//   },
//   {
//     label: "右对齐",
//     key: "Right",
//     parent: "Align"
//   },
//   {
//     label: "上对齐",
//     key: "Top",
//     parent: "Align"
//   },
//   {
//     label: "下对齐",
//     key: "Bottom",
//     parent: "Align"
//   },
//   {
//     label: "水平居中",
//     key: "CenterX",
//     parent: "Align"
//   },
//   {
//     label: "垂直居中",
//     key: "CenterY",
//     parent: "Align"
//   },
//   {
//     label: "水平分布",
//     key: "DistributeX",
//     parent: "Align"
//   },
//   {
//     label: "垂直分布",
//     key: "DistributeY",
//     parent: "Align"
//   }
/**
 * 如果是单条数据，左对齐到画布左侧
 * 如果是多条数据，左对齐到最左侧的数据
 */

const alignLeft = () => {
  const { nodesSelected, linksSelected } = useDataStore();
  let leftX = 0;
  if (nodesSelected.length + linksSelected.length !== 1) {
    const nodeLeftX = Math.min(...nodesSelected.map((node: INode) => node.x));
    const linkLeftX = Math.min(...linksSelected.map((link: ILink) => link.x));
    leftX = Math.min(nodeLeftX, linkLeftX);
  }

  nodesSelected.forEach((node: INode) => {
    node.x = leftX;
  });

  linksSelected.forEach((link: ILink) => {
    link.linkPath = new SVGPathData(link.linkPath).matrix(1, 0, 0, 1, leftX - link.x, 0).encode();
  });
};

const alignRight = () => {
  const { nodesSelected, linksSelected } = useDataStore();
  let rightX = 0;
  if (nodesSelected.length + linksSelected.length === 1) {
    const { mapSize } = useMapStore();
    rightX = mapSize.width;
  } else {
    const nodeRightX = Math.max(...nodesSelected.map((node: INode) => node.x + node.width));
    const linkRightX = Math.max(...linksSelected.map((link: ILink) => link.x + link.width));
    rightX = Math.max(nodeRightX, linkRightX);
  }

  nodesSelected.forEach((node: INode) => {
    node.x = rightX - node.width;
  });
  linksSelected.forEach((link: ILink) => {
    link.linkPath = new SVGPathData(link.linkPath)
      .matrix(1, 0, 0, 1, rightX - link.x - link.width, 0)
      .encode();
  });
};

const alignTop = () => {
  const { nodesSelected, linksSelected } = useDataStore();
  let topY = 0;
  if (nodesSelected.length + linksSelected.length !== 1) {
    const nodeTopY = Math.min(...nodesSelected.map((node: INode) => node.y));
    const linkTopY = Math.min(...linksSelected.map((link: ILink) => link.y));
    topY = Math.min(nodeTopY, linkTopY);
  }

  nodesSelected.forEach((node: INode) => {
    node.y = topY;
  });

  linksSelected.forEach((link: ILink) => {
    link.linkPath = new SVGPathData(link.linkPath).matrix(1, 0, 0, 1, 0, topY - link.y).encode();
  });
};

const alignBottom = () => {
  const { nodesSelected, linksSelected } = useDataStore();
  let bottomY = 0;
  if (nodesSelected.length + linksSelected.length === 1) {
    const { mapSize } = useMapStore();
    bottomY = mapSize.height;
  } else {
    const nodeBottomY = Math.max(...nodesSelected.map((node: INode) => node.y + node.height));
    const linkBottomY = Math.max(...linksSelected.map((link: ILink) => link.y + link.height));
    bottomY = Math.max(nodeBottomY, linkBottomY);
  }

  nodesSelected.forEach((node: INode) => {
    node.y = bottomY - node.height;
  });
  linksSelected.forEach((link: ILink) => {
    link.linkPath = new SVGPathData(link.linkPath)
      .matrix(1, 0, 0, 1, 0, bottomY - link.y - link.height)
      .encode();
  });
};

const alignCenterX = () => {
  const { nodesSelected, linksSelected } = useDataStore();
  let centerX = 0;
  if (nodesSelected.length + linksSelected.length === 1) {
    const { mapSize } = useMapStore();
    centerX = mapSize.width / 2;
  } else {
    const nodeCenterX = Math.max(...nodesSelected.map((node: INode) => node.x + node.width / 2));
    const linkCenterX = Math.max(...linksSelected.map((link: ILink) => link.x + link.width / 2));
    centerX = Math.max(nodeCenterX, linkCenterX);
  }

  nodesSelected.forEach((node: INode) => {
    node.x = centerX - node.width / 2;
  });
  linksSelected.forEach((link: ILink) => {
    link.linkPath = new SVGPathData(link.linkPath)
      .matrix(1, 0, 0, 1, centerX - link.x - link.width / 2, 0)
      .encode();
  });
};

const alignCenterY = () => {
  const { nodesSelected, linksSelected } = useDataStore();
  let centerY = 0;
  if (nodesSelected.length + linksSelected.length === 1) {
    const { mapSize } = useMapStore();
    centerY = mapSize.height / 2;
  } else {
    const nodeCenterY = Math.max(...nodesSelected.map((node: INode) => node.y + node.height / 2));
    const linkCenterY = Math.max(...linksSelected.map((link: ILink) => link.y + link.height / 2));
    centerY = Math.max(nodeCenterY, linkCenterY);
  }

  nodesSelected.forEach((node: INode) => {
    node.y = centerY - node.height / 2;
  });
  linksSelected.forEach((link: ILink) => {
    link.linkPath = new SVGPathData(link.linkPath)
      .matrix(1, 0, 0, 1, 0, centerY - link.y - link.height / 2)
      .encode();
  });
};

/**
 * 最左边和最右边位置固定，中间的节点等距分布
 * 水平等距
 * @returns
 */
const alignDistributeX = () => {
  const { nodesSelected, linksSelected } = useDataStore();
  if (nodesSelected.length + linksSelected.length < 3) {
    return;
  }

  const nodes = [...nodesSelected, ...linksSelected];
  const nodeXs = nodes.map((node: INode | ILink) => node.x);
  const nodeWidths = nodes.map((node: INode | ILink) => node.width);
  const nodeRightXs = nodes.map((node: INode | ILink) => node.x + node.width);
  const minNodeX = Math.min(...nodeXs);
  const maxNodeRightX = Math.max(...nodeRightXs);
  const totalWidth = maxNodeRightX - minNodeX;
  const totalNodeWidth = nodeWidths.reduce((prev, curr) => prev + curr, 0);
  const totalSpace = totalWidth - totalNodeWidth;
  const space = totalSpace / (nodes.length - 1);

  nodes
    .sort((a: INode | ILink, b: INode | ILink) => a.x - b.x)
    .forEach((node: INode | ILink, index: number) => {
      if (index === 0 || index === nodes.length - 1) {
        return;
      }
      if ((node as INode).nodeId) {
        node.x = nodes[index - 1].x + nodes[index - 1].width + space;
      } else {
        node = node as ILink;
        const tx = nodes[index - 1].x + nodes[index - 1].width + space - node.x;
        node.linkPath = new SVGPathData(node.linkPath).matrix(1, 0, 0, 1, tx, 0).encode();
      }
    });
};

/**
 * 最上边和最下边位置固定，中间的节点等距分布
 * 垂直等距
 * @returns
 */
const alignDistributeY = () => {
  const { nodesSelected, linksSelected } = useDataStore();
  if (nodesSelected.length + linksSelected.length < 3) {
    return;
  }

  const nodes = [...nodesSelected, ...linksSelected];
  const nodeYs = nodes.map((node: INode | ILink) => node.y);
  const nodeHeights = nodes.map((node: INode | ILink) => node.height);
  const nodeBottomYs = nodes.map((node: INode | ILink) => node.y + node.height);
  const minNodeY = Math.min(...nodeYs);
  const maxNodeBottomY = Math.max(...nodeBottomYs);
  const totalHeight = maxNodeBottomY - minNodeY;
  const totalNodeHeight = nodeHeights.reduce((prev, curr) => prev + curr, 0);
  const totalSpace = totalHeight - totalNodeHeight;
  const space = totalSpace / (nodes.length - 1);

  nodes
    .sort((a: INode | ILink, b: INode | ILink) => a.y - b.y)
    .forEach((node: INode | ILink, index: number) => {
      if (index === 0 || index === nodes.length - 1) {
        return;
      }
      if ((node as INode).nodeId) {
        node.y = nodes[index - 1].y + nodes[index - 1].height + space;
      } else {
        node = node as ILink;
        const ty = nodes[index - 1].y + nodes[index - 1].height + space - node.y;
        node.linkPath = new SVGPathData(node.linkPath).matrix(1, 0, 0, 1, 0, ty).encode();
      }
    });
};

export const align = (type: string) => {
  switch (type) {
    case "Left":
      alignLeft();
      break;
    case "Right":
      alignRight();
      break;
    case "Top":
      alignTop();
      break;
    case "Bottom":
      alignBottom();
      break;
    case "CenterX":
      alignCenterX();
      break;
    case "CenterY":
      alignCenterY();
      break;
    case "DistributeX":
      alignDistributeX();
      break;
    case "DistributeY":
      alignDistributeY();
      break;
    default:
  }

  const { nodesSelected, linksSelected } = useDataStore();
  //   drawNodesLinks();
  updateNodesLinks({
    nodes: nodesSelected,
    links: linksSelected
  });
};
