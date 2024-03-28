import * as d3 from "d3";
import { resetSvg } from ".";
import { useCommonStore } from "@/stores";

const commonStore = useCommonStore();
export const bindWindowEvent = () => {
  // 是否按住空格
  d3.select("body").on("keydown", function (e) {
    if (e.code === "Space") {
      commonStore.isSpaceDown = true;
    }
  });
  d3.select("body").on("keyup", function (e) {
    if (e.code === "Space") {
      commonStore.isSpaceDown = false;
      resetSvg();
    }
  });
};

export const unbindWindowEvent = () => {
  d3.select("body").on("keydown", null);
  d3.select("body").on("keyup", null);
};
