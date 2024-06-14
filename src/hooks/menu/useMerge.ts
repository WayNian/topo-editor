import { useMapStore } from "@/stores/";
import { useDataStore } from "@/stores/modules/data";
import type { ILink, INode } from "@/types";
import { formatLinks } from "@/utils/tools";
import { drawLinks, drawMergeLinks, drawMergeNodes, drawNodes } from "@/utils/editor/draw/";
import { updateLinks, updateNodes } from "@/utils/http/apis/";

export const useMerge = () => {
  const mapStore = useMapStore();
  const dataStore = useDataStore();

  const mergeNodes = async (nodes: INode[], type: string) => {
    mapStore.mergeNodeList = mapStore.mergeNodeList.filter(
      (item) => nodes.findIndex((node) => node.domId === item.domId) === -1
    );

    drawMergeNodes();

    if (type === "apply") {
      const res: INode[] = [];
      dataStore.nodesAll = dataStore.nodesAll.map((item) => {
        const node = nodes.find((node) => node.nodeId === item.nodeId);
        if (node && item.nodeId === node.nodeId) {
          res.push(item);
        }
        return item;
      });
      await updateNodes(res);
      window.$message.success("合并成功");
      //   drawNodes();
    }
  };

  const mergeLinks = async (links: ILink[], type: string) => {
    mapStore.mergeLinkList = mapStore.mergeLinkList.filter(
      (item) => links.findIndex((link) => link.domId === item.domId) === -1
    );

    drawMergeLinks();

    if (type === "apply") {
      const res: ILink[] = [];
      dataStore.linksAll = dataStore.linksAll.map((item) => {
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
      window.$message.success("合并成功");
      //   drawLinks();
    }
  };

  return { mergeNodes, mergeLinks };
};
