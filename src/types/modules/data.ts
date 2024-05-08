import type { ISublayerItem } from "./map";

export interface ISize {
  width: number;
  height: number;
}

export interface IPosition {
  x: number;
  y: number;
}
export interface IMatrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export interface IOriginalNode {
  mapId: string;
  domId: string;
  nodeType: string;
  compClass: string;
  nodePosition: string;
  nodeSize: string;
  rotate: number;
  nodeStyles: string;
  nodeText: string;
  fontSize: string;
  fontColor: string;
  textPosition: string;
  textStyles: string;
  bindData: Record<string, string>;
  bindMap: any;
  metaData: Record<string, string> | null;
  sublayerList: ISublayerItem[];
}

export interface ISourceNode extends IOriginalNode {
  nodeId: string;
  bindLink?: any;
  bindSubLink?: string | null;
  updatedBy?: string | null;
  updatedTime?: string | null;
}

export interface INode extends ISourceNode {
  isMerge?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
  style: Record<string, string>;
  textStyle: Record<string, string>;
  selected?: boolean;
}

export interface IOriginalLink {
  domId: string;
  mapId: string;
  linkType: string;
  dashedLink: string;
  compClass: string;
  linkPath: string;
  linkWidth: number;
  linkStyles: string;
  linkAnimations: Record<string, string>;
  fromObj: string;
  endObj: string | null;
  bindData: Record<string, string>;
  bindMap: any;
  metaData: Record<string, string> | null;
  sublayerList: ISublayerItem[];
}

export interface ISourceLink extends IOriginalLink {
  linkId: string;
  updatedBy?: string | null;
  updatedTime?: string | null;
}

export interface ILink extends ISourceLink {
  isMerge?: boolean;
  style: Record<string, string | number>;
  //   pathArray: any[];
  selected?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  transform: {
    x: number;
    y: number;
  };
}

export interface INodeLinkSource {
  nodes: ISourceNode[];
  links: ISourceLink[];
}

export type IImportType = "import" | "importPart" | "importAll";
