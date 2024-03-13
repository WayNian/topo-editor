import type { RendererElement, RendererNode, VNode } from "vue";

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

export interface IMenuSource {
  menuId: string;
  menuName: string;
  menuParId: string;
  children?: IMenuSource[];
  maps: IMapSource[];
}

export interface IMenuModel {
  menuId?: string;
  menuName: string;
  menuParId: string;
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

export interface ITreeItem {
  key: string;
  label: string;
  prefix: () => VNode<
    RendererNode,
    RendererElement,
    {
      [key: string]: any;
    }
  >;
}

export interface IMenuCascaderItem {
  value: string;
  label: string;
  children?: IMenuCascaderItem[];
}
