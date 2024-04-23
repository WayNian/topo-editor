import * as d3 from "d3";
import type { ILink, IPath, ISVGG } from "@/types";

export const attrLinkG = (linkG: ISVGG<ILink, SVGGElement>) => {
  linkG.attr("class", "link-group").attr("id", (d) => {
    return `link_${d.linkId}${d.isMerge ? "_merge" : ""}`;
  });
};
export const attrLink = (link: IPath, shadowlink: IPath) => {
  link
    .attr("class", "link")
    .attr("d", (d) => d.linkPath)
    .attr("style", (d) => {
      let style = "";
      for (const key in d.style) {
        style += `${key}:${d.style[key]};`;
      }
      return style;
    })
    .style("pointer-events", "none");

  shadowlink
    .attr("class", "shadow-link")
    .attr("d", (d) => d.linkPath)
    .attr("stroke", "transparent")
    .attr("stroke-width", (d) => parseFloat(d.style["stroke-width"]) * 2)
    .attr("fill", "none")
    .style("pointer-events", "fill")
    .style("cursor", "pointer");
};

export const attrLinkDrag = (isSpaceDown: boolean) => {
  d3.selectAll("path.shadow-link").style("pointer-events", isSpaceDown ? "none" : "fill");
};

export const attrSelectedLink = (link: IPath) => {
  link
    .attr("class", "selected-link")
    .attr("d", (d) => d.linkPath)
    .attr("stroke", "green")
    .attr("fill", "none")
    .attr("stroke-width", (d) => parseFloat(d.style["stroke-width"]) * 0.5)
    .attr("stroke-dasharray", "15 5")
    .style("pointer-events", "none");
};
