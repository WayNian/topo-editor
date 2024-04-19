<template>
  <n-scrollbar style="height: calc(100vh - 110px)">
    <div class="flex flex-col">
      <div>
        <n-tag class="my-2" :bordered="false" type="success"> 连线 </n-tag>
      </div>

      <n-checkbox> 开启画线 </n-checkbox>
    </div>

    <div v-for="(item, index) in metaStore.metaList" :key="index">
      <n-tag class="my-2" :bordered="false" type="success">
        {{ item.groupName }}
      </n-tag>
      <n-grid :x-gap="12" :y-gap="8" :cols="3">
        <n-grid-item
          v-for="(itemChild, index) in item.objList"
          :key="index"
          draggable="true"
          @dragstart="handleDragStart($event, itemChild)"
          class="flex flex-col items-center px-4 py-2 bg-#3b3b3b rounded-1 hover:opacity-80 cursor-grab"
        >
          <img :src="itemChild.objImg" class="w-6 h-6 select-none" draggable="false" />
          <span class="text-xs mt-2 select-none">{{ itemChild.objName }}</span>
        </n-grid-item>
      </n-grid>
    </div>
  </n-scrollbar>
</template>

<script setup lang="ts">
import { useMetaStore } from "@/stores";
import type { IMetaItem } from "@/types";
import { onMounted } from "vue";

const metaStore = useMetaStore();

const handleDragStart = (e: DragEvent, val: IMetaItem) => {
  e.dataTransfer?.setData("text/plain", JSON.stringify(val));
};

onMounted(() => {
  metaStore.getMetaList();
});
</script>

<style></style>
