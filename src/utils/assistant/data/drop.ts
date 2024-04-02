import { getTransPosition } from "../svg";

export const onDroped = (e: DragEvent) => {
  const svgEl = document.querySelector("#svgEditor");
  if (!svgEl) return;
  // svgEditor 距离左边的位置
  const offsetLeft = svgEl.getBoundingClientRect().x;
  const x1 = e.x - offsetLeft;
  const y1 = e.y;

  const [x, y] = getTransPosition(x1, y1);
  console.log("🚀 ~ onDroped ~ x, y:", x, y);
};
