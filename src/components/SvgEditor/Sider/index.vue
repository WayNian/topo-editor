<template>
  <n-layout-sider
    collapse-mode="width"
    :collapsed-width="0"
    :width="300"
    :show-collapsed-content="false"
    show-trigger="arrow-circle"
    content-style="padding: 24px;"
    collapsed-trigger-style="right: -15px"
  >
    <slot></slot>
  </n-layout-sider>
</template>

<script setup lang="ts"></script>

<style></style>
