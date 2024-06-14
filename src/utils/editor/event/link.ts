import * as d3 from "d3";
import type { ILink, ISVGG } from "@/types";
import { useCommonStore, useMapStore, useSvgStore } from "@/stores";
import { setLinksSelected } from "@/utils/tools";
import { SVGPathData } from "svg-pathdata";
import { updateLink } from "@/utils/http/apis";

const startPoint = {
  x: 0,
  y: 0
};

let tx = 0;
let ty = 0;
const dragStart = (e: any, d: ILink) => {
  const commonStore = useCommonStore();
  const svgStore = useSvgStore();
  if (!svgStore.isEdit || commonStore.isSpaceDown) return;
  setLinksSelected(d);
  startPoint.x = e.x;
  startPoint.y = e.y;
};

const dragging = (e: any, d: ILink) => {
  const commonStore = useCommonStore();
  const svgStore = useSvgStore();
  if (!svgStore.isEdit || commonStore.isSpaceDown) return;
  tx = e.x - startPoint.x;
  ty = e.y - startPoint.y;
  d.transform.x = tx;
  d.transform.y = ty;

  //   attrLinkGTrans(el, tx, ty);
};

const dragEnd = (e: any, d: ILink) => {
  const commonStore = useCommonStore();
  const svgStore = useSvgStore();

  //   attrSelectionDrag(false);

  //   表示连线没有移动
  if (tx === 0 && ty === 0) return;
  if (!svgStore.isEdit || commonStore.isSpaceDown) return;

  const d1 = new SVGPathData(d.linkPath);
  d.linkPath = d1.translate(d.transform.x, d.transform.y).toAbs().encode();

  d.x += d.transform.x;
  d.y += d.transform.y;
  startPoint.x = 0;
  startPoint.y = 0;
  tx = 0;
  ty = 0;

  d.transform.x = 0;
  d.transform.y = 0;

  //   更新接口
  updateLink([d]);
};

export const bindLinkDrag = (linkG: ISVGG<ILink, SVGGElement | HTMLElement>) => {
  const mapStore = useMapStore();

  const drag = d3
    .drag<SVGGElement, ILink>()
    .on("start", function (e, d) {
      dragStart(e, d);
    })
    .on("drag", function (e, d) {
      dragging(e, d);
    })
    .on("end", function (e, d) {
      dragEnd(e, d);
    });

  linkG.call(drag);

  linkG.on("mousedown", dragStart).on("contextmenu", (e, d) => {
    e.preventDefault();
    e.stopPropagation();
    mapStore.showMapMenu({ x: e.clientX, y: e.clientY }, "link");
  });
};
