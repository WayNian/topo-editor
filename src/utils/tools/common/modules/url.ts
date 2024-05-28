import type { INode } from "@/types";

export const getImageUrl = () => {
  const { origin } = window.location;
  return origin.includes("localhost") ? "http://172.19.139.253:6818" : origin;
};
export const getNodeImage = (node: INode) => {
  const urlPrefix = getImageUrl();
  const url = urlPrefix + node.style.image;
  return node.style.image ? url : node.style.fill;
};
