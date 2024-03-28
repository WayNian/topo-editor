import type { ModalApiInjection } from "naive-ui/es/modal/src/ModalProvider";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCommonStore = defineStore("common", () => {
  const isAttributeViewVisible = ref(false);
  const modal = ref<ModalApiInjection>();
  const importType = ref<string>("addition");

  const isSpaceDown = ref(false);

  return { isAttributeViewVisible, modal, importType, isSpaceDown };
});
