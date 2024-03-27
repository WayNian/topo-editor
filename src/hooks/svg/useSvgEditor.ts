import { useDataStore } from "@/stores/modules/data";
import type { IMapSource } from "@/types";
import { draw } from "@/utils/svg/draw/svg";
import emitter from "@/utils/mitt";
import { onMounted } from "vue";
import { importSvg, selectMap } from "../../utils/assistant/svg/importSvg";
import { useModal } from "naive-ui";

export const useSvgEditor = () => {
  const store = useDataStore();

  const initEvent = () => {
    emitter.on("on:importSvg", importSvg);
    emitter.on("on:selectMap", selectMap);
  };

  onMounted(() => {
    initEvent();
  });
};
