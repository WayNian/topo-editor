import type { INode, ILink } from "@/types";
import { useDataStore } from "@/stores";

export const initGroupData = () => {
  const dataStore = useDataStore();
  const { nodesAll, linksAll } = dataStore;

  nodesAll.forEach((node) => {
    dataStore.groups.forEach((group) => {
      if (group.dataIds?.includes(node.nodeId)) {
        if (!node.groupId) {
          node.groupId = [];
        }
        if (!group.nodes) {
          group.nodes = [];
        }

        node.groupId?.push(group.groupId);
        group.nodes.push(node);
      }
    });
  });
  linksAll.forEach((link) => {
    dataStore.groups.forEach((group) => {
      if (group.dataIds?.includes(link.linkId)) {
        if (!link.groupId) {
          link.groupId = [];
        }
        if (!group.links) {
          group.links = [];
        }
        link.groupId?.push(group.groupId);
        group.links.push(link);
      }
    });
  });

  const types = new Set<string>();
  dataStore.groups.forEach((group) => {
    group.nodes?.forEach((node) => {
      types.add(node.nodeType);
    });
    if (!group.bindData) {
      group.bindData = [];
      types.forEach((type) => {
        group.bindData?.push({
          nodeType: type,
          detailId: null,
          key: null,
          value: null
        });
      });
    }
  });
};

export const getGroupDataList = (nodes?: INode[], links?: ILink[]) => {
  const list: {
    dataId: string;
    dataType: "node" | "link";
  }[] = [];

  nodes &&
    nodes.forEach((node) => {
      list.push({
        dataId: node.nodeId,
        dataType: "node"
      });
    });

  links &&
    links.forEach((link) => {
      list.push({
        dataId: link.linkId,
        dataType: "link"
      });
    });

  return list;
};
