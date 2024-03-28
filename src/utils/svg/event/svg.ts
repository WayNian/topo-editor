import * as d3 from "d3";
import { removeSelectedLink } from "../draw/";
import type { ISVG, ISVGG } from "@/types";
import { setInitTransform } from "../assistant";
import { useDataStore } from "@/stores/modules/data";
import { attrSeletView } from "../attr/svg";
import { useCommonStore, useSvgStore } from "@/stores";

const dataStore = useDataStore();
const svgStore = useSvgStore();
const commonStore = useCommonStore();

let zoomRecord = d3.zoomIdentity;
let svg: ISVG;
let map: ISVGG<any, HTMLElement>;

let zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;
const startPoint = {
  x: 0,
  y: 0
};

const click = (e: PointerEvent) => {
  if (!e.target) return;
  const el = e.target as SVGElement;

  if (el.id === "mapBackground" || el.id === "svgEditor") {
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

const zooming = (e: any) => {
  if (commonStore.isSpaceDown) return;
  zoomRecord = e.transform;
  svgStore.scale = e.transform.k;
  map.attr("transform", e.transform);
};

export const bindMapZoom = (svgView: ISVG, mapView: ISVGG<any, HTMLElement>) => {
  const { x, y, k } = setInitTransform();
  svg = svgView;
  map = mapView;
  zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.01, 10]).on("zoom", zooming);

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

export const resetSvg = () => {
  d3.select<SVGSVGElement, any>("#svgEditor").call(
    zoom.transform,
    d3.zoomIdentity.translate(zoomRecord.x, zoomRecord.y).scale(zoomRecord.k)
  );
};
