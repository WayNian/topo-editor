<template>
  <n-grid :cols="24" class="mb-2">
    <n-grid-item :span="6" v-show="isShowTitle" class="flex items-center justify-end">
      <n-tooltip trigger="hover">
        <template #trigger>
          <span v-show="title">{{ title }}：</span>
        </template>
        {{ tooltip || title }}
      </n-tooltip>
    </n-grid-item>
    <n-grid-item :span="isShowTitle ? 18 : 24" :offset="isShowTitle ? 0 : 2.5">
      <slot></slot>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
defineProps({
  isShowTitle: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ""
  },
  tooltip: {
    type: String,
    default: ""
  }
});
</script>
