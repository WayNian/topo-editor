import * as d3 from "d3";
import { removeSelectedLink } from "..";
import type { ISVG, ISVGG } from "@/types";
import { setInitTransform } from "../assistant";
import { useTopoStore } from "@/stores/topo";
import { attrSeletView } from "../attr";

const store = useTopoStore();
let zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;
const startPoint = {
  x: 0,
  y: 0
};

const click = (e: PointerEvent) => {
  if (!e.target) return;
  const el = e.target as SVGElement;

  if (el.id === "topoMapBackground" || el.id === "topoEditor") {
    store.currentNode = null;
    store.currentLink = null;
    removeSelectedLink();
  }
};

const mousedown = (e: PointerEvent) => {
  startPoint.x = e.x;
  startPoint.y = e.y;
  store.isSelectViewVisible = true;
};

const mousemove = (e: PointerEvent) => {
  if (!store.isSelectViewVisible) return;
  const width = e.x - startPoint.x;
  const height = e.y - startPoint.y;
  attrSeletView(d3.select<SVGRectElement, any>("#selectView"), startPoint, { width, height });
};

const mouseup = () => {
  store.isSelectViewVisible = false;
  startPoint.x = 0;
  startPoint.y = 0;
};
export const bindMapZoom = (svg: ISVG, topoMap: ISVGG<any, HTMLElement>) => {
  const { x, y, k } = setInitTransform();
  zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.01, 10])
    .on("zoom", (e) => {
      topoMap.attr("transform", e.transform);
    });

  svg
    .call(zoom)
    .on("dblclick.zoom", null)
    .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(k));

  svg
    .on("click", click)
    .on("mousedown", mousedown)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup);
};

export const setPosition = () => {
  const { x, y, k } = setInitTransform();
  const el = d3.select<SVGSVGElement, any>("#mindMapSvg");
  el.call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(k));
};
