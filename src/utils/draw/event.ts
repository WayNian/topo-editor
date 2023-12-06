import * as d3 from "d3";
import type { ISVG, ISVGG } from "@/types";
import { setInitTransform } from "./assist";
import type { INode } from "@/types/data";
import { useTopo } from "@/stores/topo";

const store = useTopo();
export const bindMapZoom = (svg: ISVG, topoMap: ISVGG<any, HTMLElement>) => {
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

  svg.on("click", function (e) {
    if (e.target === this || e.target === d3.select("#topoMapBackground").node()) {
      store.nodeSelected = null;
    }
  });
};

export const bindNodeDrag = (nodeG: ISVGG<INode, SVGGElement>) => {
  const drag = d3
    .drag<SVGGElement, INode>()
    .on("start", (e, d) => {
      store.nodeSelected = d;
    })
    .on("drag", function (e, d) {
      d.x = e.x;
      d.y = e.y;
      d3.select(this).attr("transform", `translate(${e.x}, ${e.y})`);
    })
    .on("end", (e, d) => {});

  nodeG.on("click", (e, d) => {});
  nodeG.call(drag);
};
