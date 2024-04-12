<template>
  <n-modal
    v-model:show="isVisible"
    preset="dialog"
    title="创建分组"
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
      label-placement="top"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="名称" path="groupName">
        <n-input v-model:value="groupModel.groupName" placeholder="分组名称" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import type { FormInst } from "naive-ui";
import { ref } from "vue";
import { useMetaStore } from "@/stores";
import { addGroup } from "@/utils/http/apis";

const metaStore = useMetaStore();
const groupFormRef = ref<FormInst | null>(null);
const groupModel = ref({
  groupName: ""
});

const isVisible = ref(false);
const groupRules = {
  groupName: [{ required: true, message: "请输入分组名称", trigger: "blur" }]
};
const show = () => {
  isVisible.value = true;
};

const hide = () => {
  isVisible.value = false;
};

const finish = () => {
  hide();
  metaStore.getMetaList();
  window.$message.success("创建成功");
};

const submit = () => {
  groupFormRef.value?.validate((errors) => {
    if (errors) return;
    addGroup(groupModel.value.groupName).then(() => {
      finish();
    });
  });

  return false;
};

defineExpose({
  show
});
</script>
