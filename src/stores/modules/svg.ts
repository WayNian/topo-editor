import { defineStore } from "pinia";
import { ref } from "vue";

export const useSvgStore = defineStore("svg", () => {
  const scale = ref(1);
  const isEdit = ref(true);
  const isBgSHow = ref(false);
  const bgType = ref("cloud");
  const bgUrl = ref("");
  const defaultBgFill = ref("#3b3b3b");

  const zoomTrans = ref({
    x: 0,
    y: 0,
    k: 1
  });
  const startPoint = ref({
    x: 0,
    y: 0
  });

  return { scale, isEdit, isBgSHow, bgUrl, bgType, defaultBgFill, zoomTrans, startPoint };
});
