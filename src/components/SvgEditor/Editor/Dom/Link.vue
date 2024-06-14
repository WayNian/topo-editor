<template>
  <g :id="`link_${data.linkId}`" :transform="transform" class="cursor-pointer">
    <path :d="data.linkPath" :style="data.style"></path>
  </g>
</template>

<script setup lang="ts">
import * as d3 from "d3";
import type { ILink } from "@/types";
import { computed, onMounted, watchEffect } from "vue";
import { bindLinkDrag } from "@/utils/editor/event";

const props = defineProps<{
  data: ILink;
}>();

const emit = defineEmits<{
  "update-bbox": [bbox: DOMRect];
}>();

const transform = computed(() => {
  return `translate(${props.data.transform.x}, ${props.data.transform.y})`;
});

onMounted(() => {
  const link = d3.select<SVGGElement, ILink>(`#link_${props.data.linkId}`).data([props.data]);
  const bbox = link.node()?.getBBox();
  if (bbox) {
    emit("update-bbox", bbox);
  }
  bindLinkDrag(link);
});
</script>

<style></style>
