<template>
  <Sider>
    <Panel class="left-0 w-100% px-2">
      <n-tabs type="line" animated v-model:value="activeName">
        <n-tab-pane name="files" tab="文件"> <LayerList /> </n-tab-pane>
        <n-tab-pane name="merge" tab="合并"> <MergeList /></n-tab-pane>
      </n-tabs>
    </Panel>
  </Sider>
</template>

<script setup lang="ts">
import { useMenuStore } from "@/stores/";
import Panel from "../Common/Panel/index.vue";
import LayerList from "./Left/LayerList.vue";
import MergeList from "./Left/MergeList.vue";
import Sider from "@/components/TopoEditor/Sider/index.vue";
import { ref, watchEffect } from "vue";
import { resetHighlight } from "@/utils/canvas/draw/svg";

const menuStore = useMenuStore();

const activeName = ref("files");

watchEffect(() => {
  const { mergeNodeList, mergeLinkList } = menuStore;
  activeName.value = mergeNodeList.length || mergeLinkList.length ? "merge" : "files";
});

watchEffect(() => {
  if (activeName.value !== "merge") {
    resetHighlight();
  }
});
</script>

<style scoped></style>
@/utils/canvas/indexSvg @/stores/modules/common
