<template>
  <n-drawer v-model:show="commonStore.collapsed" placement="left">
    <n-drawer-content :native-scrollbar="false">
      <n-menu :value="activeName" :options="menuOptions" @update:value="handleUpdateValue" />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { useCommonStore } from "@/stores";
import { NIcon, type MenuOption } from "naive-ui";
import FileExport from "@/assets/images/icons/FileExport.svg?component";
import { computed, h, type Component } from "vue";
import { useRoute, useRouter } from "vue-router";

const commonStore = useCommonStore();
const route = useRoute();
const router = useRouter();

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const activeName = computed(() => {
  return route.name;
});

const menuOptions: MenuOption[] = [
  {
    label: "编辑工具",
    key: "Editor",
    icon: renderIcon(FileExport)
  },
  {
    label: "图元管理",
    key: "MetaIcon",
    icon: renderIcon(FileExport)
  },
  {
    label: "权限管理",
    key: "Permission",
    icon: renderIcon(FileExport)
  },
  {
    label: "系统管理",
    key: "System",
    icon: renderIcon(FileExport)
  }
];

const handleUpdateValue = (value: string) => {
  router.push({ name: value });
};
</script>

<style></style>
