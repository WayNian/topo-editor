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
};

export const updateSelectionRect = (e: d3.D3ZoomEvent<SVGSVGElement, any>) => {
  if (!e.sourceEvent) return;
  dataStore.isSelectionRectVisible = true;
  size.width = e.sourceEvent.x - startPoint.x - svgOffset.x;
  size.height = e.sourceEvent.y - startPoint.y - svgOffset.y;

  attrSeletView(selectionRect, startPoint, size);
};

export const hideSelectionRect = () => {
  dataStore.isSelectionRectVisible = true;
  startPoint.x = 0;
  startPoint.y = 0;
  size.width = 0;
  size.height = 0;
  attrSeletView(selectionRect, startPoint, size, true);
};
