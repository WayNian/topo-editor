import type { IImportType } from "@/types";
import type { ModalApiInjection } from "naive-ui/es/modal/src/ModalProvider";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCommonStore = defineStore("common", () => {
  const isAttributeViewVisible = ref(false);
  const modal = ref<ModalApiInjection>();
  const importType = ref<IImportType>("importPart");
  const isLoading = ref(false);

  const collapsed = ref(false);

  const isSpaceDown = ref(false);
  const isShiftDown = ref(false);

  const selectedBoxInfo = ref({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  return {
    isAttributeViewVisible,
    modal,
    importType,
    isSpaceDown,
    isShiftDown,
    isLoading,
    collapsed,
    selectedBoxInfo
  };
});
