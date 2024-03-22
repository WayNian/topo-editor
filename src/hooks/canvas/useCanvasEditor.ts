import { useCanvasStore } from "@/stores/modules/canvas";
import type { IMapSource } from "@/types";
import { draw } from "@/utils/canvas/draw/svg";
import emitter from "@/utils/mitt";
import { onMounted } from "vue";
import { importSvg, selectMap } from "./assistant";
import { useModal } from "naive-ui";

export const useCanvasEditor = () => {
  const store = useCanvasStore();

  const initEvent = () => {
    emitter.on("on:importSvg", importSvg);
    emitter.on("on:selectMap", selectMap);
  };

  onMounted(() => {
    initEvent();
  });
};
