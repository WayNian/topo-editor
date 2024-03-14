import type { IMapSource } from "./menu";
import type { INode, ILink } from "./topo";
export type MittType = {
  "on:draw": void;
  "on:importSvg": {
    nodes: INode[];
    links: ILink[];
  };
  "on:selectMap": IMapSource;
};
