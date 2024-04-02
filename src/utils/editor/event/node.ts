import * as d3 from "d3";
import { useCommonStore, useDataStore } from "@/stores";
import type { INode, ISVGG } from "@/types";

const dataStore = useDataStore();
const commonStore = useCommonStore();

export const bindNodeDrag = (nodeG: ISVGG<INode, SVGGElement>) => {
  const drag = d3
    .drag<SVGGElement, INode>()
    .on("start", (e, d) => {
      dataStore.currentNode = d;
    })
    .on("drag", function (e, d) {
      if (commonStore.isSpaceDown) return;
      d.x = e.x;
      d.y = e.y;
      d3.select(this).attr("transform", `translate(${e.x}, ${e.y})`);
    })
    .on("end", (e, d) => {
      if (commonStore.isSpaceDown) return;
    });

  nodeG.on("click", (e, d) => {});
  nodeG.call(drag);
};
