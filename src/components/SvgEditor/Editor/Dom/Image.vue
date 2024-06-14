<template>
  <foreignObject :width="data.width" :height="data.height">
    <div :style="style"></div>
  </foreignObject>
</template>

<script setup lang="ts">
import type { INode } from "@/types";
import { getNodeImage } from "@/utils/tools";
import { computed } from "vue";

const props = defineProps<{
  data: INode;
}>();

const style = computed(() => {
  return {
    ...props.data.style,
    backgroundImage: `url(${getNodeImage(props.data)})`,
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    width: "100%",
    height: "100%"
  };
});
</script>

<style></style>
