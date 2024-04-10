import { useCommonStore, useDataStore } from "@/stores";
import type { ILink, INode, IOriginalLink, IOriginalNode, ISublayer } from "@/types";
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

export const clearNodesLinksSubler = () => {
  const dataStore = useDataStore();
  const nodeIds = dataStore.nodesSelected.map((node) => {
    node.selected = false;
    node.sublayerList = [];

    return node.nodeId;
  });
  const linkIds = dataStore.linksSelected.map((link) => {
    link.selected = false;
    link.sublayerList = [];

    return link.linkId;
  });

  return {
    nodeIds,
    linkIds
  };
};

// 对应更新子图层数据
export const updateNodesLinksSublayer = (sublayer: ISublayer) => {
  const dataStore = useDataStore();

  if (sublayer.sublayerName === "other") {
    clearNodesLinksSubler();
    return;
  }

  dataStore.nodesSelected.forEach((node) => {
    node.selected = false;
    const sublayerList = node.sublayerList || [];
    const index = sublayerList.findIndex((item) => item.sublayerId === sublayer.sublayerId);
    if (index !== -1) {
      sublayerList.splice(index, 1);
    } else {
      sublayerList.push({
        sublayerId: sublayer.sublayerId,
        objType: 1,
        objId: node.nodeId
      });
    }
    node.sublayerList = sublayerList;
  });

  dataStore.linksSelected.forEach((link) => {
    link.selected = false;
    const sublayerList = link.sublayerList || [];
    const index = sublayerList.findIndex((item) => item.sublayerId === sublayer.sublayerId);
    if (index !== -1) {
      sublayerList.splice(index, 1);
    } else {
      sublayerList.push({
        sublayerId: sublayer.sublayerId,
        objType: 2,
        objId: link.linkId
      });
    }
    link.sublayerList = sublayerList;
  });
};
