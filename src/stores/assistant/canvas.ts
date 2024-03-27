import { useCanvasStore } from "../modules/canvas";

export const clearData = () => {
  const store = useCanvasStore();
  store.topoLinks = [];
  store.topoNodes = [];
};
