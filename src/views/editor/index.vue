<template>
  <div class="fixed left-0 top-0 w-full h-full flex flex-col overflow-hidden">
    <Header></Header>
    <div class="relative flex flex-1 editor-layout">
      <n-layout has-sider>
        <LeftPanel />
        <TopoEditor />
      </n-layout>
      <AttributeTrigger />
      <RightPanel />
      <Shortcut />
    </div>
  </div>
</template>

<script setup lang="ts">
import TopoEditor from "@/components/TopoEditor/Editor/index.vue";
import Header from "@/components/TopoEditor/Header/index.vue";
import LeftPanel from "@/components/TopoEditor/Panel/LeftPanel.vue";
import RightPanel from "@/components/TopoEditor/Panel/RightPanel.vue";
import AttributeTrigger from "@/components/TopoEditor/Panel/Right/Attribute/AttributeTrigger.vue";
import Shortcut from "@/components/TopoEditor/Shortcut/index.vue";
import { useCanvas } from "@/hooks/canvas/useCanvas";

useCanvas();
</script>

<style scoped></style>
