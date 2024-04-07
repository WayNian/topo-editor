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

export type ILayer = {
  sublayerId: string;
  sublayerName: string;
  isVisible: number;
  listOrder: number;
};
