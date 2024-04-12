<template>
  <n-modal
    v-model:show="isVisible"
    preset="dialog"
    :title="title"
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
import { computed, ref } from "vue";
import { useMetaStore } from "@/stores";
import { addGroup, updateGroup } from "@/utils/http/apis";
import type { IGroupModel } from "@/types";

const metaStore = useMetaStore();
const groupFormRef = ref<FormInst | null>(null);
const groupModel = ref({
  groupId: "",
  groupName: ""
});

const isVisible = ref(false);
const isEdit = ref(false);
const groupRules = {
  groupName: [{ required: true, message: "请输入分组名称", trigger: "blur" }]
};

const title = computed(() => (isEdit.value ? "编辑分组" : "新增分组"));

const show = (val?: IGroupModel) => {
  isVisible.value = true;
  isEdit.value = !!val;
  if (val) {
    groupModel.value = { ...val };
  }
};

const hide = () => {
  isVisible.value = false;
  groupModel.value = {
    groupId: "",
    groupName: ""
  };
};

const finish = () => {
  const msg = isEdit.value ? "更新成功" : "创建成功";
  hide();
  metaStore.getMetaList();
  window.$message.success(msg);
};

const submit = () => {
  groupFormRef.value?.validate((errors) => {
    if (errors) return;
    const fn = isEdit.value ? updateGroup : addGroup;
    fn(groupModel.value).then(() => {
      finish();
    });
  });

  return false;
};

defineExpose({
  show
});
</script>
