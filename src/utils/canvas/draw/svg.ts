import * as d3 from "d3";
import {
  attrEllipse,
  attrForeignObject,
  attrLink,
  attrLinkG,
  attrNodeG,
  attrRect,
  attrSelectedLink,
  attrSvg,
  attrText,
  attrTopoMap
} from "../attr";
import { bindLinkDrag, bindNodeDrag } from "../event";
import { useDataStore } from "@/stores/modules/data";
import type { IEnter, IExit, ISVGG, IUpdate } from "@/types";
import type { ILink, INode } from "@/types/modules/canvas";
import { bindMapZoom } from "../event/svg";
import { useMenuStore } from "@/stores/";

const dataStore = useDataStore();
const menuStore = useMenuStore();

const appendEllipse = (nodeG: ISVGG<INode, any>) => {
  const ellipse = nodeG.append<SVGEllipseElement>("ellipse");
  attrEllipse(ellipse);
};

const appendText = (nodeG: ISVGG<INode, any>) => {
  const text = nodeG.append<SVGTextElement>("text");
  const tspan = text.append("tspan");
  attrText(text, tspan);
};

const appendImage = (nodeG: ISVGG<INode, any>) => {
  const foreignObject = nodeG.append<SVGForeignObjectElement>("foreignObject");
  const img = foreignObject.append<d3.BaseType>("xhtml:div");

  attrForeignObject(foreignObject, img);
};

const appendRect = (nodeG: ISVGG<INode, any>) => {
  const rect = nodeG.append<SVGRectElement>("rect");
  attrRect(rect);
};

// 判断nodeG数据的nodeType：circle,text等,通过swicth控制，分别在nodeG内部绘制不同的节点
const drawNode = (nodeG: ISVGG<INode, any>, d: INode) => {
  switch (d.nodeType) {
    case "circle":
    case "ellipse":
      appendEllipse(nodeG);
      break;
    case "text":
      appendText(nodeG);
      break;
    case "rect":
      appendRect(nodeG);
      break;
    default:
      appendImage(nodeG);
      break;
  }
};

const appendNode = (enter: IEnter<INode>) => {
  const enterG = enter.append<SVGGElement>("g");

  attrNodeG(enterG);
  bindNodeDrag(enterG);

  enterG.each(function (d) {
    drawNode(d3.select(this), d);
  });

  return enterG;
};

const updateNode = (update: IUpdate<INode>) => {
  const nodeG = update.select<SVGGElement>("g");
  attrNodeG(nodeG);

  return nodeG;
};

const drawNodes = () => {
  const nodeGroup = d3.select<SVGGElement, any>("#nodeGroup");
  nodeGroup
    .selectAll<SVGGElement, INode>("g.node-group")
    .data(dataStore.nodes, (d: INode) => d.nodeId)
    .join(appendNode, updateNode);
};

export const appenSelectedLink = (linkG: ISVGG<ILink, null>) => {
  if (!linkG.select<SVGGElement>("path.selected-link").empty()) return;
  const link = linkG.append("path");
  attrSelectedLink(link);
};

export const removeSelectedLink = () => {
  d3.select<SVGGElement, any>("#linkGroup").selectAll("path.selected-link").remove();
};

const appendLink = (enter: IEnter<ILink>) => {
  const enterG = enter.append<SVGGElement>("g");
  const link = enterG.append<SVGPathElement>("path");
  const shadowlink = enterG.append<SVGPathElement>("path");
  attrLinkG(enterG);
  attrLink(link, shadowlink);
  bindLinkDrag(enterG);
  return enterG;
};

const updateLink = (update: IUpdate<ILink>) => {
  const link = update.select<SVGPathElement>("path.link");
  const shadowlink = update.select<SVGPathElement>("path.shadow-link");
  attrLink(link, shadowlink);
  return update;
};

export const drawLinks = () => {
  const linkGroup = d3.select<SVGGElement, any>("#linkGroup");
  console.log("dataStore.linkGroup", dataStore.links);

  linkGroup
    .selectAll<SVGGElement, ILink>("g.link-group")
    .data(dataStore.links, (d: ILink) => d.linkId)
    .join(appendLink, updateLink);
};

export const drawMergeNodes = () => {
  d3.select<SVGGElement, any>("#mergeNodeGroup")
    .selectAll<SVGGElement, INode>("g.node-group")
    .data(menuStore.mergeNodeList, (d: INode) => `${d.nodeId}`)
    .join(appendNode);
};

export const drawMergeLinks = () => {
  d3.select<SVGGElement, any>("#mergeLinkGroup")
    .selectAll<SVGGElement, ILink>("g.link-group")
    .data(menuStore.mergeLinkList, (d: ILink) => {
      return `${d.linkId}`;
    })
    .join(appendLink);
};

export const resetHighlight = () => {
  d3.selectAll<SVGPathElement, ILink>(`.link-group path.link`)
    .classed("hight-node-link", false)
    .style("opacity", 1);
  d3.selectAll<SVGGElement, INode>(`.node-group .node`)
    .classed("highlight-node", false)
    .style("opacity", 1);
};

export const highlightNode = (node: INode, type: string) => {
  d3.selectAll<d3.BaseType, INode>(`.node-group .node`)
    .classed("hight-node-link", false)
    .style("opacity", 0.1);
  const oldNode = d3.select<d3.BaseType, INode>(`#node_${node.nodeId} .node`);
  const newNode = d3.select<d3.BaseType, INode>(`#node_${node.nodeId}_merge .node`);

  if (type === "all") {
    oldNode.classed("hight-node-link", true).style("opacity", 1);
    newNode.classed("hight-node-link", true).style("opacity", 1);
  } else if (type === "old") {
    oldNode.classed("hight-node-link", true).style("opacity", 1);
    newNode.classed("hight-node-link", false).style("opacity", 1);
  } else if (type === "new") {
    newNode.classed("hight-node-link", true).style("opacity", 1);
    oldNode.classed("hight-node-link", false).style("opacity", 1);
  }
};

export const highlightLink = (link: ILink, type: string) => {
  d3.selectAll<SVGPathElement, ILink>(`.link-group path.link`)
    .classed("hight-node-link", false)
    .style("opacity", 0.1);
  const oldLink = d3.select<SVGPathElement, ILink>(`#link_${link.linkId} path.link`);
  const newLink = d3.select<SVGPathElement, ILink>(`#link_${link.linkId}_merge path.link`);

  if (type === "all") {
    oldLink.classed("hight-node-link", true).style("opacity", 1);
    newLink.classed("hight-node-link", true).style("opacity", 1);
  } else if (type === "old") {
    oldLink.classed("hight-node-link", true).style("opacity", 1);
    newLink.classed("hight-node-link", false).style("opacity", 1);
  } else if (type === "new") {
    newLink.classed("hight-node-link", true).style("opacity", 1);
    oldLink.classed("hight-node-link", false).style("opacity", 1);
  }
};

export const drawMerge = () => {
  drawMergeNodes();
  drawMergeLinks();
};

const drawMap = () => {
  const svg = d3.select<SVGSVGElement, any>("#canvasEditor");
  const topoMap = svg.select<SVGGElement>("g#topoMap");
  const topoMapBackground = topoMap.select<SVGRectElement>("#topoMapBackground");

  attrSvg();
  attrTopoMap(topoMap, topoMapBackground);
  bindMapZoom(svg, topoMap);
};

export const clearSvg = () => {
  const topoMap = d3.select<SVGGElement, any>("g#topoMap");
  const topoMapBackground = topoMap.select<SVGRectElement>("#topoMapBackground");

  attrTopoMap(topoMap, topoMapBackground);

  d3.select<SVGGElement, any>("#nodeGroup").selectAll("g.node-group").remove();
  d3.select<SVGGElement, any>("#linkGroup").selectAll("g.link-group").remove();
  d3.select<SVGGElement, any>("#mergeNodeGroup").selectAll("g.node-group").remove();
  d3.select<SVGGElement, any>("#mergeLinkGroup").selectAll("g.link-group").remove();
};
export const draw = () => {
  drawMap();
  drawLinks();
  drawNodes();
};
