<template>
  <n-config-provider :theme="darkTheme">
    <n-dialog-provider>
      <n-message-provider>
        <RouterView />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from "naive-ui";
</script>

<style scoped></style>
