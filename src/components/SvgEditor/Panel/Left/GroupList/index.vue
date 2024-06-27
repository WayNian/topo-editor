<template>
  <PanelScrollbar>
    <div v-for="(item, index) in dataStore.groups" :key="index" class="flex flex-col px-2">
      <div
        class="cursor-pointer hover:bg-#3b3b3b transition-all duration-200 px-2 py-1 rounded-1"
        :class="{ 'bg-#3b3b3b': activeGroup === item.groupId }"
        @click="selectGroup(item)"
      >
        {{ item.groupName }}
      </div>
      <ul class="pl-6 mt-2">
        <li
          v-for="itemChild in item.nodes"
          :key="itemChild.nodeId"
          size="small"
          text
          class="cursor-pointer hover:bg-#3b3b3b transition-all duration-200 px-2 py-1 rounded-1"
          @click="selectGroupItem(itemChild)"
        >
          {{ itemChild.nodeType }}
        </li>
      </ul>
    </div>
  </PanelScrollbar>
</template>

<script setup lang="ts">
import { useDataStore } from "@/stores/";
import PanelScrollbar from "@/components/SvgEditor/Common/PanelScrollbar/index.vue";
import type { IGroupData, INode } from "@/types";
import { setGroupSelected } from "@/utils/tools";
import { ref } from "vue";

const dataStore = useDataStore();
const activeGroup = ref<string>("");

const selectGroup = (item: IGroupData) => {
  if (item.groupId === activeGroup.value) {
    activeGroup.value = "";
    setGroupSelected();
    return;
  }
  activeGroup.value = item.groupId;
  setGroupSelected(item);
};

const selectGroupItem = (item: INode) => {
  console.log("🚀 ~ selectGroupItem ~ item:", item);
};
</script>

<style></style>
