import * as d3 from "d3";
import { attrSvg, attrTopoMap } from "./attr";
import { bindMapZoom } from "./event";

const drawNodes = () => {
  const nodeGroup = d3.select<SVGSVGElement, any>("#topoNodes");
  nodeGroup.append("circle").attr("cx", 100).attr("cy", 100).attr("r", 50).attr("fill", "red");
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
