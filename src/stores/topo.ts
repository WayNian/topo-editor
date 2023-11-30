import { ref } from "vue";
import { defineStore } from "pinia";
import testData from "@/assets/data/testData.json";
import { formatNodes } from "@/utils/tools/data";

export const useTopo = defineStore("topo", () => {
  const mapSize = ref({ width: 1000, height: 800 });
  const topoNodes = ref(formatNodes(testData.data.nodes));

  return { mapSize, topoNodes };
});
