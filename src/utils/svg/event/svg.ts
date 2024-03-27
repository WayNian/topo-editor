import * as d3 from "d3";
import { removeSelectedLink } from "../draw/svg";
import type { ISVG, ISVGG } from "@/types";
import { setInitTransform } from "../assistant";
import { useDataStore } from "@/stores/modules/data";
import { attrSeletView } from "../attr";
import { getSvgSize } from "@/utils/tools/common";
import { useSvgStore } from "@/stores";

const dataStore = useDataStore();
const svgStore = useSvgStore();

let zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;
const startPoint = {
  x: 0,
  y: 0
};

const click = (e: PointerEvent) => {
  if (!e.target) return;
  const el = e.target as SVGElement;

  if (el.id === "topoMapBackground" || el.id === "svgEditor") {
    dataStore.currentNode = null;
    dataStore.currentLink = null;
    removeSelectedLink();
  }
};

const mousedown = (e: PointerEvent) => {
  startPoint.x = e.x;
  startPoint.y = e.y;
  dataStore.isSelectViewVisible = true;
};

const mousemove = (e: PointerEvent) => {
  if (!dataStore.isSelectViewVisible) return;
  const width = e.x - startPoint.x;
  const height = e.y - startPoint.y;
  attrSeletView(d3.select<SVGRectElement, any>("#selectView"), startPoint, { width, height });
};

const mouseup = () => {
  dataStore.isSelectViewVisible = false;
  startPoint.x = 0;
  startPoint.y = 0;
};
export const bindMapZoom = (svg: ISVG, topoMap: ISVGG<any, HTMLElement>) => {
  const { x, y, k } = setInitTransform();

  zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.01, 10])
    .on("zoom", (e) => {
      svgStore.scale = e.transform.k;
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

export const resetSvgSizePosition = () => {
  const { x, y, k } = setInitTransform();
  d3.select<SVGSVGElement, any>("#svgEditor")
    .transition()
    .duration(1000)
    .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(k));
};

export const setSvgBg = () => {
  const { width, height } = getSvgSize();
  d3.select<SVGSVGElement, any>("#svgEditor")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "black");
};
