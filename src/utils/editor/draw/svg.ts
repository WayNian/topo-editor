import * as d3 from "d3";

import { useCommonStore, useMapStore } from "@/stores/";
import type { ILink, INode } from "@/types/modules/data";

import { attrMapBackground,attrSvg } from "../attr/";
import { bindMapZoom } from "../event/svg";

import { drawMergeLinks, drawMergeNodes } from ".";

export const resetHighlight = () => {
  d3.selectAll<SVGPathElement, ILink>(`.link-group path.link`)
    .classed("hight-node-link", false)
    .style("opacity", 1);
  d3.selectAll<SVGGElement, INode>(`.node-group .node`)
    .classed("highlight-node", false)
    .style("opacity", 1);
};

export const highlightNode = (node: INode, type: string) => {
  d3.selectAll<d3.BaseType, INode>(`.node-group .node`)
    .classed("hight-node-link", false)
    .style("opacity", 0.1);
  const oldNode = d3.select<d3.BaseType, INode>(`#node_${node.nodeId} .node`);
  const newNode = d3.select<d3.BaseType, INode>(`#node_${node.nodeId}_merge .node`);

  if (type === "all") {
    oldNode.classed("hight-node-link", true).style("opacity", 1);
    newNode.classed("hight-node-link", true).style("opacity", 1);
  } else if (type === "old") {
    oldNode.classed("hight-node-link", true).style("opacity", 1);
    newNode.classed("hight-node-link", false).style("opacity", 1);
  } else if (type === "new") {
    newNode.classed("hight-node-link", true).style("opacity", 1);
    oldNode.classed("hight-node-link", false).style("opacity", 1);
  }
};

export const transparentizeNodeLink = () => {
  d3.selectAll<SVGPathElement, ILink>(`.link-group path.link`)
    .classed("hight-node-link", false)
    .style("opacity", 0.1);
  d3.selectAll<SVGGElement, INode>(`.node-group .node`)
    .classed("highlight-node", false)
    .style("opacity", 0.1);
};

export const highlightLink = (link: ILink, type: string) => {
  transparentizeNodeLink();

  const oldLink = d3.select<SVGPathElement, ILink>(`#link_${link.linkId} path.link`);
  const newLink = d3.select<SVGPathElement, ILink>(`#link_${link.linkId}_merge path.link`);

  if (type === "all") {
    oldLink.classed("hight-node-link", true).style("opacity", 1);
    newLink.classed("hight-node-link", true).style("opacity", 1);
  } else if (type === "old") {
    oldLink.classed("hight-node-link", true).style("opacity", 1);
    newLink.classed("hight-node-link", false).style("opacity", 1);
  } else if (type === "new") {
    newLink.classed("hight-node-link", true).style("opacity", 1);
    oldLink.classed("hight-node-link", false).style("opacity", 1);
  }
};

export const drawMerge = () => {
  drawMergeNodes();
  drawMergeLinks();
};

export const drawMap = () => {
  const svg = d3.select<SVGSVGElement, any>("#svgEditor");
  const map = svg.select<SVGGElement>("g#map");

  attrSvg();
  attrMapBackground(map.select<SVGRectElement>("#mapBackground"));
  bindMapZoom(svg, map);
};

const drawDefs = () => {
  const mapStore = useMapStore();

  const defs = d3.select<SVGSVGElement, any>("#svgEditor").select("#mapDefs");
  if (defs.empty()) {
    d3.select<SVGSVGElement, any>("#svgEditor").append("defs").attr("id", "mapDefs");
  }
  defs.html(mapStore.mapInfo?.defs || "");
};
export const clearSvg = () => {
  const mapStore = useMapStore();
  const commonStore = useCommonStore();

  mapStore.setMapInfo();
  commonStore.isAttributeViewVisible = false;

  attrMapBackground(d3.select<SVGRectElement, any>("#mapBackground"));

  d3.select<SVGGElement, any>("#nodeGroup").selectAll("g.node-group").remove();
  d3.select<SVGGElement, any>("#linkGroup").selectAll("g.link-group").remove();
  d3.select<SVGGElement, any>("#mergeNodeGroup").selectAll("g.node-group").remove();
  d3.select<SVGGElement, any>("#mergeLinkGroup").selectAll("g.link-group").remove();
};

export const draw = () => {
  drawMap();
  drawDefs();
  //   drawLinks();
  //   drawNodes();
};

export const drawNodesLinks = () => {
  //   drawLinks();
  //   drawNodes();
};
