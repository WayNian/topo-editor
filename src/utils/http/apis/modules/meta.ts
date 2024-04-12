import type { IMetaSource, MetaModel } from "@/types";
import request from "../../index";

export const getGroupList = () => {
  return request.get<IMetaSource[]>({ url: "/topoEdit/getGroupList" });
};

export const addGroup = (groupName: string) => {
  return request.post<IMetaSource[]>({
    url: "/topoEdit/insertGroup",
    data: { groupName }
  });
};

export const addMeta = (params: MetaModel) => {
  return request.post({
    url: "/topoEdit/insertObj",
    data: params
  });
};

export const deleteMeta = (objType: string) => {
  return request.post({
    url: "/topoEdit/deleteObj",
    data: { objType }
  });
};
