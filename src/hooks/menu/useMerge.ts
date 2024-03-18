import { useCommonStore } from "@/stores/common";
import { useTopoStore } from "@/stores/topo";
import type { ILink } from "@/types";

export const useMerge = () => {
  const mergeLinks = (link: ILink, type: string) => {
    const commonStore = useCommonStore();
    const topoStore = useTopoStore();

    if (type === "cancel") {
      commonStore.mergeLinkList = commonStore.mergeLinkList.filter(
        (item) => item.linkId !== link.linkId
      );
    } else if (type === "apply") {
      commonStore.mergeLinkList = commonStore.mergeLinkList.filter(
        (item) => item.linkId !== link.linkId
      );
      topoStore.topoLinks = topoStore.topoLinks.map((item) => {
        if (item.linkId === link.linkId) {
          console.log("item", item, link);

          return {
            ...link,
            linkId: item.linkId
          };
        }
        return item;
      });

      drawLinks();
      //  更新接口
    }
  };

  return { mergeLinks };
};
function drawLinks() {
  throw new Error("Function not implemented.");
}
