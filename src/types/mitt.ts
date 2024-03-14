import type { IMapSource } from "./menu";
import type { INode, ILink } from "./topo";
export interface IImportSvgData {
  nodes: INode[];
  links: ILink[];
  name: string;
}

export type MittType = {
  "on:draw": void;
  "on:importSvg": IImportSvgData;
  "on:selectMap": IMapSource;
};
