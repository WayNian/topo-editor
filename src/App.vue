<template>
  <n-config-provider :theme="darkTheme">
    <RouterView />
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from "naive-ui";
</script>

<style scoped></style>
