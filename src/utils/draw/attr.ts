import type {
  ISVG,
  ISVGBase,
  ISVGCircle,
  ISVGEllipse,
  ISVGForeignObject,
  ISVGG,
  ISVGRect,
  ISVGText,
  ISVGTspant
} from "@/types";
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
  nodeG
    .attr("class", "node-group")
    .attr("transform", (d: any) => `translate(${d.x}, ${d.y})`)
    .attr("cursor", "move");
};

export const attrEllipse = (ellipse: ISVGEllipse<INode>) => {
  ellipse
    .attr("class", "node")
    .attr("rx", (d) => d.width / 2)
    .attr("ry", (d) => d.height / 2)
    .attr("cx", (d) => d.width / 2)
    .attr("cy", (d) => d.height / 2)
    .attr("fill", "red")
    .attr("stroke", "white")
    .attr("stroke-width", 2);
};

export const attrText = (text: ISVGText<INode>, tspan: ISVGTspant<INode>) => {
  text
    .attr("class", "node")
    .attr("alignment-baseline", "before-edge")
    .attr("fill", "white")
    .attr("font-size", 12);
  tspan
    .attr("x", 0)
    .attr("dy", 12)
    .text((d) => d.nodeId);
};

export const attrForeignObject = (
  foreignObject: ISVGForeignObject<INode>,
  img: ISVGBase<INode>
) => {
  foreignObject
    .attr("class", "node")
    .attr("width", (d) => d.width)
    .attr("height", (d) => d.height);

  img
    .attr("class", "node-content")
    .style("width", "100%")
    .style("height", "100%")
    .style("background-color", "red")
    .style("border-radius", "50%")
    .style("text-align", "center")
    .style("line-height", "100%");
};
