import { ref } from "vue";
import { defineStore } from "pinia";

export const useTopo = defineStore("topo", () => {
  const mapSize = ref({ width: 1000, height: 800 });

  return { mapSize };
});
