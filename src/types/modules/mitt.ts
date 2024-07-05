import type { ILink,INode } from "./data";
import type { IMapSource } from "./map";
export interface IImportData {
  nodes: INode[];
  links: ILink[];
  name: string;
  defs: string;
}

export type MittType = {
  "on:draw": void;
  "on:selectMap": IMapSource;
  "on:delete": void;
};
