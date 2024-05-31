<template>
  <n-scrollbar style="height: calc(100vh - 200px)">
    <MapAttribute v-if="isShowMapAttribute"></MapAttribute>
    <template v-else>
      <NodeAtrribute v-if="dataStore.currentNode"></NodeAtrribute>
      <LinkAttribute v-if="dataStore.currentLink"></LinkAttribute>
      <MultiAttribute
        v-if="dataStore.nodesSelected.length > 1 || dataStore.linksSelected.length > 1"
      ></MultiAttribute>
    </template>
  </n-scrollbar>
</template>

<script setup lang="ts">
import NodeAtrribute from "./Node/index.vue";
import LinkAttribute from "./Link/index.vue";
import MapAttribute from "./Map/index.vue";
import MultiAttribute from "./Multi/index.vue";
import { computed } from "vue";
import { useDataStore, useMapStore } from "@/stores";

const dataStore = useDataStore();
const mapStore = useMapStore();
const isShowMapAttribute = computed(() => {
  if (dataStore.linksSelected.length > 1 || dataStore.nodesSelected.length > 1) {
    return false;
  }
  return mapStore.mapInfo && !(dataStore.currentNode || dataStore.currentLink);
});
</script>

<style></style>
