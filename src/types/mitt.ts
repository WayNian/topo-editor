import type { ILink, INode } from ".";

export type MittType = {
  "on:draw": {
    nodes: INode[];
    links: ILink[];
  };
};
