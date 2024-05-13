import * as d3 from "d3";

export const attrSelectionDrag = (isEnableDrag: boolean) => {
  d3.select<SVGSVGElement, any>("#selectionBox rect").attr(
    "pointer-events",
    isEnableDrag ? "all" : "none"
  );
};
