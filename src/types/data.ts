export interface ISourceNode {
  nodeId: string;
  mapId: string;
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
  bindData: any;
  bindMap: any;
  bindLink: any;
  bindSubLink: any;
  metaData: any;
  updatedBy: any;
  updatedTime: any;
  sublayerList: any;
}

export interface INode extends ISourceNode {
  x: number;
  y: number;
  width: number;
  height: number;
  nodeStyles: any;
  textStyles: any;
}
