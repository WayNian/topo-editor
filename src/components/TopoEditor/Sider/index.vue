<template>
  <n-layout-sider
    collapse-mode="width"
    :collapsed-width="0"
    :width="240"
    :show-collapsed-content="false"
    show-trigger="arrow-circle"
    content-style="padding: 24px;"
    collapsed-trigger-style="right: -15px"
    bordered
  >
    <slot></slot>
  </n-layout-sider>
</template>

<script setup lang="ts"></script>

<style>
.n-layout-sider.n-layout-sider--bordered .n-layout-sider__border {
  width: 0;
}
</style>
