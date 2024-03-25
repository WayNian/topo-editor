import type { ILink, IMapSource, IMenuSource, INode } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore("menu", () => {
  const currentMenu = ref<IMapSource | IMenuSource | null>(null);
  const collapsed = ref(false);

  const mergeNodeList = ref<INode[]>([]);
  const mergeLinkList = ref<ILink[]>([]);
  return { currentMenu, collapsed, mergeNodeList, mergeLinkList };
});
