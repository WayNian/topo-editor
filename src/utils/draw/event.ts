import * as d3 from "d3";
import type { ISVG, ISVGG } from "@/types";
import { setInitTransform } from "./assist";

export const bindMapZoom = (svg: ISVG, topoMap: ISVGG<any>) => {
  const { x, y, k } = setInitTransform();
  const zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.1, 10])
    .on("zoom", (e) => {
      topoMap.attr("transform", e.transform);
    });

  svg
    .call(zoom)
    .on("dblclick.zoom", null)
    .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(k));
};
