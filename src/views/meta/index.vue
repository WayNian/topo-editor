<template>
  <div class="flex flex-1">
    <n-tree
      block-line
      :data="data"
      :default-expanded-keys="defaultExpandedKeys"
      expand-on-click
      checkable
    />
    <div>516515</div>
  </div>
</template>

<script setup lang="ts">
import type { TreeOption } from "naive-ui";
import { ref } from "vue";

const data = [];
const defaultExpandedKeys = ref(["40", "41"]);

function createLabel(level: number): string {
  if (level === 4) return "道生一";
  if (level === 3) return "一生二";
  if (level === 2) return "二生三";
  if (level === 1) return "三生万物";
  return "";
}
</script>

<style></style>
