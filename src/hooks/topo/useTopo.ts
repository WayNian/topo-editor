import { setSvgBg } from "@/utils/draw/event/svg";
import { onBeforeMount, onMounted } from "vue";

export const useTopo = () => {
  onMounted(() => {
    window.addEventListener("resize", () => setSvgBg);
  });

  onBeforeMount(() => {
    window.removeEventListener("resize", () => setSvgBg);
  });
};
