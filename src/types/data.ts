export interface ISize {
  width: number;
  height: number;
}

export interface IMatrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}
export interface ISourceNode {
  nodeId: string;
  mapId: string;
  nodeType: string;
  compClass: string;
  nodePosition: string;
  nodeSize: string;
  rotate: number;
  nodeStyles: string | Record<string, string>;
  nodeText: string;
  fontSize: string;
  fontColor: string;
  textPosition: string;
  textStyles: string | Record<string, string>;
  bindData: Record<string, string>;
  bindMap: any;
  bindLink: any;
  bindSubLink: string | null;
  metaData: Record<string, string> | null;
  updatedBy: string | null;
  updatedTime: string | null;
  sublayerList: string[] | null;
}

export interface INode extends ISourceNode {
  x: number;
  y: number;
  width: number;
  height: number;
  nodeStyles: Record<string, string>;
  textStyles: Record<string, string>;
}

export interface ISourceLink {
  linkId: string;
  mapId: string;
  linkType: string;
  dashedLink: string;
  compClass: string;
  linkPath: string;
  linkWidth: number;
  linkStyles: string | Record<string, string>;
  linkAnimations: Record<string, string>;
  fromObj: string;
  endObj: string | null;
  bindData: Record<string, string>;
  bindMap: any;
  metaData: Record<string, string> | null;
  updatedBy: string | null;
  updatedTime: string | null;
  sublayerList: string[] | null;
}

export interface ILink extends ISourceLink {
  linkStyles: Record<string, string>;
  pathArray: any[];
}
