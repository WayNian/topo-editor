<template>
  <svg id="svgEditor" style="width: 100%; height: 100%">
    <g id="map">
      <rect id="mapBackground" />
      <g id="linkGroup"></g>
      <g id="nodeGroup"></g>
      <g id="mergeLinkGroup"></g>
      <g id="mergeNodeGroup"></g>
      <g>
        <rect
          id="selectedRect"
          :transform="`translate(${currentBBox.x}, ${currentBBox.y})`"
          :width="currentBBox.width"
          :height="currentBBox.height"
          fill="none"
          stroke="#409eff"
          stroke-width="2"
          stroke-dasharray="5,5"
        />
      </g>
      <g
        id="dragPoints"
        v-show="currentBBox.width || currentBBox.height"
        :transform="`translate(${currentBBox.x}, ${currentBBox.y})`"
      >
        <circle id="dragPointLeftTop" r="8" />
        <circle id="dragPointRightTop" r="8" :cx="currentBBox.width" />
        <circle id="dragPointRightBottom" r="8" :cx="currentBBox.width" :cy="currentBBox.height" />
        <circle id="dragPointLeftBottom" r="8" :cy="currentBBox.height" />
        <circle id="dragPointRotate" r="8" />
      </g>
    </g>
    <rect id="selectView" v-show="dataStore.isSelectViewVisible"></rect>
  </svg>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useSvgEditor } from "@/hooks/svg/useSvgEditor";
import { useDataStore } from "@/stores/";
import { bindDragPointEvent } from "@/utils/svg/event/dragPoint";

useSvgEditor();

const dataStore = useDataStore();

const currentBBox = computed(() => {
  if (!dataStore.currentNode) return { x: 0, y: 0, width: 0, height: 0 };
  const { x, y, width, height } = dataStore.currentNode;
  return { x, y, width, height };
});

onMounted(() => {
  bindDragPointEvent();
});
</script>

<style scoped></style>
@/utils/svg/event/drag-point @/hooks/svg/useSvgEditor @/hooks/svg/useSvgEditor @/stores/
@/stores/modules/canvas @/utils/svg/event/dragPoint
