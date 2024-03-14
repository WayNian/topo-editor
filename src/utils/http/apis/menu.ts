import type { IMenuSource, IMenuModel, IMapModel } from "@/types";
import request from "../index";

export const fetchMenuList = () => {
  return request.get<IMenuSource[]>({ url: "/topoEdit/getMenuList" });
};

export const addMenuList = (params: IMenuModel) => {
  return request.post({ url: "/topoEdit/insertMenu", data: params });
};

export const addMap = (params: IMapModel) => {
  return request.post({ url: "/topoEdit/insertMap", data: params });
};

export const updateMenu = (params: IMenuModel) => {
  return request.post({ url: "/topoEdit/updateMenu", data: params });
};

export const updateMap = (params: IMapModel) => {
  return request.post({ url: "/topoEdit/updateMap", data: params });
};

export const deleteMenu = (menuId: string) => {
  return request.post({ url: "/topoEdit/deleteMenu", data: { menuId } });
};

export const deleteMap = (mapId: string) => {
  return request.post({ url: "/topoEdit/deleteMap", data: { mapId } });
};
