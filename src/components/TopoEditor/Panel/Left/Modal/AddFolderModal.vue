<template>
  <n-modal
    v-model:show="showModal"
    preset="dialog"
    title="创建文件夹"
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
      ref="formRef"
      :model="folderModel"
      :rules="rules"
      label-placement="top"
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
import { useTopo } from "@/stores/topo";
import { addMenuList } from "@/utils/http/apis/menu";
import type { FormInst, FormRules } from "naive-ui";
import { ref } from "vue";

const store = useTopo();
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
      addMenuList({
        menuName: folderModel.value.folderName,
        menuParId: "0"
      }).then(() => {
        hide();
        window.$message.success("创建文件夹成功");
        store.getMenuList();
      });
    }
  });
  return false;
};

defineExpose({
  show
});
</script>

<style scoped></style>
