<template>
  <div class="attribute-panel absolute top-5 right-0 w-80 h-90% px-2" :style="translate">
    <n-tabs type="line" animated>
      <n-tab-pane name="oasis" tab="属性">
        <Attribute></Attribute>
      </n-tab-pane>
      <!-- <n-tab-pane name="model" tab="模型"> 模型 </n-tab-pane> -->
      <n-tab-pane name="layer" tab="子图层" :disabled="!mapStore.mapInfo" display-directive="show">
        <SublayerList
      /></n-tab-pane>
      <n-tab-pane name="data" tab="数据" display-directive="show"> <DataBind /> </n-tab-pane>
    </n-tabs>

    <n-button tertiary circle class="absolute right-1 top-1" @click="closeAttributeView">
      <template #icon>
        <n-icon><close-icon /></n-icon>
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Close as CloseIcon } from "@vicons/ionicons5";

import { useCommonStore, useMapStore } from "@/stores/";

import Attribute from "./Attribute/index.vue";
import DataBind from "./DataBind/index.vue";
import SublayerList from "./SublayerList/index.vue";

const commonStore = useCommonStore();
const mapStore = useMapStore();

const translate = computed(() => {
  return {
    transform:
      commonStore.isAttributeViewVisible && mapStore.mapInfo
        ? "translateX(-20px)"
        : "translateX(100%)"
  };
});

const closeAttributeView = () => {
  commonStore.isAttributeViewVisible = false;
};
</script>

<style scoped>
.attribute-panel {
  transition: all 0.3s;
  background-color: #181818;
}
</style>
@/stores/modules/common./Attribute/Node/NodeAttribute.vue
