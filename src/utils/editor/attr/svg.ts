import * as d3 from "d3";

import { useMapStore, useSvgStore } from "@/stores";
import type { ISVGG, ISVGRect } from "@/types";

export const attrSvg = () => {
  d3.select<SVGSVGElement, any>("#svgEditor").style("background-color", "black");
};

export const attrSvgDrag = (isSpaceDown: boolean) => {
  d3.select<SVGSVGElement, any>("#svgEditor").style("cursor", isSpaceDown ? "grab" : "auto");
};

export const attrSvgDraging = (isDragging: boolean) => {
  d3.select<SVGSVGElement, any>("#svgEditor").style("cursor", isDragging ? "grabbing" : "grab");
};

const getBgFill = () => {
  const mapStore = useMapStore();
  const svgStore = useSvgStore();
  let fill = svgStore.defaultBgFill;
  if (svgStore.isBgSHow) {
    fill = mapStore.mapInfo?.background ? "url(#mapBg)" : svgStore.defaultBgFill;
  }
  return fill;
};

export const attrMapBackground = (mapBackground?: ISVGRect<any>) => {
  const mapStore = useMapStore();
  const { width, height } = mapStore.mapSize;
  if (!mapBackground) {
    mapBackground = d3.select<SVGRectElement, any>("#mapBackground");
  }
  mapBackground.attr("width", width).attr("height", height).attr("fill", getBgFill());
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
