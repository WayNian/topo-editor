import emitter from "@/utils/mitt";
import { onMounted } from "vue";
import { importSvg, selectMap } from "../../utils/assistant/svg/importSvg";

export const useSvgEditor = () => {
  const initEvent = () => {
    emitter.on("on:importSvg", importSvg);
    emitter.on("on:selectMap", selectMap);
  };

  onMounted(() => {
    initEvent();
  });
};
