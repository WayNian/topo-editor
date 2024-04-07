import type { ISubLayer, ISubLayerModel, IMapModel, ISubLayerUpdateModel } from "@/types";
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

export const getSubLayers = (mapId: string) => {
  return request.get<ISubLayer[]>({ url: "/topoEdit/getExistSublayerList", params: { mapId } });
};

export const addSubLayer = (params: ISubLayerModel) => {
  return request.post({ url: "/topoEdit/insertTopoSublayerList", data: params });
};

export const updateSublayer = (params: ISubLayerUpdateModel) => {
  return request.post({ url: "/topoEdit/updateSublayer", data: params });
};
