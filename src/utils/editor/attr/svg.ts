import * as d3 from "d3";
import type { ISVGG, ISVGRect } from "@/types";
import { useMapStore } from "@/stores";

export const attrSvg = () => {
  d3.select<SVGSVGElement, any>("#svgEditor").style("background-color", "black");
};

export const attrMapBackground = (mapBackground: ISVGRect<any>) => {
  const mapStore = useMapStore();
  const { width, height } = mapStore.mapSize;

  mapBackground
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "white")
    .attr("fill", "#3b3b3b");
};

export const attrMap = (map: ISVGG<any, HTMLElement>, trans: d3.ZoomTransform) => {
  map.attr("transform", `translate(${trans.x},${trans.y}) scale(${trans.k})`);
};

export const attrSeletView = (
  selectionRect: ISVGRect<any>,
  position: { x: number; y: number },
  size: { width: number; height: number },
  isHide?: boolean
) => {
  selectionRect
    .attr("width", size.width)
    .attr("height", size.height)
    .attr("x", position.x)
    .attr("y", position.y)
    .attr("fill", "transparent")
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "5 5")
    .style("display", isHide ? "none" : "block");
};
