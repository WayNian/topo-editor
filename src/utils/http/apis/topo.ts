import type { INode, ILink, INodeLinkSource } from "@/types";
import request from "../index";

interface IDeleteModel {
  linkIdList: string[];
  mapId: string;
}
export const fetchNodeLinkListByMapId = (mapId: string) => {
  return request.get<INodeLinkSource>({
    url: "/topoEdit/getNodeLinkListByMapId",
    params: { mapId }
  });
};

export const addNodeLinkList = (params: { nodeList: INode[]; linkList: ILink[] }) => {
  return request.post({ url: "/topoEdit/insertNodeLinkList", data: params });
};

export const addNode = (params: INode) => {
  return request.post({ url: "/topoEdit/insertNode", data: params });
};

export const addLink = (params: ILink) => {
  return request.post({ url: "/topoEdit/insertLink", data: params });
};

export const deleteLinks = (params: IDeleteModel) => {
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
