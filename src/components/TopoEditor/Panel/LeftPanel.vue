<template>
  <Sider>
    <Panel class="left-0 w-100% px-2">
      <div class="flex justify-end">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-icon size="24" class="cursor-pointer" @click="handleAddFolder">
              <Add />
            </n-icon>
          </template>
          新增文件夹
        </n-tooltip>
      </div>
      <n-divider />
      <LayerList></LayerList>
      <!-- <n-tabs type="line" animated>
        <n-tab-pane name="oasis" tab="文件"> <LayerList></LayerList> </n-tab-pane>
        <n-tab-pane name="jay chou" tab="图元"> 图元 </n-tab-pane>
        <n-tab-pane name="model" tab="模型"> 模型 </n-tab-pane>
      </n-tabs> -->
      <AddFolderModal ref="addFolderModal"></AddFolderModal>
    </Panel>
  </Sider>
</template>

<script setup lang="ts">
import { Add } from "@vicons/ionicons5";
import Panel from "../Common/Panel/index.vue";
import LayerList from "./Left/LayerList.vue";
import Sider from "@/components/TopoEditor/Sider/index.vue";
import AddFolderModal from "./Left/Modal/AddFolderModal.vue";
import { ref } from "vue";

const addFolderModal = ref<InstanceType<typeof AddFolderModal>>();
const handleAddFolder = () => {
  addFolderModal.value?.show();
};
</script>

<style scoped>
.n-divider:not(.n-divider--vertical) {
  margin-top: 5px;
  margin-bottom: 10px;
}
</style>
