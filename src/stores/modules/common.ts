import type { ILink, INode } from "@/types";
import type { ModalApiInjection } from "naive-ui/es/modal/src/ModalProvider";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCommonStore = defineStore("common", () => {
  const isAttributeViewVisible = ref(false);
  const modal = ref<ModalApiInjection>();
  const importType = ref<string>("addition");
  const mergeNodeList = ref<INode[]>([]);
  const mergeLinkList = ref<ILink[]>([]);

  return { isAttributeViewVisible, modal, importType, mergeNodeList, mergeLinkList };
});
