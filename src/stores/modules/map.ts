import type { ILayer } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMapStore = defineStore("map", () => {
  const layers = ref<ILayer[]>([]);

  const getLayers = async () => {
    // fetch layers
  };
  return { layers, getLayers };
});
