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
    .attr("d", (d) => {
      return d.linkPath;
    })
    .attr("style", (d) => {
      let style = "";
      for (const key in d.style) {
        style += `${key}:${d.style[key]};`;
      }
      return style;
    })
    .style("pointer-events", "stroke");

  // .attr("stroke", "white")
  // .attr("stroke-width", 2)
  // .attr("fill", "none");

  shadowlink
    .attr("class", "shadow-link")
    .attr("d", (d) => d.linkPath)
    .attr("stroke", "transparent")
    .attr("stroke-width", 10)
    .attr("fill", "none")
    .style("pointer-events", "stroke")
    .style("cursor", "pointer");
};

export const attrSelectedLink = (link: IPath) => {
  link
    .attr("class", "selected-link")
    .attr("d", (d) => d3.line()(d.pathArray))
    .attr("stroke", "green")
    .attr("fill", "none")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "5 5");
};
