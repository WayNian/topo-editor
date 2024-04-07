import { useDataStore } from "@/stores";
import type { IOriginalLink, IOriginalNode } from "@/types";
import { addLink, addNode } from "@/utils/http/apis/";
import { formatNode } from "./format";
import { drawNodes } from "@/utils/editor/draw";

export const clearData = () => {
  const dataStore = useDataStore();
  dataStore.nodes = [];
  dataStore.links = [];
};

export const addNodeFunc = async (node: IOriginalNode) => {
  const dataStore = useDataStore();

  const id = await addNode(node);
  const newNode = formatNode({
    nodeId: id,
    ...node
  });

  dataStore.nodes.push(newNode);
  window.$message.success("添加成功");

  drawNodes();
};

export const addLinkFunc = async (link: IOriginalLink) => {
  await addLink(link);
  window.$message.success("添加成功");
};
