import { useCommonStore } from "@/stores/modules/common";
import type { ILink, INode } from "@/types";

const common = useCommonStore();

/**
 * newNodes 与 nodes 对比，找出nodes中除id和nodeId字段之外不同的数据，然后返回不同的项
 * @param nodes
 * @param newNodes
 */
export const checkNodes = (nodes: INode[], newNodes: INode[]) => {
  const deleteNodeList: INode[] = [];
  const mergeNodeList: INode[] = [];
  const addNodeList: INode[] = [];

  if (!nodes.length) {
    //  如果nodes为空，则直接返回nodes
    return {
      deleteNodeList,
      mergeNodeList,
      addNodeList: newNodes
    };
  }

  newNodes.forEach((node) => {
    const item = nodes.find((item) => item.domId === node.domId);
    if (item && common.importType === "importAddition") {
      //   item 在 nodes中，判断是否有不同的字段
      if (JSON.stringify(item) !== JSON.stringify(node)) {
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

  if (common.importType === "importAll") {
    // 获取要删除的数据
    nodes.forEach((node) => {
      const item = newNodes.find((item) => item.domId === node.domId);
      if (!item) {
        deleteNodeList.push(node);
      }
    });
  }

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
export const checkLinks = (links: ILink[], newLinks: ILink[]) => {
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

  // 全量导入
  newLinks.forEach((link) => {
    const item = links.find((item) => {
      return item.domId === link.domId;
    });
    // 如果是增量导入，且item存在，则不做处理
    if (item && common.importType === "importAll") {
      link.linkId = item.linkId;
      link.mapId = item.mapId;
      //   item 在 links中，判断是否有不同的字段
      // 如果有，则说明是冲突数据
      if (JSON.stringify(item) !== JSON.stringify(link)) {
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

  if (common.importType === "importAll") {
    // 获取要删除的数据
    links.forEach((link) => {
      const item = newLinks.find((item) => {
        return item.domId === link.domId;
      });

      if (!item) {
        deleteLinkList.push(link);
      }
    });
  }

  return {
    deleteLinkList,
    mergeLinkList,
    addLinkList
  };
};
