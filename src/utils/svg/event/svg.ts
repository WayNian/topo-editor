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
  console.log("mouseup");
  dataStore.isSelectViewVisible = false;
  startPoint.x = 0;
  startPoint.y = 0;
};

let zoomTran = d3.zoomIdentity;
let isZoom = false;

const zoomstart = (e: any) => {};

const zooming = (e: any) => {
  // 按下空格的时候，才能进行移动和缩放，否则只能缩放
  if (zoomTran.k === e.transform.k && !commonStore.isSpaceDown) {
    isZoom = false;
  } else {
    isZoom = true;
    zoomRecord = e.transform;
    svgStore.scale = e.transform.k;
    map.attr("transform", e.transform);
  }
};

export const bindMapZoom = (svgView: ISVG, mapView: ISVGG<any, HTMLElement>) => {
  const { x, y, k } = setInitTransform();
  svg = svgView;
  map = mapView;
  zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.01, 10])
    .on("start", zoomstart)
    .on("zoom", zooming)
    .on("end", (e) => {
      if (isZoom) {
        zoomTran = e.transform;
      } else {
        // 只缩放 不移动的情况，鼠标按住拖动，会导致svg的e.transform和zoomTran不一致,需要重新设置
        if (!e.sourceEvent) return;
        svg.call(
          zoom.transform,
          d3.zoomIdentity.translate(zoomTran.x, zoomTran.y).scale(zoomTran.k)
        );
      }
    });

  svg
    .call(zoom)
    .on("dblclick.zoom", null)
    .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(k))
    .on("click", click)
    .on("mousemove", mousemove);
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
