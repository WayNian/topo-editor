import { useMenuStore } from "@/stores/";
import { useDataStore } from "@/stores/modules/data";
import type { ILink, INode } from "@/types";
import { formatLinks } from "@/utils/assistant";
import { draw, drawMergeLinks, drawMergeNodes } from "@/utils/canvas/draw/svg";
import { updateLinks, updateNodes } from "@/utils/http/apis/topo";

export const useMerge = () => {
  const menuStore = useMenuStore();
  const dataStore = useDataStore();

  const mergeNodes = async (nodes: INode[], type: string) => {
    menuStore.mergeNodeList = menuStore.mergeNodeList.filter(
      (item) => nodes.findIndex((node) => node.domId === item.domId) === -1
    );

    drawMergeNodes();

    if (type === "apply") {
      const res: INode[] = [];
      dataStore.nodes = dataStore.nodes.map((item) => {
        const node = nodes.find((node) => node.nodeId === item.nodeId);
        if (node && item.nodeId === node.nodeId) {
          res.push(item);
        }
        return item;
      });
      await updateNodes(res);
      draw();
    }
  };

  const mergeLinks = async (links: ILink[], type: string) => {
    menuStore.mergeLinkList = menuStore.mergeLinkList.filter(
      (item) => links.findIndex((link) => link.domId === item.domId) === -1
    );

    drawMergeLinks();

    if (type === "apply") {
      const res: ILink[] = [];
      dataStore.links = dataStore.links.map((item) => {
        const link = links.find((link) => link.linkId === item.linkId);
        if (link && item.linkId === link.linkId) {
          item = {
            ...item,
            linkPath: link.linkPath,
            linkStyles: link.linkStyles
          };
          item = formatLinks([item])[0];
          res.push(item);
        }
        return item;
      });
      await updateLinks(res);
      draw();
    }
  };

  return { mergeNodes, mergeLinks };
};
