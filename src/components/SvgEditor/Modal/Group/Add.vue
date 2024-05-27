<template>
  <n-modal
    v-model:show="isVisible"
    preset="dialog"
    title="新增分组"
    size="huge"
    :bordered="false"
    :show-icon="false"
    :close-on-esc="false"
    :maskClosable="false"
    positive-text="确认"
    negative-text="取消"
    @positive-click="submit"
    @negative-click="hide"
    style="margin-top: 20vh"
  >
    <n-form
      ref="groupFormRef"
      :model="groupModel"
      :rules="groupRules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="名称" path="groupName">
        <n-input v-model:value="groupModel.groupName" placeholder="文件名称" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { useDataStore, useMapStore } from "@/stores";
import { addMapGroupData, getMapGroupData } from "@/utils/http/apis";
import { updataDataGroupId } from "@/utils/tools";
import type { FormInst } from "naive-ui";
import { ref } from "vue";

const dataStore = useDataStore();
const mapStore = useMapStore();

const groupFormRef = ref<FormInst | null>(null);

const isVisible = ref(false);
const groupModel = ref({
  groupName: ""
});

const groupRules = {
  groupName: [{ required: true, message: "请输入名称", trigger: "blur" }]
};

const show = () => {
  isVisible.value = true;
};

const hide = () => {
  isVisible.value = false;
};

const getfroupDataList = () => {
  const { nodesSelected, linksSelected } = dataStore;
  const list: {
    dataId: string;
    dataType: "node" | "link";
  }[] = [];
  nodesSelected.forEach((node) => {
    list.push({
      dataId: node.nodeId,
      dataType: "node"
    });
  });

  linksSelected.forEach((link) => {
    list.push({
      dataId: link.linkId,
      dataType: "link"
    });
  });

  return list;
};

const addGroup = async () => {
  const mapId = mapStore.mapInfo!.mapId;
  const params = {
    mapId,
    groupName: groupModel.value.groupName,
    groupDescription: groupModel.value.groupName,
    topoMapsGroupDataList: getfroupDataList()
  };
  const groupId = await addMapGroupData(params);
  window.$message.success("添加成功");
  updataDataGroupId(groupId);
  getMapGroupData(mapId);
};
const submit = () => {
  groupFormRef.value?.validate((errors) => {
    if (errors) return;
    addGroup();
  });
  return false;
};

defineExpose({
  show
});
</script>
