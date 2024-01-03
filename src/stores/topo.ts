import { ref } from "vue";
import { defineStore } from "pinia";
import testData from "@/assets/data/testData.json";
import { formatLinks, formatNodes } from "@/utils/tools/data";
import type { ILink, INode } from "@/types/data";

export const useTopo = defineStore("topo", () => {
  const mapSize = ref({ width: 1000, height: 800 });
  const topoNodes = ref(formatNodes(testData.data.nodes));
  const topoLinks = ref(formatLinks(testData.data.links));
  console.log("🚀 ~ file: topo.ts:11 ~ useTopo ~ topoLinks:", topoLinks);
  const nodeSelected = ref<INode | null>(null);
  const linkSelected = ref<ILink | null>(null);
  const isSelectViewVisible = false;

  return { mapSize, topoNodes, topoLinks, nodeSelected, linkSelected, isSelectViewVisible };
});
