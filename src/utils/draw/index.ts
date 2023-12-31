import * as d3 from "d3";
import {
  attrEllipse,
  attrForeignObject,
  attrLink,
  attrNodeG,
  attrSelectedLink,
  attrSvg,
  attrText,
  attrTopoMap
} from "./attr";
import { bindLinkDrag, bindMapZoom, bindNodeDrag } from "./event";
import { useTopo } from "@/stores/topo";
import type { IEnter, IExit, ISVGG, IUpdate } from "@/types";
import type { ILink, INode } from "@/types/data";

const store = useTopo();

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

const drawNodes = () => {
  const nodeGroup = d3.select<SVGGElement, any>("#topoNodes");
  nodeGroup
    .selectAll<SVGGElement, INode>("g.node-group")
    .data(store.topoNodes, (d: INode) => d.nodeId)
    .join(appendNode);
};

export const appenSelectedLink = (linkG: ISVGG<ILink, null>) => {
  if (!linkG.select<SVGGElement>("path.selected-link").empty()) return;
  const link = linkG.append("path");
  attrSelectedLink(link);
};

export const removeSelectedLink = () => {
  d3.select<SVGGElement, any>("#topoLinks").selectAll("path.selected-link").remove();
};

const appendLink = (enter: IEnter<ILink>) => {
  const enterG = enter.append<SVGGElement>("g");
  const link = enterG.append<SVGPathElement>("path");
  const shadowlink = enterG.append<SVGPathElement>("path");
  attrLink(enterG, link, shadowlink);
  bindLinkDrag(enterG);
  return enterG;
};

const drawLinks = () => {
  const linkGroup = d3.select<SVGGElement, any>("#topoLinks");
  linkGroup
    .selectAll<SVGGElement, ILink>("g.link-group")
    .data(store.topoLinks, (d: ILink) => d.linkId)
    .join(appendLink);
};

const drawMap = () => {
  const svg = d3.select<SVGSVGElement, any>("#topoEditor");
  const topoMap = svg.select<SVGGElement>("g#topoMap");
  const topoMapBackground = topoMap.select<SVGRectElement>("#topoMapBackground");

  attrSvg(svg);
  attrTopoMap(topoMap, topoMapBackground);
  bindMapZoom(svg, topoMap);
};
export const draw = () => {
  drawMap();
  drawLinks();
  drawNodes();
};
