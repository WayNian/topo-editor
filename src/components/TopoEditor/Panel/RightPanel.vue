<template>
  <div class="attribute-panel absolute top-5 right-0 w-80 h-90% px-2" :style="translate">
    <n-tabs type="line" animated>
      <n-tab-pane name="oasis" tab="节点">
        <NodeAttribute></NodeAttribute>
      </n-tab-pane>
      <n-tab-pane name="jay chou" tab="主题"> 主题 </n-tab-pane>
      <!-- <n-tab-pane name="model" tab="模型"> 模型 </n-tab-pane> -->
    </n-tabs>

    <n-button tertiary circle class="absolute right-1 top-1" @click="closeAttributeView">
      <template #icon>
        <n-icon><close-icon /></n-icon>
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { Close as CloseIcon } from "@vicons/ionicons5";
import { useCommon } from "@/stores/common";
import { computed } from "vue";
import NodeAttribute from "../Panel/Right/Attribute/NodeAttribute.vue";

const store = useCommon();

const translate = computed(() => {
  return {
    transform: store.isAttributeViewVisible ? "translateX(-20px)" : "translateX(100%)"
  };
});

const closeAttributeView = () => {
  store.isAttributeViewVisible = false;
};
</script>

<style scoped>
.attribute-panel {
  transition: all 0.3s;
  background-color: #181818;
}
</style>
