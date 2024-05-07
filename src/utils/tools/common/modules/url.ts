import type { INode } from "@/types";

export const getNodeImage = (node: INode) => {
  const urlPrefix = "http://172.19.139.246:6818/";
  const url = urlPrefix + node.style.image;
  return node.style.image ? url : node.style.fill;
};
