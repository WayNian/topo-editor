import type { IMapSource, IMenuSource } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore("menu", () => {
  const currentMenu = ref<IMapSource | IMenuSource | null>(null);
  return { currentMenu };
});
