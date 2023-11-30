<template>
  <svg id="topoEditor">
    <g id="topoMap">
      <rect id="topoMapBackground" />
      <g id="topoLinks"></g>
      <g id="topoNodes"></g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { useTopoEditor } from "@/hooks/useTopoEditor";
useTopoEditor();
</script>

<style scoped></style>
