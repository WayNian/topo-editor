import * as d3 from "d3";
import type { IEnter, ILink, ISVGG, IUpdate } from "@/types";
import { attrLink, attrLinkG, attrSelectedLink } from "../attr";
import { bindLinkDrag } from "../event";
import { useDataStore, useMenuStore } from "@/stores";

const dataStore = useDataStore();
const menuStore = useMenuStore();

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
  const shadowlink = enterG.append<SVGPathElement>("path");
  attrLinkG(enterG);
  attrLink(link, shadowlink);
  bindLinkDrag(enterG);
  return enterG;
};

const updateLink = (update: IUpdate<ILink>) => {
  const link = update.select<SVGPathElement>("path.link");
  const shadowlink = update.select<SVGPathElement>("path.shadow-link");
  attrLink(link, shadowlink);
  return update;
};

export const drawLinks = () => {
  const linkGroup = d3.select<SVGGElement, any>("#linkGroup");
  console.log("dataStore.linkGroup", dataStore.links);

  linkGroup
    .selectAll<SVGGElement, ILink>("g.link-group")
    .data(dataStore.links, (d: ILink) => d.linkId)
    .join(appendLink, updateLink);
};

export const drawMergeLinks = () => {
  d3.select<SVGGElement, any>("#mergeLinkGroup")
    .selectAll<SVGGElement, ILink>("g.link-group")
    .data(menuStore.mergeLinkList, (d: ILink) => {
      return `${d.linkId}`;
    })
    .join(appendLink);
};
