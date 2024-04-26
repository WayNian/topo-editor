import type {
  INode,
  ISVGBase,
  ISVGEllipse,
  ISVGForeignObject,
  ISVGG,
  ISVGRect,
  ISVGText,
  ISVGTspant
} from "@/types";
import * as d3 from "d3";

export const attrNodeG = (nodeG: ISVGG<INode, SVGGElement>) => {
  nodeG
    .attr("class", "node-group")
    .attr("id", (d) => {
      return `node_${d.nodeId}${d.isMerge ? "_merge" : ""}`;
    })
    .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
    .attr("cursor", "pointer");
};

export const attrNodeGTrans = (el: SVGGElement, tx: number, ty: number) => {
  d3.select(el).attr("transform", `translate(${tx}, ${ty})`);
};

export const attrNodeDrag = (isSpaceDown: boolean) => {
  d3.selectAll("g.node-group").style("pointer-events", isSpaceDown ? "none" : "all");
};

export const attrEllipse = (ellipse: ISVGEllipse<INode>) => {
  ellipse
    .attr("class", "node")
    .attr("rx", (d) => d.width / 2)
    .attr("ry", (d) => d.height / 2)
    .attr("cx", (d) => d.width / 2)
    .attr("cy", (d) => d.height / 2)
    .attr("style", (d) => {
      let style = "";
      for (const key in d.style) {
        style += `${key}:${d.style[key]};`;
      }
      return style;
    })
    .attr("fill", "red")
    .attr("stroke", "white")
    .attr("stroke-width", 2);
};

export const attrText = (text: ISVGText<INode>, tspan: ISVGTspant<INode>) => {
  text
    .attr("class", "node")
    .attr("alignment-baseline", "before-edge")
    .attr("fill", "white")
    .attr("font-size", 12);
  tspan
    .attr("x", 0)
    .attr("dy", 12)
    .attr("style", (d) => {
      let style = "";
      for (const key in d.style) {
        style += `${key}:${d.style[key]};`;
      }
      return style;
    })
    .text((d) => d.nodeText);
};

export const attrForeignObject = (
  foreignObject: ISVGForeignObject<INode>,
  imgCon: ISVGBase<INode>
) => {
  foreignObject
    .attr("class", "node")
    .attr("width", (d) => d.width)
    .attr("height", (d) => d.height);

  imgCon
    .attr("class", "node-content")
    .style("width", "100%")
    .style("height", "100%")
    .style("background-color", (d) => `${d.style.fill}`)
    .style("background", (d) => {
      return `url(${d.style.image}) 100% 100% no-repeat`;
    })
    .style("background-size", "100% 100%")
    .style("background-repeat", "no-repeat")
    .style("border-radius", "50%")
    .style("text-align", "center")
    .style("line-height", "100%");
};

export const attrRect = (rect: ISVGRect<INode>) => {
  rect
    .attr("class", "node")
    .attr("width", (d) => d.width)
    .attr("height", (d) => d.height)
    .attr("style", (d) => {
      let style = "";
      for (const key in d.style) {
        style += `${key}:${d.style[key]};`;
      }
      return style;
    });
};
