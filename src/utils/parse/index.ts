import * as d3 from "d3";

type ISvg = d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

const nodes = [];
const links = [];
/**
 * 遍历svg，将需要的节点解析
 */
const traverseSvg = (svg: ISvg) => {};
/**
 * 将svg节点解析成数据
 */
const formatData = () => {};
/**
 * 将svg原始文件转换为d3对象
 */
export const parseSvg = (content: string) => {
  const con = d3.select("body").append("div").html(content);
  const svg = con.select("svg") as ISvg;
  traverseSvg(svg);
};
