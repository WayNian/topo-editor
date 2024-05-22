<template>
  <n-modal
    v-model:show="isVisible"
    preset="dialog"
    title="新增编组"
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
      ref="menuFormRef"
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
import type { FormInst } from "naive-ui";
import { ref } from "vue";

const menuFormRef = ref<FormInst | null>(null);
const mapFormRef = ref<FormInst | null>(null);

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

const submit = () => {
  mapFormRef.value?.validate((errors) => {
    if (errors) return;
  });
  return false;
};

defineExpose({
  show
});
</script>
