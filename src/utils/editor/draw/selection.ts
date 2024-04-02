import * as d3 from "d3";
import { useDataStore } from "@/stores";
import { attrSeletView } from "../attr";
import type { ISVGRect } from "@/types";

const startPoint = {
  x: 0,
  y: 0
};

const svgOffset = {
  x: 0,
  y: 0
};

const size = {
  width: 0,
  height: 0
};

const dataStore = useDataStore();
let selectionRect: ISVGRect<any>;

export const setStartPoint = (e: d3.D3ZoomEvent<SVGSVGElement, any>) => {
  selectionRect = d3.select<SVGRectElement, any>("#selectionRect");
  const rect = document.getElementById("svgEditor")?.getBoundingClientRect();
  if (!rect || !e.sourceEvent) return;
  const { x, y } = e.sourceEvent;
  svgOffset.x = rect.x;
  svgOffset.y = rect.y;

  startPoint.x = x - rect.x;
  startPoint.y = y - rect.y;
  dataStore.isSelectionRectVisible = true;
};

export const updateSelectionRect = (e: d3.D3ZoomEvent<SVGSVGElement, any>) => {
  if (!e.sourceEvent || !dataStore.isSelectionRectVisible) return;
  let { x, y } = e.sourceEvent;
  x = x - svgOffset.x;
  y = y - svgOffset.y;

  const point = {
    x: 0,
    y: 0
  };

  size.width = Math.abs(x - startPoint.x);
  size.height = Math.abs(y - startPoint.y);

  point.x = startPoint.x;
  point.y = startPoint.y;

  if (x < startPoint.x) {
    point.x = x;
  }
  if (y < startPoint.y) {
    point.y = y;
  }

  attrSeletView(selectionRect, point, size);
};

export const hideSelectionRect = () => {
  dataStore.isSelectionRectVisible = false;
  startPoint.x = 0;
  startPoint.y = 0;
  size.width = 0;
  size.height = 0;
  attrSeletView(selectionRect, startPoint, size, true);
};
