<template>
  <svg id="topoEditor">
    <g id="topoMap">
      <rect id="topoMapBackground" />
      <g id="topoLinks"></g>
      <g id="topoNodes"></g>
      <g id="topoMergeLinks"></g>
      <g id="topoMergeNodes"></g>
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
    <rect id="selectView" v-show="store.isSelectViewVisible"></rect>
  </svg>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useTopoEditor } from "@/hooks/topo/";
import { useTopoStore } from "@/stores/topo";
import { bindDragPointEvent } from "@/utils/draw/event/draw-point";
useTopoEditor();
const store = useTopoStore();

const currentBBox = computed(() => {
  if (!store.currentNode) return { x: 0, y: 0, width: 0, height: 0 };
  const { x, y, width, height } = store.currentNode;
  return { x, y, width, height };
});

onMounted(() => {
  bindDragPointEvent();
});
</script>

<style scoped></style>
