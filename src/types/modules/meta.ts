export interface IMetaItem {
  objType: string;
  objName: string;
  groupId: string;
  objImg: string;
}

export interface IMetaTableItem {
  index: number;
  objType: string;
  objName: string;
  groupId: string;
  groupName?: string;
  objImg: string;
  compClass: string;
  imgScale: string;
  updatedBy: string;
  updatedTime: string;
}

export interface IMetaSource {
  groupId: string;
  groupName: string;
  objList: IMetaTableItem[];
}

export interface MetaModel {
  objType: string;
  objName: string;
  groupId: string;
  compClass: string;
  objImg: string;
  imgScale: string;
}
