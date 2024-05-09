import * as d3 from "d3";

export const attrSelectionDrag = (isSpaceDown: boolean) => {
  d3.select<SVGSVGElement, any>("#selectionBox rect").attr(
    "pointer-events",
    isSpaceDown ? "none" : "all"
  );
};
