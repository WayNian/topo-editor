import type { IMatrix } from "@/types";
import * as d3 from "d3";
import { parseSvgPath } from "../tools/data";

type ISvg = d3.Selection<SVGSVGElement, unknown, d3.BaseType, any>;
type ISvgNode = d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>;
type ISvgLink<T extends d3.BaseType> = d3.Selection<T, unknown, d3.BaseType, unknown>;

const nodes: any = [];
const links: any = [];
let svgSize = {
  width: 0,
  height: 0
};

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
      obj[key] = parseInt(value) * scale + "px";
    }
  });

  return {
    style: obj,
    styleStr: JSON.stringify(obj)
  };
};

/**
 * 遍历svg，将需要的节点解析
 */
const traverse = (nodes: ISvgNode) => {
  // const m = d3.zoomTransform(nodes.node());
  nodes.each(function () {
    formatData(d3.select(this));
    traverse(d3.select(this).selectChildren());
  });
};
const transformPointByMatrix = (point: { x: number; y: number }, matrix: IMatrix) => {
  const x = point.x * matrix.a + point.y * matrix.c + matrix.e;
  const y = point.x * matrix.b + point.y * matrix.d + matrix.f;
  return [x, y];
};

// 解析路径为数组 js实现path路径解析为数组
const parsePathD = (d: string) => {
  const commands = d.split(/(?=[MLHVCSQTAZ])/); // 分割命令
  const pathSegments = [];

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

const getPathsAndD = (str: string, matrix: IMatrix) => {
  const paths = parsePathD(str).map((ele) => {
    return transformPointByMatrix(
      {
        x: ele.x,
        y: ele.y
      },
      matrix
    );
  });

  // 将paths转换为path的d
  const d = paths.reduce((acc, cur, index) => {
    if (index === 0) {
      acc += `M${cur[0]} ${cur[1]}`;
    } else {
      acc += `L${cur[0]} ${cur[1]}`;
    }
    return acc;
  }, "");

  return { paths, d };
};

/**
 * 将svg节点解析成数据
 */
const formatData = (node: ISvgNode) => {
  const el = node.node() as SVGAElement;
  const tagName = el?.tagName;
  const s = node.attr("style");
  const id = node.attr("id");

  const { x, y, width, height, matrix } = formatTransform(el);
  const { style } = formatStyle(s, +Math.abs(matrix?.a || 1).toFixed(4));

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
        // const { d, paths } = getPathsAndD(dStr, matrix as IMatrix);

        links.push({
          id,
          type: "path",
          linkPath: dStr,
          //   pathArray: paths,
          style
          //   linkStyles
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

      console.log("🚀 ~ returnnewPromise ~ width:", width, height);

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
