import { useDataStore } from "../modules/data";

export const clearData = () => {
  const store = useDataStore();
  store.nodes = [];
  store.links = [];
};
