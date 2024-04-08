import { useCommonStore, useDataStore } from "@/stores";
import type { ILink, INode, IOriginalLink, IOriginalNode } from "@/types";
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

export const setNodesSelected = (node?: INode) => {
  const dataStore = useDataStore();
  const commonStore = useCommonStore();

  if (!node) {
    dataStore.currentNode = null;
    dataStore.nodes.forEach((item) => {
      item.selected = false;
    });
    return;
  }

  if (commonStore.isShiftDown) {
    node.selected = !node.selected;
    dataStore.currentNode = null;
  } else {
    dataStore.nodes.forEach((item) => {
      item.selected = false;
    });
    node.selected = true;
    dataStore.currentNode = node;
  }
};

export const setLinksSelected = (link?: ILink) => {
  const dataStore = useDataStore();
  const commonStore = useCommonStore();
  if (!link) {
    dataStore.currentLink = null;
    dataStore.links.forEach((item) => {
      item.selected = false;
    });
    return;
  }

  if (commonStore.isShiftDown) {
    link.selected = !link.selected;
    dataStore.currentNode = null;
  } else {
    dataStore.nodes.forEach((item) => {
      item.selected = false;
    });
    link.selected = true;
    dataStore.currentLink = link;
  }
};

export const clearNodesLinksSelected = () => {
  setNodesSelected();
  setLinksSelected();
};
