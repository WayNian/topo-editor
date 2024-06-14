import { useCommonStore, useDataStore, useMapStore, useSvgStore } from "@/stores";
import * as d3 from "d3";
import { updateLink, updateNode } from "@/utils/http/apis";
import { SVGPathData } from "svg-pathdata";
import { attrLinkGTrans, attrNodeGTrans } from "../attr";

const startPoint = {
  x: 0,
  y: 0
};

let tx = 0;
let ty = 0;

const dragStart = (e: any) => {
  const commonStore = useCommonStore();
  const svgStore = useSvgStore();
  if (!svgStore.isEdit || commonStore.isSpaceDown) return;
  startPoint.x = e.x;
  startPoint.y = e.y;
};

const dragging = (e: any) => {
  const commonStore = useCommonStore();
  const svgStore = useSvgStore();

  if (!svgStore.isEdit || commonStore.isSpaceDown) return;

  tx = e.x - startPoint.x;
  ty = e.y - startPoint.y;

  const dataStore = useDataStore();
  dataStore.nodesSelected.forEach((node) => {
    node.x += e.dx;
    node.y += e.dy;
    attrNodeGTrans(document.querySelector(`#node_${node.nodeId}`) as SVGGElement, node.x, node.y);
  });

  dataStore.linksSelected.forEach((link) => {
    link.transform.x = tx;
    link.transform.y = ty;
    attrLinkGTrans(document.querySelector(`#link_${link.linkId}`) as SVGGElement, tx, ty);
  });
};

const dragEnd = () => {
  if (tx === 0 && ty === 0) return;

  const dataStore = useDataStore();
  dataStore.linksSelected.forEach((link) => {
    const d1 = new SVGPathData(link.linkPath);
    const { x, y } = link.transform;
    link.linkPath = d1.translate(x, y).toAbs().encode();
    link.x += x;
    link.y += y;

    link.transform.x = 0;
    link.transform.y = 0;

    // attrLinkGTrans(document.querySelector(`#link_${link.linkId}`) as SVGGElement, 0, 0);
  });

  //   drawNodesLinks();
  updateNode(dataStore.nodesSelected);
  updateLink(dataStore.linksSelected);
};

export const bindDragSelectionEvent = () => {
  const mapStore = useMapStore();
  const drag = d3
    .drag<SVGGElement, any>()
    .on("start", dragStart)
    .on("drag", dragging)
    .on("end", dragEnd);

  d3.select<SVGGElement, any>("#selectionBox").call(drag);

  d3.select<SVGGElement, any>("#selectionBox").on("contextmenu", (e, d) => {
    e.preventDefault();
    e.stopPropagation();
    mapStore.showMapMenu({ x: e.clientX, y: e.clientY }, "group");
  });
};
