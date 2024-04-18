<template>
  <n-spin :show="commonStore.isLoading" class="fixed left-0 top-0 w-full h-full">
    <div class="fixed left-0 top-0 w-full h-full flex flex-col overflow-hidden">
      <Header></Header>
      <div class="relative flex flex-1 editor-layout">
        <n-layout has-sider>
          <LeftPanel />
          <SvgEditor />
        </n-layout>
        <AttributeTrigger />
        <RightPanel />
        <Shortcut />
      </div>
    </div>
  </n-spin>
</template>

<script setup lang="ts">
import SvgEditor from "@/components/SvgEditor/Editor/index.vue";
import Header from "@/components/SvgEditor/Header/index.vue";
import LeftPanel from "@/components/SvgEditor/Panel/Left/index.vue";
import RightPanel from "@/components/SvgEditor/Panel/Right/index.vue";
import AttributeTrigger from "@/components/SvgEditor/Panel/Right/Trigger/index.vue";
import Shortcut from "@/components/SvgEditor/Shortcut/index.vue";
import { useSvg } from "@/hooks/svg/useSvg";
import { useCommonStore } from "@/stores";

useSvg();

const commonStore = useCommonStore();
</script>

<style scoped></style>
