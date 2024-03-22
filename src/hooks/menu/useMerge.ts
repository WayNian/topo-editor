import { formatLinks } from "@/stores/assistant/canvas";
import { useCommonStore } from "@/stores/modules/common";
import { useCanvasStore } from "@/stores/modules/canvas";
import type { ILink, INode } from "@/types";
import { draw, drawMergeLinks, drawMergeNodes } from "@/utils/canvas/draw/svg";
import { updateLinks, updateNodes } from "@/utils/http/apis/topo";

export const useMerge = () => {
  const commonStore = useCommonStore();
  const topoStore = useCanvasStore();

  const mergeNodes = async (nodes: INode[], type: string) => {
    commonStore.mergeNodeList = commonStore.mergeNodeList.filter(
      (item) => nodes.findIndex((node) => node.domId === item.domId) === -1
    );

    drawMergeNodes();

    if (type === "apply") {
      const res: INode[] = [];
      topoStore.topoNodes = topoStore.topoNodes.map((item) => {
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
    commonStore.mergeLinkList = commonStore.mergeLinkList.filter(
      (item) => links.findIndex((link) => link.domId === item.domId) === -1
    );

    drawMergeLinks();

    if (type === "apply") {
      const res: ILink[] = [];
      topoStore.topoLinks = topoStore.topoLinks.map((item) => {
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
