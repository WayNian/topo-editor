<template>
  <Sider>
    <Panel class="left-0 w-40">
      <LayerList></LayerList>
    </Panel>
  </Sider>
</template>

<script setup lang="ts">
import Panel from "../Common/Panel/index.vue";
import LayerList from "./Left/LayerList.vue";
import Sider from "@/components/TopoEditor/Sider/index.vue";
</script>

<style scoped></style>
