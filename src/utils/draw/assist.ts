import { useTopo } from "@/stores/topo";
import { getScreenSize } from "../tools/common";
const store = useTopo();

export const setInitTransform = () => {
  const { width, height } = getScreenSize();
  const mapWidth = store.mapSize.width;
  const mapHeight = store.mapSize.height;

  const aspectRatio = width / height;
  const scaleFactor = aspectRatio > 1 ? (width - 50) / mapWidth : (height - 100) / mapHeight;

  const scaledWidth = mapWidth * scaleFactor;
  const scaledHeight = mapHeight * scaleFactor;

  const x = (width - scaledWidth) / 2;
  const y = (height - scaledHeight) / 2;

  return { x, y, k: scaleFactor };
};
