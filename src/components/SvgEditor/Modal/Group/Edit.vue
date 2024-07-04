<template>
  <n-modal
    v-model:show="isVisible"
    preset="dialog"
    title="编辑分组数据"
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
      :model="groupForm"
      :rules="groupRules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="名称" path="groupName">
        <n-input v-model:value="groupForm.groupName" placeholder="文件名称" />
      </n-form-item>
      <n-form-item label="描述" path="groupDescription">
        <n-input v-model:value="groupForm.groupDescription" placeholder="描述" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { useMapStore } from "@/stores";
import type { IGroupData } from "@/types";
import { updateMapGroupData } from "@/utils/http/apis";
import { getGroupDataList, getMapGroupData } from "@/utils/tools";
import type { FormInst } from "naive-ui";
import { ref } from "vue";

const mapStore = useMapStore();

const groupFormRef = ref<FormInst | null>(null);

const isVisible = ref(false);
const groupForm = ref<IGroupData>({
  groupId: "",
  groupName: "",
  groupDescription: "",
  dataIds: []
});

const groupRules = {
  groupName: [{ required: true, message: "请输入名称", trigger: "blur" }]
};

const show = (group: IGroupData) => {
  isVisible.value = true;
  groupForm.value = group;
};

const hide = () => {
  isVisible.value = false;
  groupForm.value.groupName = "";
};

const addGroup = async () => {
  const mapId = mapStore.mapInfo!.mapId;
  const { nodes, links } = groupForm.value;

  const params = {
    ...groupForm.value,
    mapId,
    topoMapsGroupDataList: getGroupDataList(nodes, links)
  };
  console.log("🚀 ~ addGroup ~ params", params);

  await updateMapGroupData(params);
  window.$message.success("更新成功");
  hide();
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
