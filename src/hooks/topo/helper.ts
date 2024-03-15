import { useCommonStore } from "@/stores/common";
import type { ILink, INode } from "@/types";

const common = useCommonStore();

/**
 * nodes 与 topoNodes 对比，找出nodes中除id和nodeId字段之外不同的数据，然后返回不同的项
 * @param topoNodes
 * @param nodes
 */
export const checkNodes = (topoNodes: INode[], nodes: INode[]) => {
  const deleteNodeList: INode[] = [];
  const mergeNodeList: INode[] = [];
  const addNodeList: INode[] = [];

  if (!topoNodes.length) {
    //  如果topoNodes为空，则直接返回nodes
    return {
      deleteNodeList,
      mergeNodeList,
      addNodeList: nodes
    };
  }

  nodes.forEach((node) => {
    const item = topoNodes.find((item) => item.id === node.id && item.nodeId === node.nodeId);
    if (item && common.importType === "importAddition") {
      //   item 在 topoNodes中，判断是否有不同的字段
      if (JSON.stringify(item) !== JSON.stringify(node)) {
        mergeNodeList.push({
          ...node,
          isMerge: true
        });
      }
    } else if (!item) {
      addNodeList.push(node);
    }
  });

  if (common.importType === "importAll") {
    // 获取要删除的数据
    topoNodes.forEach((node) => {
      const item = nodes.find((item) => item.id === node.id && item.nodeId === node.nodeId);
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
 *  links 与 topoLinks 对比，找出links中除id和linkId字段之外不同的数据，然后返回不同的项
 * @param topoLinks
 * @param links
 */
export const checkLinks = (topoLinks: ILink[], links: ILink[]) => {
  const deleteLinkList: ILink[] = [];
  const mergeLinkList: ILink[] = [];
  const addLinkList: ILink[] = [];
  if (!topoLinks.length) {
    return {
      deleteLinkList,
      mergeLinkList,
      addLinkList: links
    };
  }

  // 全量导入
  links.forEach((link) => {
    const item = topoLinks.find((item) => {
      return item.linkId === link.linkId;
    });
    // 如果是增量导入，且item存在，则不做处理
    if (item && common.importType === "importAll") {
      //   item 在 topoLinks中，判断是否有不同的字段
      // 如果有，则说明是冲突数据
      if (JSON.stringify(item) !== JSON.stringify(link)) {
        mergeLinkList.push({
          ...link,
          isMerge: true
        });
      }
    } else if (!item) {
      // item 不在topoLinks中
      addLinkList.push(link);
    }
  });

  if (common.importType === "importAll") {
    // 获取要删除的数据
    topoLinks.forEach((link) => {
      const item = links.find((item) => {
        return item.linkId === link.linkId;
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
