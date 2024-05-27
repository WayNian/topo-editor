import { useCommonStore } from "@/stores";
import type { ILink, INode } from "@/types";

/**
 * newNodes 与 nodes 对比，找出nodes中除id和nodeId字段之外不同的数据，然后返回不同的项
 * @param nodes
 * @param newNodes
 */
export const checkNodes = (
  nodes: INode[],
  newNodes: INode[]
): {
  deleteNodeList: INode[];
  mergeNodeList: INode[];
  addNodeList: INode[];
} => {
  const commonStore = useCommonStore();

  const deleteNodeList: INode[] = [];
  const mergeNodeList: INode[] = [];
  const addNodeList: INode[] = [];

  //  如果nodes为空，则直接返回nodes
  if (!nodes.length) {
    return {
      deleteNodeList,
      mergeNodeList,
      addNodeList: newNodes
    };
  }

  //   全量导入，将之前的数据删除
  if (commonStore.importType === "importAll") {
    return {
      deleteNodeList: nodes,
      mergeNodeList,
      addNodeList: newNodes
    };
  }

  //   增量导入
  //   找到已经存在的数据，对比，如果不同，则加载mergeNodeList中，否则就是新增数据
  newNodes.forEach((node) => {
    const item = nodes.find((item) => node.domId && item.domId && item.domId === node.domId);
    if (item) {
      //   item 在 nodes中，判断是否有不同的字段
      if (
        item.nodePosition !== node.nodePosition ||
        item.nodeSize !== node.nodeSize ||
        item.nodeStyles !== node.nodeStyles
      ) {
        mergeNodeList.push({
          ...node,
          nodeId: item.nodeId,
          isMerge: true
        });
      }
    } else if (!item) {
      addNodeList.push(node);
    }
  });

  return {
    deleteNodeList,
    mergeNodeList,
    addNodeList
  };
};

/**
 *  newLinks 与 links 对比，找出links中除id和linkId字段之外不同的数据，然后返回不同的项
 * @param links
 * @param newLinks
 */
export const checkLinks = (
  links: ILink[],
  newLinks: ILink[]
): {
  deleteLinkList: ILink[];
  mergeLinkList: ILink[];
  addLinkList: ILink[];
} => {
  const commonStore = useCommonStore();

  const deleteLinkList: ILink[] = [];
  const mergeLinkList: ILink[] = [];
  const addLinkList: ILink[] = [];
  if (!links.length) {
    return {
      deleteLinkList,
      mergeLinkList,
      addLinkList: newLinks
    };
  }

  //   全量导入
  //   找到已经存在的数据，对比，如果不同，则加载mergeNodeList中，否则就是新增数据
  if (commonStore.importType === "importAll") {
    return {
      deleteLinkList: links,
      mergeLinkList,
      addLinkList: newLinks
    };
  }

  // 增量导入
  newLinks.forEach((link) => {
    const item = links.find((item) => link.domId && item.domId && item.domId === link.domId);
    // 如果是增量导入，且item存在，则不做处理
    if (item) {
      link.linkId = item.linkId;
      link.mapId = item.mapId;
      //   item 在 links中，判断是否有不同的字段
      // 如果有，则说明是冲突数据
      if (item.linkPath !== link.linkPath || item.linkStyles !== link.linkStyles) {
        mergeLinkList.push({
          ...link,
          isMerge: true
        });
      }
    } else if (!item) {
      // item 不在links中
      addLinkList.push(link);
    }
  });

  return {
    deleteLinkList,
    mergeLinkList,
    addLinkList
  };
};
