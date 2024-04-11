<template>
  <n-config-provider :theme="darkTheme">
    <n-dialog-provider>
      <n-modal-provider>
        <n-message-provider>
          <RouterView />
          <SideDrawer></SideDrawer>
        </n-message-provider>
      </n-modal-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from "naive-ui";
import SideDrawer from "@/components/Common/SideDrawer/index.vue";
</script>

<style scoped></style>
