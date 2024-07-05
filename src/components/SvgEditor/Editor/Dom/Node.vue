<template>
  <g :id="`node_${data.nodeId}`" :transform="transform" class="cursor-pointer">
    <rect
      v-if="data.nodeType === 'rect'"
      :width="data.width"
      :height="data.height"
      :style="data.style"
    ></rect>
    <ellipse
      v-else-if="data.nodeType === 'circle'"
      :rx="data.width / 2"
      :ry="data.height / 2"
      :cx="data.width / 2"
      :cy="data.height / 2"
      :style="data.style"
    ></ellipse>
    <text
      v-else-if="data.nodeType === 'text'"
      :width="data.width"
      :height="data.height"
      :style="data.style"
      >{{ data.nodeText }}</text
    >
    <Image v-else :data="data"> </Image>
  </g>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import * as d3 from "d3";

import type { INode } from "@/types";
import { bindNodeDrag } from "@/utils/editor/event";

import Image from "./Image.vue";

const props = defineProps<{
  data: INode;
}>();

const transform = computed(() => {
  return `translate(${props.data.x}, ${props.data.y}) rotate(${props.data.rotate || 0} ${props.data.width / 2} ${props.data.height / 2} )`;
});

onMounted(() => {
  const node = d3.select<SVGGElement, INode>(`#node_${props.data.nodeId}`).data([props.data]);

  bindNodeDrag(node);
});
</script>

<style></style>
