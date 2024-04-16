import type { INode, ILink } from "./data";
import type { IMapSource } from "./map";
export interface IImportData {
  nodes: INode[];
  links: ILink[];
  name: string;
}

export type MittType = {
  "on:draw": void;
  "on:importSvg": IImportData;
  "on:selectMap": IMapSource;
};
