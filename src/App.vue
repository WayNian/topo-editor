<template>
  <n-config-provider :theme="darkTheme">
    <n-dialog-provider>
      <n-modal-provider>
        <n-message-provider>
          <SideDrawer></SideDrawer>
          <BaseView></BaseView>
        </n-message-provider>
      </n-modal-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from "naive-ui";

import BaseView from "@/components/Common/BaseView/index.vue";
import SideDrawer from "@/components/Common/SideDrawer/index.vue";
</script>
