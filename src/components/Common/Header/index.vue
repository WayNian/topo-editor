<template>
  <div class="w-full h-12 flex flex-shrink-0 items-center px-3">
    <n-button text style="font-size: 24px" class="mr-3" @click="toggleCollapsed">
      <n-icon>
        <MenuSharp />
      </n-icon>
    </n-button>
    <slot></slot>
    <n-dropdown :options="settingOptions" @select="handleSelect">
      <n-button text style="font-size: 24px">
        <n-icon>
          <SettingsSharp />
        </n-icon>
      </n-button>
    </n-dropdown>
  </div>
  <MapVersion ref="mapVersionRef" />
</template>

<script setup lang="ts">
import { SettingsSharp } from "@vicons/ionicons5";
import MenuSharp from "@/assets/images/icons/MenuSharp.svg?component";
import { useCommonStore } from "@/stores";
import MapVersion from "@/components/Version/index.vue";
import { ref } from "vue";

const commonStore = useCommonStore();
const mapVersionRef = ref<InstanceType<typeof MapVersion> | null>(null);

const settingOptions = [
  {
    label: "版本信息",
    key: "version"
  },
  {
    label: "退出登录",
    key: "logout"
  }
];

const toggleCollapsed = () => {
  commonStore.collapsed = !commonStore.collapsed;
};

const handleSelect = (key: string) => {
  switch (key) {
    case "version":
      mapVersionRef.value?.show();
      break;
    // case "logout":
    //   window.$router.push("/login");
    //   break;
  }
};
</script>

<style scoped></style>
