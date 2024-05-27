<template>
  <PanelScrollbar>
    <n-collapse>
      <n-collapse-item
        v-for="(item, index) in dataStore.groups"
        :key="index"
        :title="item.groupName"
        :name="item.groupId"
      >
        <div class="flex flex-col ml-8">
          <div
            v-for="(itemChild, indexChild) in item.dataIds"
            :key="indexChild"
            size="small"
            text
            class="cursor-pointer mb-2"
          >
            {{ itemChild }}
          </div>
        </div>
      </n-collapse-item>
    </n-collapse>
  </PanelScrollbar>
</template>

<script setup lang="ts">
import { useDataStore } from "@/stores/";
import PanelScrollbar from "@/components/SvgEditor/Common/PanelScrollbar/index.vue";

const dataStore = useDataStore();
</script>

<style></style>
