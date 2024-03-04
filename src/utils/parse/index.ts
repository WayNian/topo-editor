import * as d3 from "d3";

type ISvg = d3.Selection<SVGSVGElement, unknown, d3.BaseType, any>;
type ISvgNode = d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>;
type ISvgLink<T extends d3.BaseType> = d3.Selection<T, unknown, d3.BaseType, unknown>;

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

  switch (tagName) {
    case "circle":
      {
        const cx = +node.attr("cx");
        const cy = +node.attr("cy");
        const r = +node.attr("r");
        nodes.push({
          id,
          type: "circle",
          position: { x: cx, y: cy },
          size: { width: r * 2, height: r * 2 },
          style: formatStyle(style),
          transform: formatTransform(transform)
        });
      }
      break;
    case "ellipse":
      {
        const cx = +node.attr("cx");
        const cy = +node.attr("cy");
        const rx = +node.attr("rx");
        const ry = +node.attr("ry");
        nodes.push({
          id,
          type: "ellipse",
          position: { x: cx, y: cy },
          size: { width: rx * 2, height: ry * 2 },
          style: formatStyle(style),
          transform: formatTransform(transform)
        });
      }
      break;
    case "text":
      {
        const x = +node.attr("x");
        const y = +node.attr("y");
        const text = node.text();
        nodes.push({
          id,
          type: "text",
          position: { x, y },
          text,
          style: formatStyle(style),
          transform: formatTransform(transform)
        });
      }
      break;
    case "image":
      {
        const x = +node.attr("x");
        const y = +node.attr("y");
        const width = +node.attr("width");
        const height = +node.attr("height");
        const href = node.attr("href");
        nodes.push({
          id,
          type: "image",
          position: { x, y },
          size: { width, height },
          href,
          style: formatStyle(style),
          transform: formatTransform(transform)
        });
      }
      break;
    case "line":
      {
        const x1 = +node.attr("x1");
        const y1 = +node.attr("y1");
        const x2 = +node.attr("x2");
        const y2 = +node.attr("y2");
        links.push({
          id,
          type: "line",
          x1,
          y1,
          x2,
          y2,
          style: formatStyle(style),
          transform: formatTransform(transform)
        });
      }
      break;
    case "path":
      {
        const d = node.attr("d");
        links.push({
          id,
          type: "path",
          d,
          style: formatStyle(style),
          transform: formatTransform(transform)
        });
      }
      break;
    default:
      break;
  }
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
  console.log(nodes, links);
};
