import * as d3 from "d3";
import { attrNodeG, attrSvg, attrTopoMap } from "./attr";
import { bindMapZoom, bindNodeDrag } from "./event";
import { useTopo } from "@/stores/topo";
import type { IEnter, IExit, ISVGG, IUpdate } from "@/types";
import type { INode } from "@/types/data";

const store = useTopo();

// 判断nodeG数据的nodeType：circle,text等,通过swicth控制，分别在nodeG内部绘制不同的节点
const drawNode = (nodeG: ISVGG<INode, any>, d: INode) => {
  switch (d.nodeType) {
    case "circle":
      nodeG
        .append<SVGCircleElement>("circle")
        .attr("class", "node")
        .attr("r", 10)
        .attr("cx", (d) => d.width / 2)
        .attr("cy", (d) => d.height / 2)
        .attr("fill", "red")
        .attr("stroke", "black")
        .attr("stroke-width", 2);
      break;
    case "text":
      nodeG
        .append<SVGTextElement>("text")
        .attr("class", "node")
        .attr("alignment-baseline", "before-edge")
        .attr("fill", "white")
        .attr("font-size", 12)
        .text(d.nodeId);
      break;
    default:
      // 图片
      nodeG
        .append<SVGTextElement>("foreignObject")
        .attr("class", "node")
        .attr("width", (d) => d.width)
        .attr("height", (d) => d.height)
        .append("xhtml:div")
        .attr("class", "node-content")
        .style("width", "100%")
        .style("height", "100%")
        .style("background-color", "red")
        .style("border-radius", "50%")
        .style("text-align", "center")
        .style("line-height", "100%");

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
  return update;
};

const removeNode = (exit: IExit<INode>) => {
  exit.remove();
};

const drawNodes = () => {
  const nodeGroup = d3.select<SVGGElement, any>("#topoNodes");
  nodeGroup
    .selectAll<SVGGElement, INode>("g.node-group")
    .data(store.topoNodes, (d: INode) => d.nodeId)
    .join(appendNode, updateNode, removeNode);
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
  drawNodes();

  setTimeout(() => {
    drawNodes();
  }, 5000);
};
