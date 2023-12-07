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
  bindMap: string;
  bindLink: any;
  bindSubLink: string;
  metaData: Record<string, string>;
  updatedBy: string;
  updatedTime: string;
  sublayerList: string[];
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
  endObj: string;
  bindData: Record<string, string>;
  bindMap: string;
  metaData: Record<string, string>;
  updatedBy: string;
  updatedTime: string;
  sublayerList: string[];
}

export interface ILink extends ISourceLink {
  linkStyles: Record<string, string>;
}
