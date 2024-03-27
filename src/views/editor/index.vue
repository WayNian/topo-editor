<template>
  <div class="fixed left-0 top-0 w-full h-full flex flex-col overflow-hidden">
    <Header></Header>
    <div class="relative flex flex-1 editor-layout">
      <n-layout has-sider>
        <LeftPanel />
        <CanvasEditor />
      </n-layout>
      <AttributeTrigger />
      <RightPanel />
      <Shortcut />
    </div>
  </div>
</template>

<script setup lang="ts">
import CanvasEditor from "@/components/CanvasEditor/Editor/index.vue";
import Header from "@/components/CanvasEditor/Header/index.vue";
import LeftPanel from "@/components/CanvasEditor/Panel/LeftPanel.vue";
import RightPanel from "@/components/CanvasEditor/Panel/RightPanel.vue";
import AttributeTrigger from "@/components/CanvasEditor/Panel/Right/Attribute/AttributeTrigger.vue";
import Shortcut from "@/components/CanvasEditor/Shortcut/index.vue";
import { useCanvas } from "@/hooks/canvas/useCanvas";

useCanvas();
</script>

<style scoped></style>
