import { ref } from "vue";
import { defineStore } from "pinia";

export const useSvgStore = defineStore("svg", () => {
  const scale = ref(1);
  const isEdit = ref(true);
  const isBgSHow = ref(false);
  const bgType = ref("cloud");
  const bgUrl = ref("");
  const defaultBgFill = ref("#3b3b3b");

  const zoom = ref(1);
  const zoomTrans = ref({
    x: 0,
    y: 0,
    k: 1
  });
  const startPoint = ref({
    x: 0,
    y: 0
  });

  return { scale, isEdit, isBgSHow, bgUrl, bgType, defaultBgFill, zoomTrans, zoom, startPoint };
});
