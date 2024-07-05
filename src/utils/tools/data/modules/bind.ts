import * as d3 from "d3";
import type { TreeOption } from "naive-ui";

import type { IMetaItem } from "@/types";

export interface ITreeOption extends TreeOption {
  childrenTagNames: string[];
  children?: ITreeOption[];
}

const traverseSvg = (node: d3.Selection<d3.BaseType, any, any, any>, ids: ITreeOption[]) => {
  node.selectChildren().each(function () {
    const child = d3.select(this);
    const tagName = (child.node() as SVGElement)?.tagName;
    const id = child.attr("id");

    if (tagName === "g" && id) {
      // 创建 TreeOption 对象并处理子元素
      const item: ITreeOption = {
        label: id,
        key: id,
        children: [],
        childrenTagNames: []
      };
      child.selectChildren().each(function () {
        const name = (d3.select(this).node() as SVGElement)?.tagName;
        name !== "g" && item.childrenTagNames.push(name);
      });
      // 递归处理 g 标签的子元素
      traverseSvg(child, item.children!);
      ids.push(item);
    } else {
      // 继续遍历子元素
      traverseSvg(child, ids);
    }
  });
};

export const bindIconData = (data: IMetaItem) => {
  const svg = d3.select("#iconDataBind svg").datum(data);
  const ids: ITreeOption[] = [];
  traverseSvg(svg, ids);
  return ids;
};

export const cancelHightlight = () => {
  d3.select(".icon-select-rect").remove();
};
export const hightlightPart = (id: string) => {
  const svg = d3.select<SVGSVGElement, any>("#iconDataBind svg");
  const g = svg.select<SVGGElement>(`#${id}`);
  const rectInfo = g.node()?.getBBox();

  if (rectInfo) {
    const { x, y, width, height } = rectInfo;
    cancelHightlight();

    g.append("rect")
      .attr("class", "icon-select-rect")
      .attr("x", x)
      .attr("y", y)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#d9cb9642");
  }
};
