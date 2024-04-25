<template>
  <g id="nodeSelectionGroup">
    <rect
      v-for="item in dataStore.nodesSelected"
      :key="item.nodeId"
      :width="item.width + 4"
      :height="item.height + 4"
      :x="item.x - 2"
      :y="item.y - 2"
      fill="none"
      stroke-dasharray="5,5"
      stroke="#409eff"
      stroke-width="2"
      pointer-events="none"
    />
  </g>
  <g id="linkSelectionGroup">
    <rect
      v-for="item in dataStore.linksSelected"
      :key="item.linkId"
      :width="item.rect.width + item.linkWidth + 4"
      :height="item.rect.height + item.linkWidth + 4"
      :x="item.rect.x - item.linkWidth * 0.5 - 2"
      :y="item.rect.y - item.linkWidth * 0.5 - 2"
      :transform="`translate(${item.transform.x}, ${item.transform.y})`"
      fill="none"
      stroke-dasharray="5,5"
      stroke="#409eff"
      stroke-width="2"
      pointer-events="none"
    />
  </g>
  <g
    id="dragPoints"
    v-show="isDragPointsVisible"
    :transform="`translate(${currentBBox.x}, ${currentBBox.y})`"
    fill="#ffffff"
  >
    <circle id="dragPointLeftTop" r="8" stroke-width="1" stroke="#409eff" />
    <circle
      id="dragPointRightTop"
      r="8"
      :cx="currentBBox.width"
      stroke-width="1"
      stroke="#409eff"
    />
    <circle
      id="dragPointRightBottom"
      r="8"
      :cx="currentBBox.width"
      :cy="currentBBox.height"
      stroke-width="1"
      stroke="#409eff"
    />
    <circle
      id="dragPointLeftBottom"
      r="8"
      :cy="currentBBox.height"
      stroke-width="1"
      stroke="#409eff"
    />
    <circle id="dragPointRotate" r="8" stroke-width="1" stroke="#409eff" />
  </g>
</template>

<script setup lang="ts">
import { useDataStore } from "@/stores";
import { computed } from "vue";

const dataStore = useDataStore();

const currentBBox = computed(() => {
  if (!dataStore.currentNode && !dataStore.currentLink) return { x: 0, y: 0, width: 0, height: 0 };

  const { x, y, width, height } = dataStore.currentNode || dataStore.currentLink!.rect;
  const transform = dataStore.currentLink ? dataStore.currentLink.transform : { x: 0, y: 0 };

  return { x: x - 2 + transform.x, y: y - 2 + transform.y, width: width + 4, height: height + 4 };
});

const isDragPointsVisible = computed(() => {
  console.log(dataStore.nodesSelected.length, dataStore.linksSelected.length);

  if (dataStore.nodesSelected.length + dataStore.linksSelected.length === 1) return true;
  return false;
});
</script>

<style></style>
