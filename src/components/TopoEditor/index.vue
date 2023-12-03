<template>
  <svg id="topoEditor">
    <g id="topoMap">
      <rect id="topoMapBackground" />
      <g id="topoLinks"></g>
      <g id="topoNodes"></g>
      <g>
        <rect
          id="selectedRect"
          :transform="`translate(${selectedSizePosition.x}, ${selectedSizePosition.y})`"
          :width="selectedSizePosition.width"
          :height="selectedSizePosition.height"
          fill="none"
          stroke="#409eff"
          stroke-width="2"
          stroke-dasharray="5,5"
        />
      </g>
      <g
        id="dragPoints"
        :transform="`translate(${selectedSizePosition.x}, ${selectedSizePosition.y})`"
      >
        <circle id="dragPointLeftTop" r="8" />
        <circle id="dragPointRightTop" r="8" :cx="selectedSizePosition.width" />
        <circle
          id="dragPointRightBottom"
          r="8"
          :cx="selectedSizePosition.width"
          :cy="selectedSizePosition.height"
        />
        <circle id="dragPointLeftBottom" r="8" :cy="selectedSizePosition.height" />
        <circle id="dragPointRotate" r="8" />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTopoEditor } from "@/hooks/useTopoEditor";
import { useTopo } from "@/stores/topo";
useTopoEditor();

const store = useTopo();

const selectedSizePosition = computed(() => {
  if (!store.nodeSelected) return { x: 0, y: 0, width: 0, height: 0 };
  const { x, y, width, height } = store.nodeSelected;
  return { x, y, width, height };
});
</script>

<style scoped></style>
