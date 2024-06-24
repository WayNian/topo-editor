import type { IDataExtract, IMetaIconDataBind } from "@/types";
import request from "../../index";

export const getDataExtract = () => {
  return request.get<IDataExtract[]>({
    url: "/index/dmTargetDataExtract/getAll"
  });
};

export const getDataExtractInfo = (id: number) => {
  return request.post<{
    data: Record<string, any>[];
  }>({
    url: "/dataSource/dataPreviewController/dataPreview/previewByExtractId",
    data: { id, param: {} }
  });
};

export const getMetaDataBind = (objType: string, domId?: string) => {
  return request.get<IMetaIconDataBind[]>({
    url: "/data/getObjDataBind",
    params: { objType, domId }
  });
};

export const addMetaDataBind = (params: IMetaIconDataBind) => {
  return request.post({
    url: "/data/addObjDataBind",
    data: params
  });
};

export const updataMetaDataBind = (params: IMetaIconDataBind) => {
  return request.post({
    url: "/data/updateObjDataBind",
    data: params
  });
};

export const deleteMetaDataBind = (id: number) => {
  return request.post({
    url: "/data/deleteObjDataBind",
    data: { id }
  });
};
