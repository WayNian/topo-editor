import type { RendererElement, RendererNode, VNode } from "vue";
import type { IMapSource } from "./map";

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
