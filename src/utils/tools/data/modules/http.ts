import { useDataStore, useMapStore } from "@/stores";
import type { ILink, INode, IOriginalLink, IOriginalNode } from "@/types";
import {
  addLink as addLinkByHttp,
  addNode as addNodeByHttp,
  addNodeLinkList as addNodeLinkListByHttp,
  deleteLinks as deeLinksByHttp,
  deleteNodes as deleteNodesByHttp,
  getMapGroupData as getMapGroupDataByHttp,
  getNodeLinkListByMapId
} from "@/utils/http/apis/";

import { initGroupData } from "..";

import { renewLinks, renewNodes } from "./data";
import { formatLink, formatLinks, formatNode, formatNodes } from "./format";

/**
 *  获取节点和连线列表
 * @param mapId
 */
export const getNodeLinkList = async (mapId: string) => {
  const dataStore = useDataStore();
  const { nodes, links } = await getNodeLinkListByMapId(mapId);
  dataStore.nodesAll = formatNodes(nodes);
  dataStore.linksAll = formatLinks(links);
};

/**
 *  获取节点和连线列表
 * @param mapId
 */
export const getMapGroupData = async (mapId: string) => {
  const dataStore = useDataStore();
  dataStore.groups = await getMapGroupDataByHttp(mapId);
  initGroupData();
};

/**
 *  添加节点
 * @param node
 */
export const addNode = async (node: IOriginalNode) => {
  const dataStore = useDataStore();

  const id = await addNodeByHttp(node);
  const newNode = formatNode({
    nodeId: id,
    ...node
  });

  window.$message.success("添加成功");
  dataStore.nodesAll.push(newNode);
  renewNodes();
  //   drawNodes();
};

/**
 *  添加连线
 * @param link
 */
export const addLink = async (link: IOriginalLink) => {
  const dataStore = useDataStore();

  const id = await addLinkByHttp(link);
  const newNode = formatLink({
    linkId: id,
    ...link
  });

  window.$message.success("添加成功");
  dataStore.linksAll.push(newNode);
  renewLinks();
  //   drawLinks();
};

/**
 *  批量添加节点和连线
 * @param nodes
 * @param links
 * @returns
 */
export const addNodeLinkList = async (nodes: INode[], links: ILink[]) => {
  const dataStore = useDataStore();

  if (!nodes.length && !links.length) return;
  dataStore.nodeLinkListByImport = await addNodeLinkListByHttp({
    nodeList: nodes,
    linkList: links
  });
};

/**
 * 删除节点
 * @param nodes
 * @returns
 */
export const deleteNodes = async (nodes: INode[]) => {
  const dataStore = useDataStore();
  if (!nodes.length) return;
  const mapStore = useMapStore();
  const nodeIdList = nodes.map((item) => item.nodeId);
  const mapId = mapStore.mapInfo!.mapId as string;
  await deleteNodesByHttp({ nodeIdList, mapId });
  dataStore.nodesAll = dataStore.nodesAll.filter((node) => !nodeIdList.includes(node.nodeId));
};

/**
 * 删除连线
 * @param links
 * @returns
 */
export const deleteLinks = async (links: ILink[]) => {
  const dataStore = useDataStore();
  if (!links.length) return;
  const mapStore = useMapStore();
  const linkIdList = links.map((item) => item.linkId);
  const mapId = mapStore.mapInfo!.mapId as string;
  await deeLinksByHttp({ linkIdList, mapId });
  dataStore.linksAll = dataStore.linksAll.filter((link) => !linkIdList.includes(link.linkId));
};
