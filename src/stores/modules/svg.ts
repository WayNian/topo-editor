import { defineStore } from "pinia";
import { ref } from "vue";

export const useSvgStore = defineStore("svg", () => {
  const scale = ref(1);
  const isEdit = ref(true);
  const zoomTrans = ref({
    x: 0,
    y: 0,
    k: 1
  });
  return { scale, isEdit, zoomTrans };
});
