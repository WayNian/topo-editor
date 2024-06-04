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
import { getNodeImage } from "@/utils/tools/common/";
import * as d3 from "d3";

export const attrNodeG = (nodeG: ISVGG<INode, SVGGElement>) => {
  nodeG
    .attr("class", "node-group")
    .attr("id", (d) => {
      return `node_${d.nodeId}${d.isMerge ? "_merge" : ""}`;
    })
    .attr("transform", (d) => {
      //   console.log("d", d.nodeId, d.x, d.y);
      return `translate(${d.x}, ${d.y}) rotate(${d.rotate} ${d.width / 2} ${d.height / 2})`;
    })
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
    });
};

export const attrText = (text: ISVGText<INode>, tspan: ISVGTspant<INode>) => {
  text
    .attr("class", "node")
    .attr("width", (d) => d.width)
    .attr("height", (d) => d.height)
    .attr("alignment-baseline", "before-edge")
    .attr("style", (d) => {
      let style = "";
      for (const key in d.style) {
        style += `${key}:${d.style[key]};`;
      }
      return style;
    })
    .style("user-select", "none")
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
    .style("background", (d) => `url(${getNodeImage(d)})`)
    .style("background-size", "contain")
    .style("background-position", "center")
    .style("background-repeat", "no-repeat")
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
