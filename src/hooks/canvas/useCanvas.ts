import { useCommonStore } from "@/stores/common";
import { setSvgBg } from "@/utils/canvas/event/svg";
import { useMessage, useModal } from "naive-ui";
import { onBeforeMount, onMounted } from "vue";

export const useCanvas = () => {
  const common = useCommonStore();
  common.modal = useModal();

  window.$message = useMessage();

  onMounted(() => {
    window.addEventListener("resize", () => setSvgBg);
  });

  onBeforeMount(() => {
    window.removeEventListener("resize", () => setSvgBg);
  });
};
