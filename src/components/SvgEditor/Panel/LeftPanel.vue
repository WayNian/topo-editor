<template>
  <Sider>
    <Panel class="left-0 w-100% px-2">
      <n-tabs type="line" animated v-model:value="activeName">
        <n-tab-pane name="files" tab="文件"> <LayerList /> </n-tab-pane>
        <n-tab-pane name="merge" tab="合并" v-if="isShowMerge"> <MergeList /></n-tab-pane>
        <n-tab-pane name="meta" tab="图元" v-if="menuStore.mapInfo"> </n-tab-pane>
      </n-tabs>
    </Panel>
  </Sider>
</template>

<script setup lang="ts">
import { useMenuStore } from "@/stores/";
import Panel from "../Common/Panel/index.vue";
import LayerList from "./Left/LayerList.vue";
import MergeList from "./Left/MergeList.vue";
import Sider from "@/components/SvgEditor/Sider/index.vue";
import { computed, ref, watchEffect } from "vue";
import { resetHighlight } from "@/utils/svg/draw/";

const menuStore = useMenuStore();
const activeName = ref("files");

const isShowMerge = computed(() => {
  return menuStore.mergeNodeList.length || menuStore.mergeLinkList.length;
});

watchEffect(() => {
  activeName.value =
    menuStore.mergeNodeList.length || menuStore.mergeLinkList.length ? "merge" : "files";
});

watchEffect(() => {
  if (activeName.value !== "merge") {
    resetHighlight();
  }
});
</script>

<style scoped></style>
@/utils/svg/indexSvg @/stores/modules/common
