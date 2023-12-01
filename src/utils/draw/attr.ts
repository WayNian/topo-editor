import type { ISVG, ISVGG, ISVGRect } from "@/types";
import { getScreenSize } from "../tools/common";
import { useTopo } from "@/stores/topo";
import type { INode } from "@/types/data";

const store = useTopo();

export const attrSvg = (svg: ISVG) => {
  const { width, height } = getScreenSize();
  svg.attr("width", width).attr("height", height).style("background-color", "black");
};

export const attrTopoMap = (topoMap: ISVGG<any, HTMLElement>, topoMapBackground: ISVGRect<any>) => {
  const { width, height } = store.mapSize;
  topoMap.attr("width", width).attr("height", height);

  topoMapBackground
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "white")
    .attr("fill", "#3b3b3b");
};

export const attrNodeG = (nodeG: ISVGG<INode, SVGGElement>) => {
  nodeG.attr("class", "node-group").attr("transform", (d: any) => `translate(${d.x}, ${d.y})`);
};
