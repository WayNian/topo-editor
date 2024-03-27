import * as d3 from "d3";
import type { ISVGRect } from "@/types";
import { useMenuStore } from "@/stores";

const menuStore = useMenuStore();

export const attrSvg = () => {
  d3.select<SVGSVGElement, any>("#svgEditor").style("background-color", "black");
};

export const attrMap = (mapBackground: ISVGRect<any>) => {
  const { width, height } = menuStore.mapSize;

  mapBackground
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "white")
    .attr("fill", "#3b3b3b");
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
