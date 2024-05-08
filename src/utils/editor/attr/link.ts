import * as d3 from "d3";
import type { ILink, IPath, ISVGG } from "@/types";

export const attrLinkG = (linkG: ISVGG<ILink, SVGGElement>) => {
  linkG.attr("class", "link-group").attr("id", (d) => {
    return `link_${d.linkId}${d.isMerge ? "_merge" : ""}`;
  });
};

export const attrLinkGTrans = (el: SVGGElement, tx: number, ty: number) => {
  d3.select(el).attr("transform", `translate(${tx}, ${ty})`);
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
    .style("fill", "none")
    .style("pointer-events", "none");

  shadowlink
    .attr("class", "shadow-link")
    .attr("d", (d) => d.linkPath)
    .attr("stroke", "transparent")
    .attr("stroke-width", (d) => parseFloat(d.style["stroke-width"] + "") * 2)
    .attr("fill", "none")
    .style("pointer-events", "painted")
    .style("cursor", "pointer");
};

export const attrUpdateLink = (d: ILink) => {
  const linkG = d3.select<SVGGElement, ILink>(`#link_${d.linkId}`);
  linkG
    .select("path.link")
    .attr("d", d.linkPath)
    .attr("style", () => {
      let style = "";
      for (const key in d.style) {
        style += `${key}:${d.style[key]};`;
      }
      return style;
    });

  linkG
    .select("path.shadow-link")
    .attr("d", d.linkPath)
    .attr("stroke-width", parseFloat(d.style["stroke-width"] + "") * 2);

  const { x, y, width, height } = linkG.node()!.getBBox();
  d.x = x;
  d.y = y;
  d.width = width;
  d.height = height;
};

export const attrLinkDrag = (isSpaceDown: boolean) => {
  d3.selectAll("path.shadow-link").style("pointer-events", isSpaceDown ? "none" : "painted");
};

export const attrSelectedLink = (link: IPath) => {
  link
    .attr("class", "selected-link")
    .attr("d", (d) => d.linkPath)
    .attr("stroke", "green")
    .attr("fill", "none")
    .attr("stroke-width", (d) => parseFloat(d.style["stroke-width"] + "") * 0.5)
    .attr("stroke-dasharray", "15 5")
    .style("pointer-events", "none");
};
