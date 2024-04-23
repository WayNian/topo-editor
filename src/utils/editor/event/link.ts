import * as d3 from "d3";
import type { ILink, ISVGG } from "@/types";
import { appenSelectedLink, drawLinkSelections, removeSelectedLink } from "../draw";
import { useCommonStore, useMapStore, useSvgStore } from "@/stores";
import { setLinksSelected } from "@/utils/tools";
import { SVGPathData } from "svg-pathdata";

export const bindLinkDrag = (linkG: ISVGG<ILink, SVGGElement>) => {
  const commonStore = useCommonStore();
  const svgStore = useSvgStore();
  const mapStore = useMapStore();

  const drag = d3
    .drag<SVGGElement, ILink>()
    .on("start", (e, d) => {
      if (!svgStore.isEdit || commonStore.isSpaceDown) return;
      setLinksSelected(d);
      svgStore.startPoint.x = e.x;
      svgStore.startPoint.y = e.y;
      //   drawLinkSelections();
    })
    .on("drag", function (e, d) {
      if (!svgStore.isEdit || commonStore.isSpaceDown) return;
      const dx = e.x - svgStore.startPoint.x;
      const dy = e.y - svgStore.startPoint.y;
      d3.select(this).attr("transform", `translate(${dx}, ${dy})`);
      d.transform.x = dx;
      d.transform.y = dy;
      //   drawLinkSelections();
    })
    .on("end", function (e, d) {
      if (!svgStore.isEdit || commonStore.isSpaceDown) return;
      const d1 = new SVGPathData(d.linkPath);
      d1.translate(d.transform.x, d.transform.y);
      console.log("🚀 ~ d1:", d.linkPath, d1);
    });

  linkG.call(drag);

  linkG.on("contextmenu", (e, d) => {
    e.preventDefault();
    e.stopPropagation();
    setLinksSelected(d);
    mapStore.showMapMenu({ x: e.clientX, y: e.clientY });
  });
};
