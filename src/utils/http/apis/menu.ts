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
