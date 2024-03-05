import { defineStore } from "pinia";
import { ref } from "vue";

export const useCommon = defineStore("common", () => {
  const isAttributeViewVisible = ref(false);
  return { isAttributeViewVisible };
});
