import { ref } from "vue";
import { defineStore } from "pinia";
import type { ILink, INode } from "@/types/";
import { addNodeLinkList, deleteLinks, fetchNodeLinkListByMapId } from "@/utils/http/apis/topo";
import { formatLinks, formatNodes } from "@/utils/assistant/";
import { useMenuStore } from "..";

export const useCanvasStore = defineStore("canvas", () => {
  const topoNodes = ref<INode[]>([]);
  const topoLinks = ref<ILink[]>([]);

  const currentNode = ref<INode | null>(null);
  const currentLink = ref<ILink | null>(null);
  const isSelectViewVisible = false;

  const fetchNodeLinkList = async (mapId: string) => {
    const res = await fetchNodeLinkListByMapId(mapId);
    topoNodes.value = formatNodes(res.nodes);
    topoLinks.value = formatLinks(res.links);
  };

  const addNodeLinkListFunc = async (nodes: INode[], links: ILink[]) => {
    if (!nodes.length && !links.length) return;
    await addNodeLinkList({ nodeList: nodes, linkList: links });
    nodes = [];
    links = [];
  };

  const deleteLinkFunc = async (links: ILink[]) => {
    if (!links.length) return;
    const menuStore = useMenuStore();
    const linkIdList = links.map((item) => item.linkId);
    const mapId = menuStore.mapInfo!.mapId as string;
    await deleteLinks({ linkIdList, mapId });
  };
  return {
    topoNodes,
    topoLinks,
    currentNode,
    currentLink,
    isSelectViewVisible,
    fetchNodeLinkList,
    addNodeLinkListFunc,
    deleteLinkFunc
  };
});
