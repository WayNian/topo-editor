<template>
  <Sider>
    <Panel class="left-0 w-100% px-2">
      <n-tabs type="line" animated v-model:value="activeName">
        <n-tab-pane name="files" tab="文件" :disabled="isShowMerge" display-directive="show">
          <MenuList />
        </n-tab-pane>
        <n-tab-pane name="merge" tab="合并" v-if="isShowMerge"> <MergeList /></n-tab-pane>
        <n-tab-pane
          name="meta"
          tab="图元"
          :disabled="isShowMerge || !mapStore.mapInfo"
          display-directive="show"
        >
          <MetaIconList
        /></n-tab-pane>
        <n-tab-pane name="group" tab="分组" v-if="mapStore.mapInfo">
          <GroupList></GroupList
        ></n-tab-pane>
        <!-- <n-tab-pane
          name="layer"
          tab="子图层"
          :disabled="isShowMerge || !mapStore.mapInfo"
          display-directive="show"
        >
          <SublayerList
        /></n-tab-pane> -->
      </n-tabs>
    </Panel>
  </Sider>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch, watchEffect } from "vue";
import { drawNodesLinks, resetHighlight } from "@/utils/editor/draw/";
import { useMapStore, useMenuStore, useSvgStore } from "@/stores/";
import Panel from "@/components/SvgEditor/Common/Panel/index.vue";
import Sider from "@/components/SvgEditor/Sider/index.vue";
import MenuList from "./MenuList/index.vue";
import MergeList from "./MergeList/index.vue";
import MetaIconList from "./MetaIconList/index.vue";
import GroupList from "./GroupList/index.vue";
import { renewNodesLinks } from "@/utils/tools";

const menuStore = useMenuStore();
const mapStore = useMapStore();
const svgStore = useSvgStore();
const activeName = ref("files");

const isShowMerge = computed(() => {
  return !!(mapStore.mergeNodeList.length || mapStore.mergeLinkList.length);
});

watchEffect(() => {
  activeName.value =
    mapStore.mergeNodeList.length || mapStore.mergeLinkList.length ? "merge" : "files";
});

// 合并结束，刷新节点和连线
watch(isShowMerge, (val) => {
  if (!val) {
    renewNodesLinks();
    drawNodesLinks();
  }
});

watchEffect(() => {
  if (activeName.value !== "merge") {
    resetHighlight();
  }
  svgStore.isEdit = activeName.value !== "merge";
});

onBeforeMount(() => {
  menuStore.selectedKeys = [];
});
</script>

<style scoped></style>
