import * as d3 from "d3";
import { removeSelectedLink } from "../draw/";
import type { ISVG, ISVGG } from "@/types";
import { setInitTransform } from "../assistant";
import { useDataStore } from "@/stores/modules/data";
import { attrSeletView } from "../attr/svg";
import { getSvgSize } from "@/utils/tools/common";
import { useSvgStore } from "@/stores";

const dataStore = useDataStore();
const svgStore = useSvgStore();

let isSpaceDown = false;

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
export const bindMapZoom = (svg: ISVG, map: ISVGG<any, HTMLElement>) => {
  bindWindowEvent();

  const { x, y, k } = setInitTransform();
  zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.01, 10])
    .on("zoom", (e) => {
      svgStore.scale = e.transform.k;
      map.attr("transform", e.transform);
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

const bindWindowEvent = () => {
  console.log("----", d3.select("#svgEditor"));

  //   window.addEventListener("keydown", (e) => {
  //     console.log("🚀 ~ window.addEventListener ~ e:", e);
  //     if (e.key === " ") {
  //       isSpaceDown = true;
  //     }
  //   });

  // 是否按住空格
  d3.select("#svgEditor").on("keydown", function (e) {
    console.log("🚀 ~ e:", e);
    if (e.key === "Space") {
      console.log(51561);

      isSpaceDown = true;
    }
  });
  d3.select("#svgEditor").on("keyup", function (e) {
    if (e.key === "Space") {
      isSpaceDown = false;
    }
  });
};
