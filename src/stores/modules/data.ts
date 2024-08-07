import { computed, ref } from "vue";
import { defineStore } from "pinia";

import type { IGroupData, ILink, INode, ISourceLink, ISourceNode } from "@/types/";

export const useDataStore = defineStore("data", () => {
  const nodesAll = ref<INode[]>([]);
  const linksAll = ref<ILink[]>([]);

  const nodes = ref<INode[]>([]);
  const links = ref<ILink[]>([]);

  const groups = ref<IGroupData[]>([]);

  const currentNode = ref<INode | null>(null);
  const currentLink = ref<ILink | null>(null);
  const isSelectionRectVisible = false;

  const nodeLinkListByImport = ref<{
    nodeList: ISourceNode[];
    linkList: ISourceLink[];
  }>({
    nodeList: [],
    linkList: []
  });

  const nodesSelected = computed(() => nodes.value.filter((node) => node.selected));
  const linksSelected = computed(() => links.value.filter((link) => link.selected));
  const groupSelected = computed(() => groups.value.filter((group) => group.selected));

  return {
    nodesAll,
    linksAll,
    nodeLinkListByImport,
    nodes,
    links,
    groups,
    currentNode,
    currentLink,
    isSelectionRectVisible,
    nodesSelected,
    linksSelected,
    groupSelected
  };
});
