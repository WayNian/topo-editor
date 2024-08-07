import { debounce } from "radash";

import type {
  ILink,
  INode,
  INodeLinkSource,
  IOriginalLink,
  IOriginalNode,
  ISourceLink,
  ISourceNode} from "@/types";
import { formatNodesAttribute } from "@/utils/tools";

import request from "../../index";

interface IDeleteNodeModel {
  nodeIdList: string[];
  mapId: string;
}

interface IDeleteLinkModel {
  linkIdList: string[];
  mapId: string;
}

export const getNodeLinkListByMapId = (mapId: string) => {
  return request.get<INodeLinkSource>({
    url: "/topoEdit/getNodeLinkListByMapId",
    params: { mapId }
  });
};

export const addNodeLinkList = (params: { nodeList: INode[]; linkList: ILink[] }) => {
  return request.post<{
    nodeList: ISourceNode[];
    linkList: ISourceLink[];
  }>({ url: "/topoEdit/insertNodeLinkList", data: params });
};

export const addNode = (params: IOriginalNode) => {
  return request.post<string>({ url: "/topoEdit/insertNode", data: params });
};

const updateNodeByHttp = (nodes: INode[]) => {
  if (!nodes.length) return;
  formatNodesAttribute(nodes);
  return request.post<string>({ url: "/topoEdit/updateNode", data: { nodeList: nodes } });
};

export const updateNode = debounce({ delay: 250 }, updateNodeByHttp);

export const deleteNodes = (params: IDeleteNodeModel) => {
  return request.post({ url: "/topoEdit/deleteNode", data: params });
};

export const addLink = (params: IOriginalLink) => {
  return request.post<string>({ url: "/topoEdit/insertLink", data: params });
};

export const updateLinkBhttp = (params: ILink[]) => {
  if (!params.length) return;
  return request.post<string>({ url: "/topoEdit/updateLink", data: { linkList: params } });
};

export const updateLink = debounce({ delay: 250 }, updateLinkBhttp);

export const deleteLinks = (params: IDeleteLinkModel) => {
  return request.post({ url: "/topoEdit/deleteLink", data: params });
};

export const updateNodes = (params: INode[]) => {
  return request.post({
    url: "/topoEdit/updateNode",
    data: {
      nodeList: params
    }
  });
};

export const updateLinks = (params: ILink[]) => {
  return request.post({
    url: "/topoEdit/updateLink",
    data: {
      linkList: params
    }
  });
};

export const updateNodesLinks = async (params: { nodes: INode[]; links: ILink[] }) => {
  const p1 = params.nodes.length && updateNodes(params.nodes);
  const p2 = params.links.length && updateLinks(params.links);
  await Promise.all([p1, p2]);
};
