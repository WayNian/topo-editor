import { formatLinks } from "@/stores/assistant/topo";
import { useCommonStore } from "@/stores/common";
import { useTopoStore } from "@/stores/topo";
import type { ILink } from "@/types";
import { draw, drawMergeLinks } from "@/utils/draw";
import { updateLinks } from "@/utils/http/apis/topo";

export const useMerge = () => {
  const mergeLinks = async (link: ILink, type: string) => {
    const commonStore = useCommonStore();
    const topoStore = useTopoStore();

    commonStore.mergeLinkList = commonStore.mergeLinkList.filter(
      (item) => item.domId !== link.domId
    );

    drawMergeLinks();
    if (type === "apply") {
      const links: ILink[] = [];
      topoStore.topoLinks = topoStore.topoLinks.map((item) => {
        if (item.linkId === link.linkId) {
          item = {
            ...item,
            linkPath: link.linkPath,
            linkStyles: link.linkStyles
          };
          item = formatLinks([item])[0];
          links.push(item);
        }
        return item;
      });
      await updateLinks(links);
      draw();
    }
  };

  return { mergeLinks };
};
