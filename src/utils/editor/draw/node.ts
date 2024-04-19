import * as d3 from "d3";
import type { IEnter, INode, ISVGG, IUpdate } from "@/types";
import { attrEllipse, attrForeignObject, attrNodeG, attrRect, attrText } from "../attr";
import { bindNodeDrag } from "../event";
import { useDataStore, useMapStore } from "@/stores";

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

const updateEllipse = (nodeG: ISVGG<INode, any>) => {
  const ellipse = nodeG.select<SVGEllipseElement>("ellipse");
  attrEllipse(ellipse);
};

const updateText = (nodeG: ISVGG<INode, any>) => {
  const text = nodeG.select<SVGTextElement>("text");
  const tspan = text.select<SVGTSpanElement>("tspan");
  attrText(text, tspan);
};

const updateImage = (nodeG: ISVGG<INode, any>) => {
  const foreignObject = nodeG.select<SVGForeignObjectElement>("foreignObject");
  const img = foreignObject.select<d3.BaseType>("div");

  attrForeignObject(foreignObject, img);
};

const updateRect = (nodeG: ISVGG<INode, any>) => {
  const rect = nodeG.select<SVGRectElement>("rect");
  attrRect(rect);
};

const updateNodeAttr = (nodeG: ISVGG<INode, any>) => {
  if (!nodeG.size()) return;
  const d = nodeG.datum();
  switch (d.nodeType) {
    case "circle":
    case "ellipse":
      updateEllipse(nodeG);
      break;
    case "text":
      updateText(nodeG);
      break;
    case "rect":
      updateRect(nodeG);
      break;
    default:
      updateImage(nodeG);
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
  attrNodeG(update);
  updateNodeAttr(update);
  return update;
};

export const drawNodes = () => {
  const dataStore = useDataStore();
  const nodeGroup = d3.select<SVGGElement, any>("#nodeGroup");

  nodeGroup
    .selectAll<SVGGElement, INode>("g.node-group")
    .data(dataStore.nodes, (d: INode) => d.nodeId)
    .join(appendNode, updateNode, (exit) => exit.remove());
};

export const drawMergeNodes = () => {
  const mapStore = useMapStore();
  d3.select<SVGGElement, any>("#mergeNodeGroup")
    .selectAll<SVGGElement, INode>("g.node-group")
    .data(mapStore.mergeNodeList, (d: INode) => `${d.nodeId}`)
    .join(appendNode);
};

export const removeNode = (nodeId: string) => {
  d3.select<SVGGElement, any>("#nodeGroup").select(`#node_${nodeId}`).remove();
};
