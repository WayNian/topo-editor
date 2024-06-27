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
};
