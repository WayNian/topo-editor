export interface IMetaItem {
  index?: number;
  objType: string;
  objName: string;
  groupId?: string;
  groupName?: string;
  objImg: string;
  compClass?: string;
  imgScale?: string;
  updatedBy?: string;
  updatedTime?: string;
}

export interface IMetaSource {
  groupId: string;
  groupName: string;
  objList: IMetaItem[];
}

export interface IGroupModel {
  groupId: string;
  groupName: string;
}

export interface IMetaModel {
  objType: string;
  objName: string;
  groupId: string;
  compClass: string;
  objImg: string;
  imgScale: string;
}
