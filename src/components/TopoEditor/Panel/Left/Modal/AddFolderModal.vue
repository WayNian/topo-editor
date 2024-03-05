<template>
  <n-modal
    v-model:show="showModal"
    preset="dialog"
    title="新增文件夹"
    size="huge"
    :bordered="false"
    :show-icon="false"
    :close-on-esc="false"
    :maskClosable="false"
    positive-text="确认"
    negative-text="取消"
    @positive-click="submit"
    @negative-click="hide"
  >
    <n-form
      ref="formRef"
      :model="folderModel"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="名称" path="folderName">
        <n-input v-model:value="folderModel.folderName" placeholder="文件名称" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import type { FormInst, FormRules } from "naive-ui";
import { ref } from "vue";

const folderModel = ref({
  folderName: ""
});
const formRef = ref<FormInst | null>(null);
const showModal = ref(false);

const rules: FormRules = {
  folderName: {
    required: true,
    message: "请输入文件夹名称",
    trigger: ["input", "blur"]
  }
};

const show = () => {
  showModal.value = true;
};
const hide = () => {
  showModal.value = false;
  folderModel.value.folderName = "";
};

const submit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      hide();
    }
  });
  return false;
};

defineExpose({
  show
});
</script>

<style scoped></style>
