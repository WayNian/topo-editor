// import { importSvg, selectMap } from "@/utils/tools";
// import emitter from "@/utils/mitt";
import { onBeforeMount, onMounted } from "vue";

export const useSvgEditor = () => {
  //   const initEvent = () => {
  //     emitter.on("on:importSvg", importSvg);
  //     emitter.on("on:selectMap", selectMap);
  //   };

  //   const offEvent = () => {
  //     emitter.off("on:importSvg", importSvg);
  //     emitter.off("on:selectMap", selectMap);
  //   };

  onMounted(() => {
    // initEvent();
  });

  onBeforeMount(() => {
    // offEvent();
  });
};
