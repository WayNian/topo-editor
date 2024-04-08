export interface IMapSource {
  mapId: string;
  mapName: string;
  mapSize: string;
  background: string;
  mapIndex: number;
  externalBind: Record<string, string>;
  internalBind: Record<string, string>;
  description: Record<string, string>;
  menuId: string;
  updatedBy: string;
  updatedTime: string;
}

export interface IMapModel {
  menuId?: string;
  mapName: string;
  mapSize: string;
  height: number;
  width: number;
  background: string;
  mapIndex: number;
  externalBind: Record<string, string>;
  internalBind: Record<string, string>;
  description: Record<string, string>;
}

export interface IMap extends IMapSource {
  height: number;
  width: number;
}

export type ISublayer = {
  sublayerId: string;
  sublayerName: string;
  isVisible: number; //是否显示 1 是 0 否,必传
  listOrder: number; //排序,必传
};

export type ISublayerItem = {
  sublayerId: string;
  objType: 1 | 2; //对象类型 1 节点， 2 连线
  objId: string;
};

export type ISublayerModel = {
  mapId: string;
  sublayerId?: string;
  sublayerName: string;
  sublayerList?: ISublayerItem[];
};

export interface ISublayerUpdateModel extends ISublayer {
  mapId: string;
}
