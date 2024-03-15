import { useTopoStore } from "@/stores/topo";
import type { IMapSource } from "@/types";
import { draw } from "@/utils/draw";
import emitter from "@/utils/mitt";
import { onMounted } from "vue";
import { importSvg, selectMap } from "./assistant";
import { useModal } from "naive-ui";

export const useTopoEditor = () => {
  const store = useTopoStore();

  const initEvent = () => {
    emitter.on("on:importSvg", importSvg);
    emitter.on("on:selectMap", selectMap);
  };

  onMounted(() => {
    initEvent();
  });
};
