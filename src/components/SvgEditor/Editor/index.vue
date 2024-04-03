<template>
  <svg
    id="svgEditor"
    style="width: 100%; height: 100%"
    @dragover="handleDragover"
    @drop="handleDrop"
  >
    <g id="map">
      <rect id="mapBackground" />
      <g id="linkGroup"></g>
      <g id="nodeGroup"></g>
      <g id="mergeLinkGroup"></g>
      <g id="mergeNodeGroup"></g>
      <g
        id="dragPoints"
        v-show="currentBBox.width || currentBBox.height"
        :transform="`translate(${currentBBox.x}, ${currentBBox.y})`"
        fill="#ffffff"
      >
        <rect
          id="selectedRect"
          :width="currentBBox.width"
          :height="currentBBox.height"
          fill="none"
          stroke-dasharray="5,5"
          stroke="#409eff"
          stroke-width="2"
          pointer-events="none"
        />
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
    </g>
    <rect id="selectionRect" v-show="dataStore.isSelectionRectVisible"></rect>
  </svg>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useSvgEditor } from "@/hooks/svg/useSvgEditor";
import { useDataStore } from "@/stores/";
import { bindDragPointEvent } from "@/utils/editor/event/dragPoint";
import { onDroped } from "@/utils/tools";

useSvgEditor();

const dataStore = useDataStore();

const currentBBox = computed(() => {
  if (!dataStore.currentNode) return { x: 0, y: 0, width: 0, height: 0 };
  const { x, y, width, height } = dataStore.currentNode;
  return { x, y, width, height };
});

const handleDragover = (e: DragEvent) => {
  e.preventDefault();
  e.dataTransfer && (e.dataTransfer.dropEffect = "copy");
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  onDroped(e);
};

onMounted(() => {
  bindDragPointEvent();
});
</script>

<style scoped></style>
