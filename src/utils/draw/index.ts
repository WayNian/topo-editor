import * as d3 from "d3";
import { attrSvg, attrTopoMap } from "./attr";
import { bindMapZoom } from "./event";
import { useTopo } from "@/stores/topo";
import type { IEnter, IExit, IUpdate } from "@/types";
import type { INode } from "@/types/data";

const store = useTopo();

const appendNode = (enter: IEnter<INode>) => {
  const enterG = enter
    .append("g")
    .attr("class", "node")
    .attr("transform", (d: INode) => `translate(${d.x}, ${d.y})`);
  enterG
    .append("circle")
    .attr("r", 10)
    .attr("fill", "red")
    .attr("stroke", "black")
    .attr("stroke-width", 2);

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
    .selectAll<SVGGElement, INode>("g.node")
    .data(store.topoNodes, (d: INode) => d.nodeId)
    .join(appendNode, updateNode, removeNode);
};

const drawMap = () => {
  const svg = d3.select<SVGSVGElement, any>("#topoEditor");
  const topoMap = svg.select<SVGSVGElement>("#topoMap");
  const topoMapBackground = topoMap.select<SVGRectElement>("#topoMapBackground");

  attrSvg(svg);
  attrTopoMap(topoMap, topoMapBackground);
  bindMapZoom(svg, topoMap);
};
export const draw = () => {
  drawMap();
  drawNodes();
};
