<template>
  <n-grid :cols="24" class="mb-2">
    <n-grid-item :span="6" class="flex items-center justify-end">
      <n-tooltip trigger="hover">
        <template #trigger>
          <span>{{ title }}：</span>
        </template>
        {{ tooltip || title }}
      </n-tooltip>
    </n-grid-item>
    <n-grid-item :span="18">
      <slot></slot>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  tooltip?: string;
}>();
</script>
