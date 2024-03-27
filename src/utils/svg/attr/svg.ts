import type { ISVGG, ISVGRect } from "@/types";
import { setSvgBg } from "../event/svg";
import { useMenuStore } from "@/stores";

const menuStore = useMenuStore();

export const attrSvg = () => {
  setSvgBg();
};

export const attrTopoMap = (topoMap: ISVGG<any, HTMLElement>, topoMapBackground: ISVGRect<any>) => {
  const { width, height } = menuStore.mapSize;

  topoMap.attr("width", width).attr("height", height);
  topoMapBackground
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
