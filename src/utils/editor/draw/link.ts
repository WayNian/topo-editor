import * as d3 from "d3";
import type { IEnter, ILink, ISVGG, IUpdate } from "@/types";
import { attrLink, attrLinkG, attrSelectedLink } from "../attr";
import { bindLinkDrag } from "../event";
import { useDataStore, useMapStore } from "@/stores";
import { setLinkRect } from "@/utils/tools";

export const appenSelectedLink = (linkG: ISVGG<ILink, null>) => {
  if (!linkG.select<SVGGElement>("path.selected-link").empty()) return;
  const link = linkG.append("path");
  attrSelectedLink(link);
};

export const removeSelectedLink = () => {
  d3.select<SVGGElement, any>("#linkGroup").selectAll("path.selected-link").remove();
};

const appendLink = (enter: IEnter<ILink>) => {
  const enterG = enter.append<SVGGElement>("g");
  const link = enterG.append<SVGPathElement>("path");
  //   const shadowlink = enterG.append<SVGPathElement>("path");
  attrLinkG(enterG);
  attrLink(link);
  bindLinkDrag(enterG);
  setLinkRect(enterG);

  return enterG;
};

const updateLink = (update: IUpdate<ILink>) => {
  const link = update.select<SVGPathElement>("path.link");
  //   const shadowlink = update.select<SVGPathElement>("path.shadow-link");
  attrLink(link);
  setLinkRect(update);
  return update;
};

export const drawLinks = () => {
  const dataStore = useDataStore();
  const linkGroup = d3.select<SVGGElement, any>("#linkGroup");

  linkGroup
    .selectAll<SVGGElement, ILink>("g.link-group")
    .data(dataStore.links, (d: ILink) => d.linkId)
    .join(appendLink, updateLink);
};

export const drawMergeLinks = () => {
  const mapStore = useMapStore();
  d3.select<SVGGElement, any>("#mergeLinkGroup")
    .selectAll<SVGGElement, ILink>("g.link-group")
    .data(mapStore.mergeLinkList, (d: ILink) => d.linkId)
    .join(appendLink);
};

const appendLinkSelection = (enter: IEnter<ILink>) => {
  const enterG = enter.append<SVGRectElement>("rect");
  enterG
    .attr("class", "link-selection")
    .attr("fill", "none")
    .attr("stroke-dasharray", "5,5")
    .attr("stroke", "#409eff")
    .attr("stroke-width", 2)
    .attr("pointer-events", "none")
    .attr("x", (d) => d.x - d.linkWidth * 0.5 - 2)
    .attr("y", (d) => d.y - d.linkWidth * 0.5 - 2)
    .attr("width", (d) => d.width + d.linkWidth + 4)
    .attr("height", (d) => d.height + d.linkWidth + 4);
  return enterG;
};

const updateLinkSelection = (update: d3.Selection<SVGRectElement, ILink, SVGGElement, any>) => {
  update.attr("transform", (d) => `translate(${d.transform.x}, ${d.transform.y})`);

  return update;
};

export const drawLinkSelections = () => {
  const dataStore = useDataStore();
  console.log("dataStore.linksSelected", dataStore.linksSelected);

  d3.select<SVGGElement, any>("#linkSelectionGroup")
    .selectAll<SVGRectElement, ILink>("rect.link-selection")
    .data(dataStore.linksSelected, (d: ILink) => d.linkId)
    .join(appendLinkSelection, updateLinkSelection, (exit) => exit.remove());
};
