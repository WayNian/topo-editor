import { onBeforeMount, onMounted } from "vue";
import { useMessage, useModal } from "naive-ui";

import { useCommonStore } from "@/stores/modules/common";
import { clearSvg } from "@/utils/editor/draw";
import { bindWindowEvent, unbindWindowEvent } from "@/utils/editor/event";
import emitter from "@/utils/mitt";
import { clearData, selectMap } from "@/utils/tools";

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
