<template>
  <div class="w-full h-12 flex flex-shrink-0 items-center px-3">
    <n-button text style="font-size: 24px" class="mr-3" @click="toggleCollapsed">
      <n-icon>
        <MenuSharp />
      </n-icon>
    </n-button>
    <slot></slot>
    <n-dropdown :options="settingOptions">
      <n-button text style="font-size: 24px">
        <n-icon>
          <SettingsSharp />
        </n-icon>
      </n-button>
    </n-dropdown>
  </div>
</template>

<script setup lang="ts">
import { SettingsSharp } from "@vicons/ionicons5";
import MenuSharp from "@/assets/images/icons/MenuSharp.svg?component";
import { useCommonStore } from "@/stores";

const commonStore = useCommonStore();

const settingOptions = [
  {
    label: "退出登录",
    key: "logout"
  }
];

const toggleCollapsed = () => {
  commonStore.collapsed = !commonStore.collapsed;
};
</script>

<style scoped></style>
