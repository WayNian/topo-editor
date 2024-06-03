import * as d3 from "d3";
import { hideSelectionRect, setStartPoint, updateSelectionRect } from "../draw/";
import type { ISVG, ISVGG } from "@/types";
import { setInitTransform } from "../helper";
import { useDataStore } from "@/stores/modules/data";
import { useCommonStore, useSvgStore } from "@/stores";
import { attrMap, attrSvgDraging } from "../attr";
import { clearNodesLinksSelected } from "@/utils/tools";

let zoomRecord = d3.zoomIdentity;
let svg: ISVG;
let map: ISVGG<any, HTMLElement>;

let zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;
const startPoint = {
  x: 0,
  y: 0
};

let zoomTran = d3.zoomIdentity;
let isZoom = false;

function wheelDelta(event: any) {
  return (
    -event.deltaY *
    (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) *
    (event.ctrlKey ? 10 : 1)
  );
}

const zoomstart = (e: d3.D3ZoomEvent<SVGSVGElement, any>) => {
  const dataStore = useDataStore();
  const commonStore = useCommonStore();

  const el = e.sourceEvent;
  if (el && el.type === "mousedown" && !commonStore.isSpaceDown) {
    if (el.target.id === "mapBackground" || el.target.id === "svgEditor") {
      dataStore.currentNode = null;
      dataStore.currentLink = null;
      clearNodesLinksSelected();
    }
  }
  if (commonStore.isSpaceDown) {
    attrSvgDraging(true);
  }
  setStartPoint(e);
};

const zooming = (e: d3.D3ZoomEvent<SVGSVGElement, any>) => {
  const dataStore = useDataStore();
  const svgStore = useSvgStore();
  const commonStore = useCommonStore();

  svgStore.zoom = e.transform.k;
  // 按下空格的时候，才能进行移动和缩放，否则只能缩放
  if (zoomTran.k === e.transform.k && !commonStore.isSpaceDown) {
    isZoom = false;
    updateSelectionRect(e);
    zoom.wheelDelta(() => 0);
  } else {
    isZoom = true;
    zoomRecord = e.transform;
    svgStore.scale = e.transform.k;
    dataStore.isSelectionRectVisible = false;

    attrMap(map, e.transform);
  }
};

const zoomend = (e: d3.D3ZoomEvent<SVGSVGElement, any>) => {
  const dataStore = useDataStore();
  const svgStore = useSvgStore();
  const commonStore = useCommonStore();

  svgStore.zoomTrans = e.transform;

  if (commonStore.isSpaceDown) {
    attrSvgDraging(false);
  }

  if (isZoom) {
    zoomTran = e.transform;
  } else {
    zoom.wheelDelta(wheelDelta);

    dataStore.isSelectionRectVisible = false;
    startPoint.x = 0;
    startPoint.y = 0;

    // 只缩放 不移动的情况，鼠标按住拖动，会导致svg的e.transform和zoomTran不一致,需要重新设置
    if (!e.sourceEvent) return;
    hideSelectionRect();
    svg.call(zoom.transform, d3.zoomIdentity.translate(zoomTran.x, zoomTran.y).scale(zoomTran.k));
  }
};

const click = (e: PointerEvent) => {
  const dataStore = useDataStore();
  const commonStore = useCommonStore();

  if (!e.target) return;
  const el = e.target as SVGElement;

  if (commonStore.isShiftDown) return;
  if (el.id === "mapBackground" || el.id === "svgEditor") {
    dataStore.currentNode = null;
    dataStore.currentLink = null;
    // removeSelectedLink();
    clearNodesLinksSelected();
  }
};

export const bindMapZoom = (svgView: ISVG, mapView: ISVGG<any, HTMLElement>) => {
  const svgStore = useSvgStore();
  const { x, y, k } = setInitTransform();

  svg = svgView;
  map = mapView;
  svgStore.zoomTrans = { x, y, k };

  zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.01, 10])
    .on("start", zoomstart)
    .on("zoom", zooming)
    .on("end", zoomend);

  svg
    .call(zoom)
    .on("dblclick.zoom", null)
    .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(k));
  // .on("click", click);
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
