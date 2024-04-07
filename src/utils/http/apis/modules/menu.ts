import type { IMenuSource, IMenuModel } from "@/types";
import request from "../../index";

export const fetchMenuList = () => {
  return request.get<IMenuSource[]>({ url: "/topoEdit/getMenuList" });
};

export const addMenu = (params: IMenuModel) => {
  return request.post({ url: "/topoEdit/insertMenu", data: params });
};

export const updateMenu = (params: IMenuModel) => {
  return request.post({ url: "/topoEdit/updateMenu", data: params });
};

export const deleteMenu = (menuId: string) => {
  return request.post({ url: "/topoEdit/deleteMenu", data: { menuId } });
};
