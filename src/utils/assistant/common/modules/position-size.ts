import { useSvgStore } from "@/stores";
import * as d3 from "d3";

// 获取当前g内部的实际坐标
export const getTransPosition = (x: number, y: number) => {
  const svgStore = useSvgStore();

  return d3.zoomIdentity
    .translate(svgStore.zoomTrans.x, svgStore.zoomTrans.y)
    .scale(svgStore.zoomTrans.k)
    .invert([x, y]);
};

export const getScreenSize = () => {
  const width = window.screen.width;
  const height = window.screen.height;
  return { width, height };
};

export const getSvgSize = () => {
  const body = document.querySelector(".editor-layout");

  const width = body?.clientWidth || 0;
  const height = body?.clientHeight || 0;
  return { width, height };
};

// 12,32
export const getPosition = (val: string) => {
  const [x, y] = val.split(",").map((item) => Number(item));
  return { x, y };
};

// 1920*1080
export const getSize = (val: string) => {
  const [width, height] = val.split("*").map((item) => Number(item));
  return { width, height };
};
