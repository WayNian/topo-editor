import { defineStore } from "pinia";
import { ref } from "vue";

export const useSvgStore = defineStore("svg", () => {
  const scale = ref(1);
  return { scale };
});
