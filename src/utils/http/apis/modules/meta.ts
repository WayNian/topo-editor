import type { IGroupModel,IMetaModel, IMetaSource } from "@/types";

import request from "../../index";

export const getGroupList = () => {
  return request.get<IMetaSource[]>({ url: "/topoEdit/getGroupList" });
};

export const addGroup = (params: IGroupModel) => {
  return request.post<IMetaSource[]>({
    url: "/topoEdit/insertGroup",
    data: { groupName: params.groupName }
  });
};

export const updateGroup = (params: IGroupModel) => {
  return request.post<IMetaSource[]>({
    url: "/topoEdit/updateGroup",
    data: params
  });
};

export const deleteGroup = (groupId: string) => {
  return request.post<IMetaSource[]>({
    url: "/topoEdit/deleteGroup",
    data: { groupId }
  });
};

export const addMeta = (params: IMetaModel) => {
  return request.post({
    url: "/topoEdit/insertObj",
    data: params
  });
};

export const updateMeta = (params: IMetaModel) => {
  return request.post({
    url: "/topoEdit/updateObj",
    data: params
  });
};

export const deleteMeta = (objType: string) => {
  return request.post({
    url: "/topoEdit/deleteObj",
    data: { objType }
  });
};
