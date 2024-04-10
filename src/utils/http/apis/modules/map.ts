import type {
  ISublayer,
  ISublayerModel,
  IMapModel,
  ISublayerUpdateModel,
  ISublayerDeleteModel
} from "@/types";
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

export const getSublayers = (mapId: string) => {
  return request.get<ISublayer[]>({ url: "/topoEdit/getExistSublayerList", params: { mapId } });
};

export const addSublayer = (params: ISublayerModel) => {
  return request.post({ url: "/topoEdit/insertTopoSublayerList", data: params });
};

export const updateSublayer = (params: ISublayerUpdateModel) => {
  return request.post({ url: "/topoEdit/updateSublayer", data: params });
};

export const deleteSublayer = (params: ISublayerDeleteModel) => {
  return request.post({ url: "/topoEdit/deleteTopoSublayer", data: params });
};
