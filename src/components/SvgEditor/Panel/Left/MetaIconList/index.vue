<template>
  <n-tag class="my-2" :bordered="false" type="success"> {{ MetaBaseIconList.groupName }} </n-tag>
  <n-grid :x-gap="12" :y-gap="8" :cols="3">
    <n-grid-item
      v-for="(item, index) in MetaBaseIconList.objList"
      :key="index"
      draggable="true"
      @dragstart="handleDragStart($event, item)"
      class="flex flex-col items-center px-4 py-2 bg-#3b3b3b rounded-1 hover:opacity-80 cursor-grab"
    >
      <img :src="item.objImg" class="w-6 h-6 select-none" draggable="false" />
      <span class="text-xs mt-2 select-none">{{ item.objName }}</span>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import type { IMetaItem } from "@/types";
import { MetaBaseIconList } from "@/utils/constant";

const handleDragStart = (e: DragEvent, val: IMetaItem) => {
  e.dataTransfer?.setData("text/plain", JSON.stringify(val));
};
</script>

<style></style>
