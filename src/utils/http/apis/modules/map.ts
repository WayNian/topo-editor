import type { IMapModel } from "@/types";
import request from "../../index";

export const addMap = (params: IMapModel) => {
  return request.post<string>({ url: "/topoEdit/insertMap", data: params });
};

export const updateMap = (params: IMapModel) => {
  return request.post({ url: "/topoEdit/updateMap", data: params });
};

export const deleteMap = (mapId: string) => {
  return request.post({ url: "/topoEdit/deleteMap", data: { mapId } });
};
