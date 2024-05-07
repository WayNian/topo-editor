import { useDataStore } from "@/stores";
import * as d3 from "d3";
import { drawNodes } from "../draw";
import { updateNode } from "@/utils/http/apis";

const points = [
  "dragPointLeftTop",
  "dragPointRightTop",
  "dragPointRightBottom",
  "dragPointLeftBottom",
  "dragPointRotate"
];

let isDragging = false;

const dragStart = (e: any) => {
  isDragging = true;
};

const dragging = (e: any, el: SVGElement) => {
  const dataStore = useDataStore();
  if (!isDragging || !dataStore.currentNode) return;
  const id = el.id;
  const tx = e.dx;
  const ty = e.dy;
  const { width, height } = dataStore.currentNode;

  if (id === "dragPointLeftTop") {
    dataStore.currentNode.x += tx;
    dataStore.currentNode.y += ty;
    dataStore.currentNode.width = Math.abs(width - tx);
    dataStore.currentNode.height = Math.abs(height - ty);
  } else if (id === "dragPointRightTop") {
    dataStore.currentNode.y += ty;
    dataStore.currentNode.width = Math.abs(width + tx);
    dataStore.currentNode.height = Math.abs(height - ty);
  } else if (id === "dragPointRightBottom") {
    dataStore.currentNode.width = Math.abs(width + tx);
    dataStore.currentNode.height = Math.abs(height + ty);
  } else if (id === "dragPointLeftBottom") {
    dataStore.currentNode.x += tx;
    dataStore.currentNode.width = Math.abs(width - tx);
    dataStore.currentNode.height = Math.abs(height + ty);
  }

  drawNodes();
};

const dragEnd = () => {
  const dataStore = useDataStore();
  if (!dataStore.currentNode) return;
  isDragging = false;
  updateNode([dataStore.currentNode]);
};

export const bindDragPointEvent = () => {
  points.forEach((id) => {
    const drag = d3
      .drag<SVGElement, any>()
      .on("start", dragStart)
      .on("drag", function (e) {
        dragging(e, this);
      })
      .on("end", dragEnd);

    d3.select<SVGElement, any>(`#${id}`).call(drag);
  });
};
