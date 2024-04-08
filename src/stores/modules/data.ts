import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { ILink, INode } from "@/types/";
import {
  addNodeLinkList,
  deleteLinks,
  deleteNodes,
  fetchNodeLinkListByMapId
} from "@/utils/http/apis/";
import { formatLinks, formatNodes } from "@/utils/tools/";
import { useMapStore, useMenuStore } from "..";

export const useDataStore = defineStore("data", () => {
  const nodesTotal = ref<INode[]>([]);
  const linksTotal = ref<ILink[]>([]);

  const nodes = ref<INode[]>([]);
  const links = ref<ILink[]>([]);

  const currentNode = ref<INode | null>(null);
  const currentLink = ref<ILink | null>(null);
  const isSelectionRectVisible = false;

  const nodesSelected = computed(() => nodes.value.filter((node) => node.selected));
  const linksSelected = computed(() => links.value.filter((link) => link.selected));

  const fetchNodeLinkList = async (mapId: string) => {
    const { nodes, links } = await fetchNodeLinkListByMapId(mapId);
    nodesTotal.value = formatNodes(nodes);
    linksTotal.value = formatLinks(links);
  };

  const filterNodesLinks = () => {
    const mapStore = useMapStore();
    const sublayerIds = mapStore.sublayerIds;
    nodes.value = nodesTotal.value.filter((node) => {
      const sublayerList = node.sublayerList || [];
      if (!sublayerList.length) {
        return sublayerIds.includes("other");
      } else {
        return sublayerList.some((sublayer) => sublayerIds.includes(sublayer.sublayerId));
      }
    });
    links.value = linksTotal.value.filter((link) => {
      const sublayerList = link.sublayerList || [];
      if (!sublayerList.length) {
        return sublayerIds.includes("other");
      } else {
        return sublayerList.some((sublayer) => sublayerIds.includes(sublayer.sublayerId));
      }
    });
  };

  const addNodeLinkListFunc = async (nodes: INode[], links: ILink[]) => {
    if (!nodes.length && !links.length) return;
    await addNodeLinkList({ nodeList: nodes, linkList: links });
    nodes = [];
    links = [];
  };

  const deleteNodeFunc = async (nodes: INode[]) => {
    if (!nodes.length) return;
    const menuStore = useMenuStore();
    const nodeIdList = nodes.map((item) => item.nodeId);
    const mapId = menuStore.mapInfo!.mapId as string;
    await deleteNodes({ nodeIdList, mapId });
  };

  const deleteLinkFunc = async (links: ILink[]) => {
    if (!links.length) return;
    const menuStore = useMenuStore();
    const linkIdList = links.map((item) => item.linkId);
    const mapId = menuStore.mapInfo!.mapId as string;
    await deleteLinks({ linkIdList, mapId });
  };

  return {
    nodes,
    links,
    currentNode,
    currentLink,
    isSelectionRectVisible,
    nodesSelected,
    linksSelected,

    fetchNodeLinkList,
    addNodeLinkListFunc,
    deleteNodeFunc,
    deleteLinkFunc,
    filterNodesLinks
  };
});
