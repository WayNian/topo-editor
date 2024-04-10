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

export const attrNodeG = (nodeG: ISVGG<INode, SVGGElement>) => {
  nodeG
    .attr("class", "node-group")
    .attr("id", (d) => {
      return `node_${d.nodeId}${d.isMerge ? "_merge" : ""}`;
    })
    .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
    .attr("cursor", "move");
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
    .style("user-select", "none")
    .text((d) => d.nodeId);
};

export const attrForeignObject = (
  foreignObject: ISVGForeignObject<INode>,
  img: ISVGBase<INode>
) => {
  foreignObject
    .attr("class", "node")
    .attr("width", (d) => d.width)
    .attr("height", (d) => d.height);

  img
    .attr("class", "node-content")
    .style("width", "100%")
    .style("height", "100%")
    .style("background-color", "red")
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
