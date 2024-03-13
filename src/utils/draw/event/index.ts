import * as d3 from "d3";
import type { ISVGG } from "@/types";
import type { ILink, INode } from "@/types/topo";
import { useTopoStore } from "@/stores/topo";
import { appenSelectedLink, removeSelectedLink } from "..";

const store = useTopoStore();

export const bindNodeDrag = (nodeG: ISVGG<INode, SVGGElement>) => {
  const drag = d3
    .drag<SVGGElement, INode>()
    .on("start", (e, d) => {
      store.currentNode = d;
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

export const bindLinkDrag = (linkG: ISVGG<ILink, SVGGElement>) => {
  const startPoint = {
    x: 0,
    y: 0
  };
  const drag = d3
    .drag<SVGGElement, ILink>()
    .on("start", (e, d) => {
      store.currentLink = d;
      startPoint.x = e.x;
      startPoint.y = e.y;
    })
    .on("drag", function (e, d) {
      const dx = e.x - startPoint.x;
      const dy = e.y - startPoint.y;
      d3.select(this).attr("transform", `translate(${dx}, ${dy})`);
    })
    .on("end", function (e, d) {
      d3.select(this).attr("transform", `translate(${0}, ${0})`);
      d.pathArray = d.pathArray.map((item) => {
        return [item[0] + e.x - startPoint.x, item[1] + e.y - startPoint.y];
      });

      d3.select(this).select(".link").attr("d", d3.line()(d.pathArray));
      d3.select(this).select(".shadow-link").attr("d", d3.line()(d.pathArray));
      d3.select(this).select(".selected-link").attr("d", d3.line()(d.pathArray));
    });

  linkG.on("click", function () {
    removeSelectedLink();
    appenSelectedLink(d3.select<SVGGElement, ILink>(this));
  });
  linkG.call(drag);
};
