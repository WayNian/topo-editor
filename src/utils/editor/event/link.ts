import * as d3 from "d3";
import type { ILink, ISVGG } from "@/types";
import { appenSelectedLink, removeSelectedLink } from "../draw";
import { useCommonStore, useDataStore, useSvgStore } from "@/stores";
import { setLinksSelected } from "@/utils/tools";

export const bindLinkDrag = (linkG: ISVGG<ILink, SVGGElement>) => {
  const commonStore = useCommonStore();
  const svgStore = useSvgStore();

  const startPoint = {
    x: 0,
    y: 0
  };
  const drag = d3
    .drag<SVGGElement, ILink>()
    .on("start", (e, d) => {
      if (!svgStore.isEdit || commonStore.isSpaceDown) return;
      setLinksSelected(d);
      startPoint.x = e.x;
      startPoint.y = e.y;
    })
    .on("drag", function (e, d) {
      if (!svgStore.isEdit || commonStore.isSpaceDown) return;
      const dx = e.x - startPoint.x;
      const dy = e.y - startPoint.y;
      d3.select(this).attr("transform", `translate(${dx}, ${dy})`);
    })
    .on("end", function (e, d) {
      if (!svgStore.isEdit || commonStore.isSpaceDown) return;

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

  linkG.on("contextmenu", (e, d) => {
    e.preventDefault();
    e.stopPropagation();
    setLinksSelected(d);
  });
};
