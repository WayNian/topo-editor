import type { IGroupData } from "@/types";
import request from "../../index";

export const getMapGroupData = (mapId: string) => {
  return request.get<IGroupData[]>({
    url: "/topoEdit/getMapGroupData",
    params: { mapId }
  });
};

export const addMapGroupData = (params: {
  mapId: string;
  groupName: string;
  groupDescription?: string;
  topoMapsGroupDataList: {
    dataId: string;
    dataType: "node" | "link";
  }[];
}) => {
  return request.post<string>({ url: "/topoEdit/insertMapGroupData", data: params });
};
