import * as d3 from "d3";
import type {
  IPath,
  ISVG,
  ISVGBase,
  ISVGEllipse,
  ISVGForeignObject,
  ISVGG,
  ISVGRect,
  ISVGText,
  ISVGTspant
} from "@/types";
import { useTopo } from "@/stores/topo";
import type { ILink, INode } from "@/types/data";
import { getSvgSize } from "@/utils/tools/common";

const store = useTopo();

export const attrSvg = (svg: ISVG) => {
  const { width, height } = getSvgSize();
  svg.attr("width", width).attr("height", height).style("background-color", "black");
};

export const attrTopoMap = (topoMap: ISVGG<any, HTMLElement>, topoMapBackground: ISVGRect<any>) => {
  let { width, height } = store.mapSize;

  width = store.svgSize.width || width;
  height = store.svgSize.height || height;

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
    .attr("transform", (d) => `translate(${d.position.x}, ${d.position.y})`)
    .attr("cursor", "move");
};

export const attrEllipse = (ellipse: ISVGEllipse<INode>) => {
  ellipse
    .attr("class", "node")
    .attr("rx", (d) => d.size.width / 2)
    .attr("ry", (d) => d.size.height / 2)
    // .attr("cx", (d) => d.width / 2)
    // .attr("cy", (d) => d.height / 2)
    .attr("style", (d) => {
      let style = "";
      for (const key in d.style) {
        style += `${key}:${d.style[key]};`;
      }
      return style;
    })
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
    .style("user-select", "none")
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

export const attrLink = (linkG: ISVGG<ILink, SVGGElement>, link: IPath, shadowlink: IPath) => {
  linkG.attr("class", "link-group");
  link
    .attr("class", "link")
    .attr("id", (d) => "link_" + d.linkId)
    .attr("d", (d) => d.linkPath)
    .attr("style", (d) => {
      let style = "";
      for (const key in d.style) {
        style += `${key}:${d.style[key]};`;
      }
      return style;
    });

  // .attr("stroke", "white")
  // .attr("stroke-width", 2)
  // .attr("fill", "none");

  shadowlink
    .attr("class", "shadow-link")
    .attr("d", (d) => d.linkPath)
    .attr("stroke", "transparent")
    .attr("stroke-width", 10)
    .attr("fill", "none")
    .style("pointer-events", "stroke")
    .style("cursor", "pointer");
};

export const attrSelectedLink = (link: IPath) => {
  link
    .attr("class", "selected-link")
    .attr("d", (d) => d3.line()(d.pathArray))
    .attr("stroke", "green")
    .attr("fill", "none")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "5 5");
};

export const attrSeletView = (
  selectView: ISVGRect<any>,
  position: { x: number; y: number },
  size: { width: number; height: number }
) => {
  selectView
    .attr("width", size.width)
    .attr("height", size.height)
    .attr("x", position.x)
    .attr("y", position.y)
    .attr("fill", "transparent")
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "5 5");
};
