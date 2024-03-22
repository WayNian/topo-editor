import { useCommonStore } from "@/stores/common";
import { setSvgBg } from "@/utils/draw/event/svg";
import { useMessage, useModal } from "naive-ui";
import { onBeforeMount, onMounted } from "vue";

export const useTopo = () => {
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
