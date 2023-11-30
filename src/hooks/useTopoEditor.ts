import { draw } from "@/utils/draw";
import { onMounted } from "vue";

export const useTopoEditor = () => {
  onMounted(() => {
    draw();
  });
};
