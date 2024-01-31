import * as d3 from "d3";

const points = [
  "dragPointLeftTop",
  "dragPointRightTop",
  "dragPointRightBottom",
  "dragPointLeftBottom",
  "dragPointRotate"
];
export const bindDragPointEvent = () => {
  points.forEach((id) => {
    d3.select(`#${id}`).on("mousedown", function () {
      console.log(this);
    });
  });
};
