<template>
  <g id="linkGroup">
    <Link
      v-for="link in dataStore.links"
      :key="link.linkId"
      :data="link"
      @update-bbox="updateBbox($event, link)"
    ></Link>
  </g>
  <g id="nodeGroup">
    <template v-for="node in dataStore.nodes" :key="node.nodeId">
      <Node :data="node"></Node>
    </template>
  </g>
  <g id="mergeLinkGroup"></g>
  <g id="mergeNodeGroup"></g>
</template>

<script setup lang="ts">
import { useDataStore } from "@/stores";
import Link from "./Dom/Link.vue";
import Node from "./Dom/Node.vue";
import type { ILink } from "@/types";

const dataStore = useDataStore();

const updateBbox = (bbox: DOMRect, link: ILink) => {
  const { x, y, width, height } = bbox;

  link.x = x;
  link.y = y;
  link.width = width;
  link.height = height;
};
</script>
