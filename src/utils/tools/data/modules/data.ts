import { useCommonStore, useDataStore, useMapStore } from "@/stores";
import type { ILink, INode, ISublayer } from "@/types";
import { drawNodesLinks } from "@/utils/editor/draw";
import { deleteLinks, deleteNodes } from "@/utils/http/apis";

/**
 * 重新获取节点
 */
export const renewNodes = () => {
  const mapStore = useMapStore();
  const dataStore = useDataStore();
  const sublayerIds = mapStore.sublayerIds;
  dataStore.nodes = dataStore.nodesAll.filter((node) => {
    const sublayerList = node.sublayerList || [];
    if (!sublayerList.length) {
      return sublayerIds.includes("other");
    } else {
      return sublayerList.some((sublayer) => sublayerIds.includes(sublayer.sublayerId));
    }
  });
};

/**
 * 重新获取连线
 */
export const renewLinks = () => {
  const mapStore = useMapStore();
  const dataStore = useDataStore();
  const sublayerIds = mapStore.sublayerIds;
  dataStore.links = dataStore.linksAll.filter((link) => {
    const sublayerList = link.sublayerList || [];
    if (!sublayerList.length) {
      return sublayerIds.includes("other");
    } else {
      return sublayerList.some((sublayer) => sublayerIds.includes(sublayer.sublayerId));
    }
  });
};

export const renewNodesLinks = () => {
  renewNodes();
  renewLinks();
};

// 只渲染需要merge的节点
export const renewMergeNodesLinks = () => {
  const mapStore = useMapStore();
  const dataStore = useDataStore();

  dataStore.nodes = dataStore.nodesAll.filter((node) => {
    return mapStore.mergeNodeList.some((mergeNode) => mergeNode.domId === node.domId);
  });
  dataStore.links = dataStore.linksAll.filter((link) => {
    return mapStore.mergeLinkList.some((mergeLink) => mergeLink.domId === link.domId);
  });
};

export const clearData = () => {
  const dataStore = useDataStore();
  dataStore.nodes = [];
  dataStore.links = [];
  dataStore.currentLink = null;
  dataStore.currentNode = null;
};

/**
 *  设置节点选择状态
 * @param node
 * @returns
 */
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
    setLinksSelected();
    node.selected = true;
    dataStore.currentNode = node;
  }
};

/**
 * 设置节点选择状态
 * @param link
 * @returns
 */
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
    dataStore.currentLink = null;
  } else {
    dataStore.links.forEach((item) => {
      item.selected = false;
    });
    setNodesSelected();
    link.selected = true;
    dataStore.currentLink = link;
  }
};

/**
 * 清除已选择的节点和连线
 */
export const clearNodesLinksSelected = () => {
  setNodesSelected();
  setLinksSelected();
};

/**
 * 将已选择的节点连线从子图层移除
 * @returns
 */
export const clearNodesLinksSublayer = () => {
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
    clearNodesLinksSublayer();
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

export const deleteNodesLinks = async () => {
  const dataStore = useDataStore();
  const mapStore = useMapStore();
  const commonStore = useCommonStore();

  if (!mapStore.mapInfo) {
    window.$message.warning("请先选择画布");
    return;
  }
  commonStore.isLoading = true;
  const nodeIdList = dataStore.nodesSelected.map((node) => node.nodeId);
  const linkIdList = dataStore.linksSelected.map((link) => link.linkId);

  const { mapId } = mapStore.mapInfo;
  nodeIdList.length &&
    (await deleteNodes({
      nodeIdList,
      mapId
    }));

  linkIdList.length &&
    (await deleteLinks({
      linkIdList,
      mapId
    }));

  dataStore.nodes = dataStore.nodes.filter((node) => !nodeIdList.includes(node.nodeId));
  dataStore.links = dataStore.links.filter((link) => !linkIdList.includes(link.linkId));
  window.$message.success("删除成功");
  commonStore.isLoading = false;

  drawNodesLinks();
  mapStore.getSublayers(mapId);
};
