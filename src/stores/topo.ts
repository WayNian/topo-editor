import { ref } from "vue";
import { defineStore } from "pinia";
import testData from "@/assets/data/testData.json";
import { formatLinks, formatNodes } from "@/utils/tools/data";
import type { ILink, INode } from "@/types/data";

export const useTopo = defineStore("topo", () => {
  const mapSize = ref({ width: 1000, height: 800 });
  const topoNodes = ref(formatNodes(testData.data.nodes));
  const topoLinks = ref(formatLinks(testData.data.links));
  const currentNode = ref<INode | null>(null);
  const currentLink = ref<ILink | null>(null);
  const svgSize = ref({ width: 0, height: 0 });
  const isSelectViewVisible = false;

  const setMapSize = (width: number, height: number) => {
    mapSize.value = { width, height };
  };

  return {
    mapSize,
    topoNodes,
    topoLinks,
    currentNode,
    currentLink,
    isSelectViewVisible,
    svgSize,
    setMapSize
  };
});
