<template>
  <PanelScrollbar>
    <n-collapse :trigger-areas="['arrow']">
      <n-collapse-item
        v-for="(item, index) in dataStore.groups"
        :title="item.groupName"
        :key="index"
        display-directive="if"
      >
        <template #header>
          <span
            class="w-full cursor-pointer hover:bg-#3b3b3b transition-all duration-200 px-2 py-1 rounded-1"
            :class="{ 'bg-#3b3b3b': item.selected }"
            @click="selectGroup(item)"
            >{{ item.groupName }}</span
          >
        </template>
        <template #header-extra>
          <div>
            <n-button
              text
              size="small"
              class="ml-2"
              style="font-size: 16px"
              @click.stop="updateGroup(item)"
            >
              <n-icon>
                <Edit></Edit>
              </n-icon>
            </n-button>
            <n-button
              text
              size="small"
              class="ml-2"
              style="font-size: 16px"
              @click.stop="deleteGroup(item)"
            >
              <n-icon>
                <Delete></Delete>
              </n-icon>
            </n-button>
          </div>
        </template>
        <ul class="pl-6">
          <li
            v-for="itemChild in item.nodes"
            :key="itemChild.nodeId"
            size="small"
            text
            class="cursor-pointer hover:bg-#3b3b3b transition-all duration-200 px-2 py-1 rounded-1"
            :class="{ 'bg-#3b3b3b': itemChild.selected }"
            @click="selectGroupItem(itemChild)"
            @mouseenter="selectPreviewGroupItem(itemChild)"
          >
            {{ itemChild.nodeType }}
          </li>
        </ul>
      </n-collapse-item>
    </n-collapse>

    <!-- <div v-for="(item, index) in dataStore.groups" :key="index" class="flex flex-col px-2">
      <div
        class="flex justify-between cursor-pointer hover:bg-#3b3b3b transition-all duration-200 px-2 py-1 rounded-1"
        :class="{ 'bg-#3b3b3b': item.selected }"
        @click="selectGroup(item)"
      >
        <div>
          {{ item.groupName }}
        </div>
        <div>
          <n-button
            text
            size="small"
            class="ml-2"
            style="font-size: 16px"
            @click.stop="updateGroup(item)"
          >
            <n-icon>
              <Edit></Edit>
            </n-icon>
          </n-button>
          <n-button
            text
            size="small"
            class="ml-2"
            style="font-size: 16px"
            @click.stop="deleteGroup(item)"
          >
            <n-icon>
              <Delete></Delete>
            </n-icon>
          </n-button>
        </div>
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
    </div> -->
  </PanelScrollbar>
  <GroupEditModal ref="groupEditModalRef"></GroupEditModal>
</template>

<script setup lang="ts">
import { ref, toRaw } from "vue";
import { useDialog } from "naive-ui";

import Delete from "@/assets/images/icons/Delete.svg?component";
import Edit from "@/assets/images/icons/Edit.svg?component";
import PanelScrollbar from "@/components/SvgEditor/Common/PanelScrollbar/index.vue";
import GroupEditModal from "@/components/SvgEditor/Modal/Group/Edit.vue";
import { useDataStore, useMapStore } from "@/stores/";
import type { IGroupData, INode } from "@/types";
import { deleteMapGroupData } from "@/utils/http/apis";
import { getMapGroupData, setGroupSelected, setNodesSelected } from "@/utils/tools";

const dialog = useDialog();
const dataStore = useDataStore();
const mapStore = useMapStore();

const groupEditModalRef = ref<InstanceType<typeof GroupEditModal> | null>(null);

const selectGroup = (item: IGroupData) => {
  setGroupSelected(item);
};

const selectGroupItem = (item: INode) => {
  setNodesSelected(item.selected ? undefined : item);
};

const selectPreviewGroupItem = (item: INode) => {
  // setNodesSelected(item);
};
const updateGroup = (group: IGroupData) => {
  groupEditModalRef.value?.show(window.structuredClone(toRaw(group)));
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
