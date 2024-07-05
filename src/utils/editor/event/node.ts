import * as d3 from "d3";

import { useCommonStore, useMapStore, useSvgStore } from "@/stores";
import type { INode, ISVGG } from "@/types";
import { setNodesSelected } from "@/utils/tools";

import { attrNodeGTrans } from "../attr";

const startPoint = {
  x: 0,
  y: 0
};

let tx = 0;
let ty = 0;

const dragStart = (e: any, d: INode) => {
  const commonStore = useCommonStore();
  const svgStore = useSvgStore();
  if (!svgStore.isEdit || commonStore.isSpaceDown) return;
  setNodesSelected(d);
  startPoint.x = e.x;
  startPoint.y = e.y;
};

const dragging = (e: any, d: INode, el: SVGGElement) => {
  const commonStore = useCommonStore();
  const svgStore = useSvgStore();
  if (!svgStore.isEdit || commonStore.isSpaceDown) return;

  d.x = e.x;
  d.y = e.y;

  tx = e.x - startPoint.x;
  ty = e.y - startPoint.y;
  attrNodeGTrans(el, e.x, e.y);
};

const dragEnd = (e: any, d: INode) => {
  const commonStore = useCommonStore();
  const svgStore = useSvgStore();
  //   attrSelectionDrag(false);

  //   表示节点没有移动
  if (tx === 0 && ty === 0) return;
  if (!svgStore.isEdit || commonStore.isSpaceDown) return;

  //   drawNodes();

  //   更新接口
  //   updateNode([d]);
};

export const bindNodeDrag = (nodeG: ISVGG<INode, SVGGElement | HTMLElement>) => {
  const mapStore = useMapStore();

  const drag = d3
    .drag<SVGGElement, INode>()
    .on("start", dragStart)
    .on("drag", function (e, d) {
      dragging(e, d, this);
    })
    .on("end", function (e, d) {
      dragEnd(e, d);
    });

  nodeG.call(drag);

  nodeG
    .on("mousedown", (e, d) => {
      dragStart(e, d);
    })
    .on("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      mapStore.showMapMenu({ x: e.clientX, y: e.clientY }, "node");
    });
};
