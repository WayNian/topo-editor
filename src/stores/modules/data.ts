import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { ILink, INode, INodeLinkSource, ISourceLink, ISourceNode } from "@/types/";
import {
  addNodeLinkList,
  deleteLinks,
  deleteNodes,
  fetchNodeLinkListByMapId
} from "@/utils/http/apis/";
import { formatLinks, formatNodes } from "@/utils/tools/";
import { useMapStore } from "..";

export const useDataStore = defineStore("data", () => {
  const nodesAll = ref<INode[]>([]);
  const linksAll = ref<ILink[]>([]);

  const nodes = ref<INode[]>([]);
  const links = ref<ILink[]>([]);

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

  const fetchNodeLinkList = async (mapId: string) => {
    const { nodes, links } = await fetchNodeLinkListByMapId(mapId);
    nodesAll.value = formatNodes(nodes);
    linksAll.value = formatLinks(links);
  };

  const renewNodesLinks = () => {
    const mapStore = useMapStore();
    const sublayerIds = mapStore.sublayerIds;
    nodes.value = nodesAll.value.filter((node) => {
      const sublayerList = node.sublayerList || [];
      if (!sublayerList.length) {
        return sublayerIds.includes("other");
      } else {
        return sublayerList.some((sublayer) => sublayerIds.includes(sublayer.sublayerId));
      }
    });
    links.value = linksAll.value.filter((link) => {
      const sublayerList = link.sublayerList || [];
      if (!sublayerList.length) {
        return sublayerIds.includes("other");
      } else {
        return sublayerList.some((sublayer) => sublayerIds.includes(sublayer.sublayerId));
      }
    });
  };

  // 只渲染需要merge的节点
  const renewMergeNodesLinks = () => {
    const mapStore = useMapStore();
    nodes.value = nodesAll.value.filter((node) => {
      return mapStore.mergeNodeList.some((mergeNode) => mergeNode.domId === node.domId);
    });
    links.value = linksAll.value.filter((link) => {
      return mapStore.mergeLinkList.some((mergeLink) => mergeLink.domId === link.domId);
    });
  };

  const addNodeLinkListFunc = async (nodes: INode[], links: ILink[]) => {
    if (!nodes.length && !links.length) return;
    nodeLinkListByImport.value = await addNodeLinkList({ nodeList: nodes, linkList: links });
    console.log("🚀 ~ addNodeLinkListFunc ~ nodeLinkListByImport:", nodeLinkListByImport);
  };

  const deleteNodeFunc = async (nodes: INode[]) => {
    if (!nodes.length) return;
    const mapStore = useMapStore();
    const nodeIdList = nodes.map((item) => item.nodeId);
    const mapId = mapStore.mapInfo!.mapId as string;
    await deleteNodes({ nodeIdList, mapId });
    nodesAll.value = nodesAll.value.filter((node) => !nodeIdList.includes(node.nodeId));
  };

  const deleteLinkFunc = async (links: ILink[]) => {
    if (!links.length) return;
    const mapStore = useMapStore();
    const linkIdList = links.map((item) => item.linkId);
    const mapId = mapStore.mapInfo!.mapId as string;
    await deleteLinks({ linkIdList, mapId });
    linksAll.value = linksAll.value.filter((link) => !linkIdList.includes(link.linkId));
  };

  return {
    nodesAll,
    linksAll,
    nodeLinkListByImport,
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
    renewNodesLinks,
    renewMergeNodesLinks
  };
});
