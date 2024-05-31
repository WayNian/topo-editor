import * as d3 from "d3";
import type { ILink, INode } from "@/types";
import { useMapStore } from "@/stores";
import { SVGPathData } from "svg-pathdata";

type ISvgNode = d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>;
type IPoint = number[];
type IPointInfo = {
  type: string;
  data: number[];
  isRelative: boolean;
};

const nodes: any = [];
const links: any = [];

let svgRect: DOMRect | null = null;
let scaleX = 1;
let yScale = 1;

function parseMatrix(matrixString: string) {
  // 正则表达式匹配matrix函数的参数，允许使用逗号或空格作为分隔符
  // 注意：这里假设参数不会包含括号或其他在正则表达式中需要转义的特殊字符
  const regex = /matrix\((.*?)\)/;
  const match = matrixString.match(regex);

  if (match && match[1]) {
    // 将匹配到的参数字符串按逗号或空格分割
    const params = match[1]
      .trim()
      .split(/[\s,]+/)
      .map(parseFloat);

    // 返回包含所有参数的数组
    return params;
  } else {
    // 如果没有匹配到matrix函数，返回null或抛出错误
    return null; // 或者 throw new Error('Invalid matrix string');
  }
}

const formatTransform = (el: SVGAElement) => {
  const rect = el.getBoundingClientRect();
  const matrix = el.getScreenCTM();
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    matrix
  };
};

const formatStyle = (style: string, scale: number) => {
  if (!style) {
    return {
      style: {},
      styleStr: ""
    };
  }
  const res = style.split(";");
  const obj: Record<string, string | number> = {};
  res.forEach((item) => {
    const [key, value] = item.split(":");
    if (!key) return;
    obj[key] = value;
    if (key === "stroke-width") {
      const width = parseFloat(value) * scale;
      obj[key] = width + "px";
    }
    if (key === "stroke-dasharray") {
      obj[key] = value
        .split(",")
        .map((item) => parseFloat(item) * scale)
        .join(",");
    }
  });

  return {
    style: obj,
    styleStr: JSON.stringify(obj)
  };
};

const collectNodeMatrix = (svgElement: SVGAElement) => {
  // 遍历SVG中的所有<path>元素
  // 初始化一个空数组来存储当前<path>的所有父级<g>的transform值
  const transforms: number[][] = [];
  // 当前元素设置为<path>
  let currentElement: SVGAElement | null = svgElement;
  // 遍历<path>的所有父级元素，直到找到<svg>元素或没有更多父级
  while (currentElement?.parentNode && currentElement.parentNode.nodeName.toLowerCase() !== "svg") {
    // 如果父级是<g>元素，则获取其transform属性值并添加到数组中
    if (currentElement.parentNode.nodeName.toLowerCase() === "g") {
      const transform = (currentElement.parentNode as Element).getAttribute("transform");
      if (transform) {
        const matrix = parseMatrix(transform);
        matrix && transforms.push(matrix);
      }
    }
    // 将当前元素设置为父级元素，继续向上遍历
    currentElement = currentElement.parentNode as SVGAElement;
  }
  return transforms;
};

/**
 * 遍历svg，将需要的节点解析
 */
const traverse = (nodes: ISvgNode) => {
  nodes.each(function () {
    const el = d3.select(this);
    formatData(el);
    traverse(el.selectChildren());
  });
};

const transformPointByMatrix = (d: number[], matrix: number[]) => {
  const data: number[] = [];
  d.map((item, index) => {
    if (index % 2 === 0) {
      const x = item * matrix[0] + d[index + 1] * matrix[2] + matrix[4];
      data.push(x);
    } else {
      const y = d[index - 1] * matrix[1] + item * matrix[3] + matrix[5];
      data.push(y);
    }
  });

  return data;
};

const getPosionByMatrix = (point: IPoint, matrixList: number[][]) => {
  // 获取最后的计算结果
  matrixList.forEach((matrix) => {
    point = transformPointByMatrix(point, matrix);
  });

  return point;
};

const getScaleXByMatrix = (matrixList: number[][]) => {
  let scaleX = 1;
  matrixList.forEach(([a, b]) => {
    scaleX *= Math.sqrt(a * a + b * b);
  });

  return scaleX;
};

const getScaleYByMatrix = (matrixList: number[][]) => {
  let scaleY = 1;
  matrixList.forEach(([a, b, c, d]) => {
    scaleY *= Math.sqrt(c * c + d * d);
  });

  return scaleY;
};

const getRotateByMatrix = (matrixList: number[][]) => {
  let rotate = 0;
  matrixList.forEach((matrix) => {
    rotate += Math.atan2(matrix[1], matrix[0]) * (180 / Math.PI);
  });

  return +rotate.toFixed(2);
};
const transPathD = (d: string, matrixList: number[][]) => {
  let d1 = new SVGPathData(d);
  matrixList.forEach((matrix) => {
    d1 = d1.matrix(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
  });

  return d1.toAbs().encode();
};

const commonNode = {
  rotate: 0, //旋转角度
  nodeText: "", //节点文字
  fontSize: "", //节点字号
  fontColor: "", //节点字色
  textPosition: "", //文字位置
  textStyles: "", //文字样式
  bindData: {}, //关联数据
  bindMap: {}, //关联图层
  bindLink: "", //关联链路id
  bindSubLink: "", //关联链路点
  sublayerList: []
};
/**
 * 将svg节点解析成数据
 */
const formatData = (node: ISvgNode) => {
  const el = node.node() as SVGAElement;
  const tagName = el?.tagName;
  const s = node.attr("style");
  const id = el.id || el.parentElement?.id;

  //   if (!id) return;

  if (
    !["circle", "ellipse", "image", "use", "text", "rect", "polyline", "line", "path"].includes(
      tagName
    )
  )
    return;

  const matrixList = collectNodeMatrix(el);
  const _scaleX = getScaleXByMatrix(matrixList);
  const _scaleY = getScaleYByMatrix(matrixList);
  const _scale = Math.sqrt(_scaleX * _scaleY);

  const rotate = getRotateByMatrix(matrixList);

  const { style } = formatStyle(s, _scale);

  switch (tagName) {
    case "ellipse":
    case "circle":
      {
        const rect = el.getBoundingClientRect();

        const position = [rect.x * scaleX, rect.y * yScale];
        const width = rect.width * scaleX;
        const height = rect.height * yScale;
        const nodePosition = `${position[0]},${position[1]}`;

        if (nodes.some((item: any) => item.nodePosition === nodePosition)) return;

        nodes.push({
          ...commonNode,
          domId: id,
          nodeType: "circle",
          position: { x: position[0], y: position[1] },
          nodePosition,
          nodeSize: `${width}*${height}`,
          nodeStyles: JSON.stringify(style),
          style
        });
      }
      break;
    case "use":
    case "image":
      {
        if (!node.node() || (node.node() as SVGElement).parentNode?.nodeName === "defs") return;
        const rect = el.getBoundingClientRect();

        const position = [rect.x * scaleX, rect.y * yScale];
        const size = [rect.width * scaleX, rect.height * yScale];

        const nodePosition = `${position[0]},${position[1]}`;

        if (nodes.some((item: any) => item.nodePosition === nodePosition)) return;

        if (!style.fill) {
          style.fill = "#63e2b7";
        }
        nodes.push({
          ...commonNode,
          domId: id,
          nodeType: "rect",
          position: { x: position[0], y: position[1] },
          size: { width: size[0], height: size[1] },
          rotate,
          nodePosition,
          nodeSize: `${size[0]}*${size[1]}`,
          nodeStyles: JSON.stringify(style),
          style,
          nodeText: ""
        });
      }
      break;
    case "text":
      {
        const text = node.text();
        const rect = el.getBoundingClientRect();

        const position = [rect.x * scaleX, rect.y * yScale];
        const size = [rect.width * scaleX, rect.height * yScale];

        const fontSize = parseFloat(style["font-size"] + "" || node.attr("font-size")) * _scale;
        if (fontSize) {
          style["font-size"] = fontSize + "px";
        }

        const nodePosition = `${position[0]},${position[1]}`;
        if (nodes.some((item: any) => item.nodePosition === nodePosition)) return;

        nodes.push({
          ...commonNode,
          domId: id,
          nodeType: "text",
          position: { x: position[0], y: position[1] },
          size: { width: size[0], height: size[1] },
          rotate,
          nodePosition,
          nodeSize: `${size[0]}*${size[1]}`,
          nodeStyles: JSON.stringify(style),
          style,
          nodeText: text
        });
      }
      break;

    case "rect":
      {
        const rect = el.getBoundingClientRect();

        const position = [rect.x * scaleX, rect.y * yScale];
        const size = [rect.width * scaleX, rect.height * yScale];

        const nodePosition = `${position[0]},${position[1]}`;

        if (nodes.some((item: any) => item.nodePosition === nodePosition)) return;

        nodes.push({
          ...commonNode,
          domId: id,
          nodeType: "rect",
          position: { x: position[0], y: position[1] },
          size: { width: size[0], height: size[1] },
          rotate,
          nodePosition,
          nodeSize: `${size[0]}*${size[1]}`,
          nodeStyles: JSON.stringify(style),
          style
        });
      }
      break;
    case "line":
      {
        const x1 = +node.attr("x1");
        const y1 = +node.attr("y1");
        const x2 = +node.attr("x2");
        const y2 = +node.attr("y2");
        const d = `M${x1 * scaleX} ${y1 * yScale} L${x2 * scaleX} ${y2 * yScale}`;
        if (links.some((item: any) => item.linkWidth === d)) return;
        links.push({
          domId: id,
          linkType: "link",
          linkPath: d,
          linkWidth: parseFloat(style["stroke-width"] + "" || node.attr("stroke-width")) || 1,
          linkStyles: JSON.stringify(style),
          style
        });
      }
      break;
    case "polyline":
      {
        const points = node
          .attr("points")
          .split(" ")
          .filter((item) => !!item)
          .map((item) => item.split(",").map(parseFloat));
        // 创建D3.js line生成器，指定x和y坐标提取函数（这里直接使用索引）
        const lineGenerator = d3
          .line()
          .x((d) => d[0])
          .y((d) => d[1]);

        // 使用lineGenerator将点坐标数组转换为路径数据字符串
        const d = lineGenerator(points as [number, number][]);

        const style = {
          fill: "none",
          stroke: "#23A815",
          "stroke-width": 0.8,
          "stroke-miterlimit": 10
        };
        const link = {
          domId: id,
          linkType: "link",
          linkPath: d,
          linkWidth: parseFloat(style["stroke-width"] + "" || node.attr("stroke-width")) || 1,
          linkStyles: JSON.stringify(style),
          style
        };

        if (links.some((item: any) => item.linkWidth === d)) return;
        links.push(link);
      }
      break;
    case "path":
      {
        const dStr = node.attr("d");
        if (!dStr) return;
        const d = transPathD(dStr, matrixList);
        const link = {
          domId: id,
          linkType: "link",
          linkPath: d,
          linkWidth: parseFloat(style["stroke-width"] + ""),
          linkStyles: JSON.stringify(style),
          style
        };

        console.log("线宽", parseFloat(style["stroke-width"] + ""));

        if (links.some((item: any) => item.linkPath === d)) return;
        links.push(link);
      }
      break;
    default:
      break;
  }
};
/**
 * 将svg原始文件转换为d3对象
 */
export const parseSvg = (file: File) => {
  if (!file) return;
  const mapStore = useMapStore();
  const reader = new FileReader(); // 创建 FileReader 对象
  nodes.length = 0;
  links.length = 0;
  return new Promise((resolve) => {
    reader.onload = function (event: ProgressEvent<FileReader>) {
      if (!event.target) return;
      const data = event.target.result; // 获取文件内容
      const con = d3
        .select("body")
        .append("div")
        .style("position", "fiexed")
        .style("width", "100%")
        .style("height", "100%")
        .html(data as string);
      const svg = con.select("svg");
      let width = +svg.attr("width");
      let height = +svg.attr("height");

      const viewBox = svg.attr("viewBox");

      if (viewBox) {
        const viewBoxList = viewBox.split(" ");
        width = +viewBoxList[2];
        height = +viewBoxList[3];
      }

      mapStore.setMapSize(width, height);
      //   获取svg的getBoundingClientRect和实际的大小
      //  再获取子节点getBoundingClientRect
      // 按比例获取位置
      svgRect = (svg.node() as SVGAElement)?.getBoundingClientRect();
      if (svgRect) {
        scaleX = width / svgRect.width;
        yScale = height / svgRect.height;
      }

      const defs = svg.select("defs").empty() ? "" : svg.select("defs").html();

      traverse(svg.selectChildren());

      con.remove();

      resolve({
        nodes: structuredClone<INode[]>(nodes),
        links: structuredClone<ILink[]>(links),
        name: file.name,
        defs
      });
    };
    reader.readAsText(file); // 以文本格式读取文件内容
  });
};
