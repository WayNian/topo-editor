import type { IDataExtract, IMetaIconDataBind } from "@/types";
import request from "../../index";

export const getDataExtract = () => {
  return request.get<IDataExtract[]>({
    url: "/index/dmTargetDataExtract/getAll"
  });
};

export const getDataExtractInfo = (id: number) => {
  return request
    .post<{
      code: string;
      message: string;
      data: Record<string, any>[];
    }>({
      url: "/dataSource/dataPreviewController/dataPreview/previewByExtractId",
      data: { id, param: {} }
    })
    .then((res) => {
      if (res.code === "0000") {
        return res.data;
      } else {
        window.$message.error(res.message);
        return [];
      }
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
