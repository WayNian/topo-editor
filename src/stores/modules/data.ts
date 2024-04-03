import { ref } from "vue";
import { defineStore } from "pinia";
import type { ILink, INode } from "@/types/";
import {
  addNodeLinkList,
  deleteLinks,
  deleteNodes,
  fetchNodeLinkListByMapId
} from "@/utils/http/apis/topo";
import { formatLinks, formatNodes } from "@/utils/tools/";
import { useMenuStore } from "..";

export const useDataStore = defineStore("data", () => {
  const nodes = ref<INode[]>([]);
  const links = ref<ILink[]>([]);

  const currentNode = ref<INode | null>(null);
  const currentLink = ref<ILink | null>(null);
  const isSelectionRectVisible = false;

  const fetchNodeLinkList = async (mapId: string) => {
    const res = await fetchNodeLinkListByMapId(mapId);
    nodes.value = formatNodes(res.nodes);
    links.value = formatLinks(res.links);
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
    fetchNodeLinkList,
    addNodeLinkListFunc,
    deleteNodeFunc,
    deleteLinkFunc
  };
});
