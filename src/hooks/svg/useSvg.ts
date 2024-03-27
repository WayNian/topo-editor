import { useCommonStore } from "@/stores/modules/common";
import { setSvgBg } from "@/utils/svg/event/svg";
import { useMessage, useModal } from "naive-ui";
import { onBeforeMount, onMounted } from "vue";

export const useSvg = () => {
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
