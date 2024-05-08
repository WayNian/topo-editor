import { useDataStore, useMapStore } from "@/stores";
import type { ILink, INode } from "@/types";
import { drawNodesLinks } from "@/utils/editor/draw";
import { SVGPathData } from "svg-pathdata";

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
    const linkLeftX = Math.min(...linksSelected.map((link: ILink) => link.rect.x));
    leftX = Math.min(nodeLeftX, linkLeftX);
  }

  nodesSelected.forEach((node: INode) => {
    node.x = leftX;
  });

  linksSelected.forEach((link: ILink) => {
    link.linkPath = new SVGPathData(link.linkPath)
      .matrix(1, 0, 0, 1, leftX - link.rect.x, 0)
      .encode();
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
    const linkRightX = Math.max(
      ...linksSelected.map((link: ILink) => link.rect.x + link.rect.width)
    );
    rightX = Math.max(nodeRightX, linkRightX);
  }

  nodesSelected.forEach((node: INode) => {
    node.x = rightX - node.width;
  });
  linksSelected.forEach((link: ILink) => {
    link.linkPath = new SVGPathData(link.linkPath)
      .matrix(1, 0, 0, 1, rightX - link.rect.x - link.rect.width, 0)
      .encode();
  });
};

const alignTop = () => {
  const { nodesSelected, linksSelected } = useDataStore();
  let topY = 0;
  if (nodesSelected.length + linksSelected.length !== 1) {
    const nodeTopY = Math.min(...nodesSelected.map((node: INode) => node.y));
    const linkTopY = Math.min(...linksSelected.map((link: ILink) => link.rect.y));
    topY = Math.min(nodeTopY, linkTopY);
  }

  nodesSelected.forEach((node: INode) => {
    node.y = topY;
  });

  linksSelected.forEach((link: ILink) => {
    link.linkPath = new SVGPathData(link.linkPath)
      .matrix(1, 0, 0, 1, 0, topY - link.rect.y)
      .encode();
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
    const linkBottomY = Math.max(
      ...linksSelected.map((link: ILink) => link.rect.y + link.rect.height)
    );
    bottomY = Math.max(nodeBottomY, linkBottomY);
  }

  nodesSelected.forEach((node: INode) => {
    node.y = bottomY - node.height;
  });
  linksSelected.forEach((link: ILink) => {
    link.linkPath = new SVGPathData(link.linkPath)
      .matrix(1, 0, 0, 1, 0, bottomY - link.rect.y - link.rect.height)
      .encode();
  });
};

export const align = (type: string) => {
  console.log("🚀 ~ align ~ type:", type);
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
    default:
  }

  drawNodesLinks();
};
