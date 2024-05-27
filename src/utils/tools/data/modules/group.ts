import { useDataStore } from "@/stores";

export const updataDataGroupId = (groupId: string) => {
  const dataStore = useDataStore();
  const { nodesSelected, linksSelected } = dataStore;
  nodesSelected.forEach((node) => {
    node.groupId = groupId;
  });
  linksSelected.forEach((link) => {
    link.groupId = groupId;
  });
};
