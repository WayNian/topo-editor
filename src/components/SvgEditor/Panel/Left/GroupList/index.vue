<template>
  <PanelScrollbar>
    <div v-for="(item, index) in dataStore.groups" :key="index" class="flex flex-col px-2">
      <div
        class="flex justify-between cursor-pointer hover:bg-#3b3b3b transition-all duration-200 px-2 py-1 rounded-1"
        :class="{ 'bg-#3b3b3b': item.selected }"
        @click="selectGroup(item)"
      >
        <div>
          {{ item.groupName }}
        </div>
        <n-button text size="small" class="ml-2" @click.stop="deleteGroup(item)">
          <n-icon style="font-size: 24px">
            <Delete></Delete>
          </n-icon>
        </n-button>
      </div>
      <ul class="pl-6 mt-2">
        <li
          v-for="itemChild in item.nodes"
          :key="itemChild.nodeId"
          size="small"
          text
          class="cursor-pointer hover:bg-#3b3b3b transition-all duration-200 px-2 py-1 rounded-1"
          @click="selectGroupItem(itemChild)"
        >
          {{ itemChild.nodeType }}
        </li>
      </ul>
    </div>
  </PanelScrollbar>
</template>

<script setup lang="ts">
import { useDataStore, useMapStore } from "@/stores/";
import PanelScrollbar from "@/components/SvgEditor/Common/PanelScrollbar/index.vue";
import type { IGroupData, INode } from "@/types";
import Delete from "@/assets/images/icons/Delete.svg?component";
import { getMapGroupData, setGroupSelected } from "@/utils/tools";
import { useDialog } from "naive-ui";
import { deleteMapGroupData } from "@/utils/http/apis";

const dialog = useDialog();
const dataStore = useDataStore();
const mapStore = useMapStore();

const selectGroup = (item: IGroupData) => {
  setGroupSelected(item);
};

const selectGroupItem = (item: INode) => {
  console.log("🚀 ~ selectGroupItem ~ item:", item);
};

const deleteGroup = (group: IGroupData) => {
  dialog.warning({
    title: "警告",
    content: "确定删除当前数据吗？",
    positiveText: "确定",
    negativeText: "取消",
    maskClosable: false,
    closeOnEsc: false,
    onPositiveClick: async () => {
      const mapId = mapStore.mapInfo!.mapId;
      await deleteMapGroupData(group.groupId);
      window.$message.success("删除成功");
      getMapGroupData(mapId);
    }
  });
};
</script>

<style></style>
