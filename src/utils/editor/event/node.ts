import * as d3 from "d3";
import { useCommonStore, useDataStore, useSvgStore } from "@/stores";
import type { INode, ISVGG } from "@/types";
import { setNodesSelected } from "@/utils/tools";

const dataStore = useDataStore();
const commonStore = useCommonStore();
const svgStore = useSvgStore();

export const bindNodeDrag = (nodeG: ISVGG<INode, SVGGElement>) => {
  const drag = d3
    .drag<SVGGElement, INode>()
    .on("start", (e, d) => {
      if (!svgStore.isEdit || commonStore.isSpaceDown) return;
      setNodesSelected(d);
    })
    .on("drag", function (e, d) {
      if (!svgStore.isEdit || commonStore.isSpaceDown) return;
      d.x = e.x;
      d.y = e.y;
      d3.select(this).attr("transform", `translate(${e.x}, ${e.y})`);
    })
    .on("end", (e, d) => {
      if (!svgStore.isEdit || commonStore.isSpaceDown) return;
    });

  nodeG.call(drag);
};
