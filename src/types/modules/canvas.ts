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
export interface ISourceNode {
  nodeId: string;
  mapId: string;
  domId: string;
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
  isMerge?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
  style: Record<string, string>;
  nodeStyles: Record<string, string>;
  textStyles: Record<string, string>;
}

export interface ISourceLink {
  linkId: string;
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
  updatedBy: string | null;
  updatedTime: string | null;
  transform: string;
  sublayerList: string[] | null;
}

export interface ILink extends ISourceLink {
  isMerge?: boolean;
  style: Record<string, string>;
  pathArray: any[];
}

export interface INodeLinkSource {
  nodes: ISourceNode[];
  links: ISourceLink[];
}
