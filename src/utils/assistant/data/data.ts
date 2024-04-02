import { useDataStore } from "@/stores";

export const clearData = () => {
  const dataStore = useDataStore();
  dataStore.nodes = [];
  dataStore.links = [];
};
