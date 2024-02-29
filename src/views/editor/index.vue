<template>
  <div class="fixed left-0 top-0 w-full h-full flex flex-col overflow-hidden">
    <Header></Header>
    <div class="relative">
      <n-layout has-sider>
        <LeftPanel></LeftPanel>
        <TopoEditor />
      </n-layout>
      <RightPanel></RightPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopoEditor from "@/components/TopoEditor/Editor/index.vue";
import Header from "@/components/TopoEditor/Header/index.vue";
import LeftPanel from "@/components/TopoEditor/Panel/LeftPanel.vue";
import RightPanel from "@/components/TopoEditor/Panel/RightPanel.vue";
</script>

<style scoped></style>
