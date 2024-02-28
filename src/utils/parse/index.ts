import * as d3 from "d3";

type ISvg = d3.Selection<SVGSVGElement, unknown, d3.BaseType, any>;
type ISvgNode = d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>;

const nodes = [];
const links = [];

const formatTransform = (transform: string) => {
  if (!transform) return;
  const reg = /translate\((\d+),(\d+)\)/;
  const res = transform.match(reg);
  if (!res) return;
  return {
    x: +res[1],
    y: +res[2]
  };
};

const formatStyle = (style: string) => {
  if (!style) return;
  const res = style.split(";");
  const obj: Record<string, string | number> = {};
  res.forEach((item) => {
    const [key, value] = item.split(":");
    obj[key] = value;
  });
  return obj;
};

/**
 * 遍历svg，将需要的节点解析
 */
const traverse = (nodes: ISvgNode) => {
  nodes.each(function () {
    formatData(d3.select(this));
    traverse(d3.select(this).selectChildren());
  });
};
/**
 * 将svg节点解析成数据
 */
const formatData = (node: ISvgNode) => {
  const tagName = (node.node() as HTMLElement)?.tagName;
  const style = node.attr("style");
  const transform = node.attr("transform");
  const id = node.attr("id");
  console.log("style", style, "transform", transform, "id", id, "tagName", tagName);
};
/**
 * 将svg原始文件转换为d3对象
 */
export const parseSvg = (content: string) => {
  const con = d3
    .select("body")
    .append("div")
    .style("width", "800px")
    .style("height", "500px")
    .html(content);
  const svg = con.select("svg");

  traverse(svg.selectChildren());
};
