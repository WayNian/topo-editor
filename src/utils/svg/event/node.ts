import * as d3 from "d3";
import { useDataStore } from "@/stores";
import type { INode, ISVGG } from "@/types";

const dataStore = useDataStore();

export const bindNodeDrag = (nodeG: ISVGG<INode, SVGGElement>) => {
  const drag = d3
    .drag<SVGGElement, INode>()
    .on("start", (e, d) => {
      dataStore.currentNode = d;
    })
    .on("drag", function (e, d) {
      d.x = e.x;
      d.y = e.y;
      d3.select(this).attr("transform", `translate(${e.x}, ${e.y})`);
    })
    .on("end", (e, d) => {});

  nodeG.on("click", (e, d) => {});
  nodeG.call(drag);
};
