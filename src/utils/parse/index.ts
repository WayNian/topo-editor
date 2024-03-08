import type { IMatrix } from "@/types";
import * as d3 from "d3";
import { parseSvgPath } from "../tools/data";

type ISvg = d3.Selection<SVGSVGElement, unknown, d3.BaseType, any>;
type ISvgNode = d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>;
type ISvgLink<T extends d3.BaseType> = d3.Selection<T, unknown, d3.BaseType, unknown>;
type IPoint = {
  type: string;
  x: number;
  y: number;
};

const nodes: any = [];
const links: any = [];
let svgSize = {
  width: 0,
  height: 0
};

function parseMatrix(matrixString: string) {
  // 正则表达式匹配matrix函数的参数
  const regex = /matrix\(([^)]*)\)/;
  const match = matrixString.match(regex);

  if (match && match[1]) {
    // 将匹配到的参数字符串按逗号分割
    const params = match[1].split(",").map(parseFloat);

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

const formatStyle = (style: string) => {
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
    // if (key === "stroke-width") {
    //   obj[key] = parseInt(value) * scale + "px";
    // }
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
        matrix && transforms.unshift(matrix);
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

const transformPointByMatrix = (point: IPoint, matrix: number[]) => {
  const x = point.x * matrix[0] + point.y * matrix[2] + matrix[4];
  const y = point.x * matrix[1] + point.y * matrix[3] + matrix[5];
  return {
    type: point.type,
    x,
    y
  };
};

const getPathByMatrix = (points: IPoint[], matrixList: number[][]) => {
  const res: IPoint[] = [];
  points.forEach((point) => {
    matrixList.forEach((matrix) => {
      transformPointByMatrix(point, matrix);
    });
    res.push(point);
  });

  return res;
};
// 解析路径为数组 js实现path路径解析为数组
const parsePathD = (d: string) => {
  const commands = d.split(/(?=[MLHVCSQTAZ])/); // 分割命令
  const pathSegments: IPoint[] = [];

  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    const cmdType = command[0]; // 命令类型
    const args = command.slice(1).split(",").map(parseFloat); // 参数

    // 根据命令类型创建对应的对象
    let segment;
    switch (cmdType) {
      case "M": // MoveTo
      case "L": // LineTo
        segment = { type: cmdType, x: args[0], y: args[1] };
        break;
      // 你可以在这里添加对其他命令的处理，如C（CurveTo）、Q（QuadraticBezierCurveTo）等
      default:
        // 对于不支持的命令，可以选择忽略或抛出错误
        console.warn(`Unsupported command: ${cmdType}`);
        continue;
    }

    pathSegments.push(segment);
  }

  return pathSegments;
};

const getPathsAndD = (points: IPoint[]) => {
  // 将paths转换为path的d
  const d = points.reduce((acc, cur, index) => {
    if (index === 0) {
      acc += `${cur.type}${cur.x} ${cur.y}`;
    } else {
      acc += `${cur.type}${cur.x} ${cur.y}`;
    }
    return acc;
  }, "");

  return d;
};

/**
 * 将svg节点解析成数据
 */
const formatData = (node: ISvgNode) => {
  const el = node.node() as SVGAElement;
  const tagName = el?.tagName;
  const s = node.attr("style");
  const id = node.attr("id");

  const { x, y, width, height } = formatTransform(el);
  const { style } = formatStyle(s);

  switch (tagName) {
    case "circle":
    case "ellipse":
    case "image":
      {
        nodes.push({
          id,
          type: "circle",
          position: { x, y },
          size: { width, height },
          style
        });
      }
      break;
    case "text":
      {
        const text = node.text();
        nodes.push({
          id,
          type: "text",
          position: { x, y },
          text,
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
        // const d = `M${x1 * xScale} ${y1 * yScale} L${x2 * xScale} ${y2 * yScale}`;
        // links.push({
        //   id,
        //   type: "path",
        //   linkPath: `M${x1 * xScale} ${y1 * yScale} L${x2 * xScale} ${y2 * yScale}`,
        //   linkStyles
        // });
      }
      break;
    case "path":
      {
        const dStr = node.attr("d");
        const points = parsePathD(dStr);
        const matrixList = collectNodeMatrix(el);
        const pointsByMatrix = getPathByMatrix(points, matrixList);
        const d = getPathsAndD(pointsByMatrix);
        console.log("🚀 ~ formatData ~ d:", pointsByMatrix, d);

        links.push({
          id,
          type: "path",
          linkPath: d,
          pathArray: pointsByMatrix,
          style
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
export const parseSvg = (file: File) => {
  if (!file) return;
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
        // .style("display", "none")
        .html(data as string);
      const svg = con.select("svg");
      const viewBoxList = svg.attr("viewBox").split(" ");
      const width = +viewBoxList[2];
      const height = +viewBoxList[3];

      svgSize = {
        width,
        height
      };
      traverse(svg.selectChildren());
      resolve({ svgSize, nodes, links });
    };
    reader.readAsText(file); // 以文本格式读取文件内容
  });
};
