import { ref } from "vue";
import { defineStore } from "pinia";
import testData from "@/assets/data/testData.json";
import { formatLinks, formatNodes } from "@/utils/tools/data";
import type { INode } from "@/types/data";

export const useTopo = defineStore("topo", () => {
  const mapSize = ref({ width: 1000, height: 800 });
  const topoNodes = ref(formatNodes(testData.data.nodes));
  const topoLinks = ref(formatLinks(testData.data.links));
  const nodeSelected = ref<INode | null>(null);

  return { mapSize, topoNodes, topoLinks, nodeSelected };
});
