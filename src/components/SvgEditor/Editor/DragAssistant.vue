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
      stroke-dasharray="10,5"
      stroke="#409eff"
      stroke-width="4"
      pointer-events="none"
    />
  </g>
  <g id="linkSelectionGroup">
    <rect
      v-for="item in dataStore.linksSelected"
      :key="item.linkId"
      :width="item.width + item.linkWidth + getStrokeWidth(item) + 4"
      :height="item.height + item.linkWidth + getStrokeWidth(item) + 4"
      :x="item.x - item.linkWidth * 0.5 - 2 - getStrokeWidth(item) / 2"
      :y="item.y - item.linkWidth * 0.5 - 2 - getStrokeWidth(item) / 2"
      :transform="`translate(${item.transform.x}, ${item.transform.y})`"
      fill="none"
      stroke-dasharray="10,5"
      stroke="#409eff"
      stroke-width="4"
      pointer-events="none"
    />
  </g>
  <g id="selectionBox" v-show="isSelectionBoxVisible" fill="#ffffff">
    <rect
      class="cursor-move"
      :width="selectionBox.width + 4"
      :height="selectionBox.height + 4"
      :x="selectionBox.x - 2"
      :y="selectionBox.y - 2"
      fill="none"
      stroke-dasharray="10,5"
      stroke="#409eff"
      stroke-width="4"
      pointer-events="all"
    />
    <circle
      id="dragPointLeftTop"
      class="cursor-nw-resize"
      r="8"
      stroke-width="1"
      stroke="#409eff"
      :cx="selectionBox.x"
      :cy="selectionBox.y"
    />
    <circle
      id="dragPointRightTop"
      class="cursor-ne-resize"
      r="8"
      :cx="selectionBox.x + selectionBox.width"
      :cy="selectionBox.y"
      stroke-width="1"
      stroke="#409eff"
    />
    <circle
      id="dragPointRightBottom"
      class="cursor-se-resize"
      r="8"
      :cx="selectionBox.x + selectionBox.width"
      :cy="selectionBox.y + selectionBox.height"
      stroke-width="1"
      stroke="#409eff"
    />
    <circle
      id="dragPointLeftBottom"
      class="cursor-sw-resize"
      r="8"
      :cx="selectionBox.x"
      :cy="selectionBox.y + selectionBox.height"
      stroke-width="1"
      stroke="#409eff"
    />
    <!-- <circle id="dragPointRotate" r="8" stroke-width="1" stroke="#409eff" /> -->
  </g>
</template>

<script setup lang="ts">
import { useDataStore } from "@/stores";
import type { ILink } from "@/types";
import { computed } from "vue";

const dataStore = useDataStore();

const selectionBox = computed(() => {
  if (!dataStore.nodesSelected.length && !dataStore.linksSelected.length)
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  const boxList: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[] = [];

  dataStore.nodesSelected.forEach((item) => {
    boxList.push({
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height
    });
  });

  dataStore.linksSelected.forEach((item) => {
    const strokeWidth = getStrokeWidth(dataStore.currentLink);
    boxList.push({
      x: item.x - strokeWidth / 2 - 2 + item.transform.x,
      y: item.y - strokeWidth / 2 - 2 + item.transform.y,
      width: item.width + strokeWidth + 4,
      height: item.height + strokeWidth + 4
    });
  });

  const leftX = Math.min(...boxList.map((item) => item.x));
  const topY = Math.min(...boxList.map((item) => item.y));
  const rightX = Math.max(...boxList.map((item) => item.x + item.width));
  const bottomY = Math.max(...boxList.map((item) => item.y + item.height));

  return {
    x: leftX,
    y: topY,
    width: rightX - leftX,
    height: bottomY - topY
  };
});

const isSelectionBoxVisible = computed(() => {
  return dataStore.nodesSelected.length || dataStore.linksSelected.length;
});

const pointerEvents = computed(() => {
  return dataStore.linksSelected.length + dataStore.nodesSelected.length === 1 ? "none" : "all";
});

const getStrokeWidth = (item: ILink | null) => {
  if (!item) return 0;
  return parseFloat(item.style["stroke-width"] + "");
};
</script>

<style></style>
