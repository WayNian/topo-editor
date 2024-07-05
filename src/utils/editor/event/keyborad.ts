import * as d3 from "d3";

import { useCommonStore } from "@/stores";
import emitter from "@/utils/mitt";

import { hideSelectionRect } from "../draw";

export const bindWindowEvent = () => {
  const commonStore = useCommonStore();

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
      case "Delete":
        emitter.emit("on:delete");
        break;
      // ctrl + a
      case "KeyA":
        e.preventDefault();
        if (e.ctrlKey) {
          commonStore.isCtrlADown = true;
        }
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
      case "KeyA":
        commonStore.isCtrlADown = false;
        break;
    }
  });
};

export const unbindWindowEvent = () => {
  d3.select("body").on("keydown", null);
  d3.select("body").on("keyup", null);
};
