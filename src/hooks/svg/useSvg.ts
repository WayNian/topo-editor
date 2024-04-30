import { useCommonStore } from "@/stores/modules/common";
import { bindWindowEvent, unbindWindowEvent } from "@/utils/editor/event";
import { useMessage, useModal } from "naive-ui";
import { onBeforeMount, onMounted } from "vue";
import { clearData, selectMap } from "@/utils/tools";
import emitter from "@/utils/mitt";
import { clearSvg } from "@/utils/editor/draw";

export const useSvg = () => {
  const common = useCommonStore();
  common.modal = useModal();

  window.$message = useMessage();

  const initEvent = () => {
    emitter.on("on:selectMap", selectMap);
  };

  const offEvent = () => {
    emitter.off("on:selectMap", selectMap);
  };
  onMounted(() => {
    initEvent();
    bindWindowEvent();
  });

  onBeforeMount(() => {
    offEvent();
    unbindWindowEvent();
    clearSvg();
    clearData();
  });
};
