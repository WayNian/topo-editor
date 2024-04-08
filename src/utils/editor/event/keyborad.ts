import * as d3 from "d3";
import { useCommonStore } from "@/stores";
import { hideSelectionRect } from "../draw";

const commonStore = useCommonStore();
export const bindWindowEvent = () => {
  // 是否按住空格
  d3.select("body").on("keydown", function (e) {
    switch (e.code) {
      case "ShiftLeft":
        commonStore.isShiftDown = true;
        break;
      case "Space":
        commonStore.isSpaceDown = true;
        hideSelectionRect();
        break;
    }
  });
  d3.select("body").on("keyup", function (e) {
    switch (e.code) {
      case "ShiftLeft":
        commonStore.isShiftDown = false;
        break;
      case "Space":
        commonStore.isSpaceDown = false;
        break;
    }
  });
};

export const unbindWindowEvent = () => {
  d3.select("body").on("keydown", null);
  d3.select("body").on("keyup", null);
};
