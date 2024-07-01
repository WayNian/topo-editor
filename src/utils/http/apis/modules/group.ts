import type { IGroupData, IGroupDataModel } from "@/types";
import request from "../../index";

export const getMapGroupData = (mapId: string) => {
  return request.get<IGroupData[]>({
    url: "/topoEdit/getMapGroupData",
    params: { mapId }
  });
};

export const addMapGroupData = (params: IGroupDataModel) => {
  return request.post<string>({ url: "/topoEdit/insertMapGroupData", data: params });
};

export const updateMapGroupData = (params: IGroupDataModel) => {
  return request.post<string>({ url: "/topoEdit/updateMapGroupData", data: params });
};

export const deleteMapGroupData = (groupId: string) => {
  return request.post<string>({ url: "/topoEdit/deleteMapGroupData", data: { groupId } });
};
