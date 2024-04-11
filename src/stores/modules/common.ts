import type { IImportType } from "@/types";
import type { ModalApiInjection } from "naive-ui/es/modal/src/ModalProvider";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCommonStore = defineStore("common", () => {
  const isAttributeViewVisible = ref(false);
  const modal = ref<ModalApiInjection>();
  const importType = ref<IImportType>("importAddition");
  const isLoading = ref(false);

  const collapsed = ref(false);

  const isSpaceDown = ref(false);
  const isShiftDown = ref(false);

  return {
    isAttributeViewVisible,
    modal,
    importType,
    isSpaceDown,
    isShiftDown,
    isLoading,
    collapsed
  };
});
