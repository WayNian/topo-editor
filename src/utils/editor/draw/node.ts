import * as d3 from "d3";
import type { IEnter, INode, ISVGG, IUpdate } from "@/types";
import { attrEllipse, attrForeignObject, attrNodeG, attrRect, attrText } from "../attr";
import { bindNodeDrag } from "../event";
import { useDataStore, useMenuStore } from "@/stores";

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

export const appendNode = (enter: IEnter<INode>) => {
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

export const drawNodes = () => {
  const nodeGroup = d3.select<SVGGElement, any>("#nodeGroup");
  nodeGroup
    .selectAll<SVGGElement, INode>("g.node-group")
    .data(dataStore.nodes, (d: INode) => d.nodeId)
    .join(appendNode, updateNode);
};

export const drawMergeNodes = () => {
  d3.select<SVGGElement, any>("#mergeNodeGroup")
    .selectAll<SVGGElement, INode>("g.node-group")
    .data(menuStore.mergeNodeList, (d: INode) => `${d.nodeId}`)
    .join(appendNode);
};
