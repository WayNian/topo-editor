import { useCommonStore } from "@/stores/modules/common";
import { bindWindowEvent, unbindWindowEvent } from "@/utils/svg/event";
import { useMessage, useModal } from "naive-ui";
import { onBeforeMount, onMounted } from "vue";

export const useSvg = () => {
  const common = useCommonStore();
  common.modal = useModal();

  window.$message = useMessage();

  onMounted(() => {
    bindWindowEvent();
  });

  onBeforeMount(() => {
    unbindWindowEvent();
  });
};
