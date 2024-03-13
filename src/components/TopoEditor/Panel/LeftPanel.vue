<template>
  <Sider>
    <Panel class="left-0 w-100% px-2">
      <LayerList></LayerList>
      <!-- <n-tabs type="line" animated>
        <n-tab-pane name="oasis" tab="文件"> <LayerList></LayerList> </n-tab-pane>
        <n-tab-pane name="jay chou" tab="图元"> 图元 </n-tab-pane>
        <n-tab-pane name="model" tab="模型"> 模型 </n-tab-pane>
      </n-tabs> -->
    </Panel>
  </Sider>
</template>

<script setup lang="ts">
import Panel from "../Common/Panel/index.vue";
import LayerList from "./Left/LayerList.vue";
import Sider from "@/components/TopoEditor/Sider/index.vue";
</script>

<style scoped></style>
