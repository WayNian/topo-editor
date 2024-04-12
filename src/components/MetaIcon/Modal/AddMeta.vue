<template>
  <n-modal
    v-model:show="isVisible"
    preset="dialog"
    title="创建对象"
    size="huge"
    :bordered="false"
    :show-icon="false"
    :close-on-esc="false"
    :maskClosable="false"
    positive-text="确认"
    negative-text="取消"
    @positive-click="submit"
    @negative-click="hide"
    style="margin-top: 20vh; width: 500px"
  >
    <n-form
      ref="groupFormRef"
      :model="groupModel"
      :rules="groupRules"
      label-placement="left"
      label-width="80"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="类型编码" path="objType">
        <n-input v-model:value="groupModel.objType" placeholder="类型编码" />
      </n-form-item>
      <n-form-item label="对象名称" path="objName">
        <n-input v-model:value="groupModel.objName" placeholder="对象名称" />
      </n-form-item>
      <n-form-item label="所属分组" path="groupId">
        <n-select
          v-model:value="groupModel.groupId"
          placeholder="所属分组"
          :options="metaStore.groupSelectOptions"
        />
      </n-form-item>
      <n-form-item label="关联组件" path="compClass">
        <n-select v-model:value="groupModel.compClass" placeholder="关联组件" :options="[]" />
      </n-form-item>
      <n-form-item label="对象图标" path="objImg">
        <n-upload
          accept="image/*"
          list-type="image-card"
          :max="1"
          :default-file-list="previewFileList"
          :custom-request="customRequest"
        >
          <n-button>选择文件</n-button>
        </n-upload>
      </n-form-item>
      <!-- <n-form-item label="图标比例" path="groupName">
        <n-select v-model:value="groupModel.selectValue" placeholder="图标比例" :options="[]" />
      </n-form-item> -->
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import type { FormInst, UploadCustomRequestOptions, UploadFileInfo } from "naive-ui";
import { computed, ref } from "vue";
import { useMetaStore } from "@/stores";
import { addMeta, uploadFile } from "@/utils/http/apis";
import type { MetaModel } from "@/types";

const metaStore = useMetaStore();
const groupFormRef = ref<FormInst | null>(null);
const previewFileList = ref([]);
const groupModel = ref<MetaModel>({
  objType: "",
  objName: "",
  groupId: "",
  compClass: "",
  objImg: "",
  imgScale: "1"
});

const isVisible = ref(false);
const groupRules = {
  objType: [{ required: true, message: "请输入类型编码", trigger: "blur" }],
  objName: [{ required: true, message: "请输入对象名称", trigger: "blur" }],
  groupId: [{ required: true, message: "请选择所属分组", trigger: "change" }],
  objImg: [
    { key: "objImg", required: true, message: "请选择对象图标", trigger: ["change", "blur"] }
  ]
};

const customRequest = ({ file, onFinish, onError }: UploadCustomRequestOptions) => {
  const formData = new FormData();
  formData.append("file", file.file as File);

  groupModel.value.objImg = "res";

  uploadFile(formData)
    .then((res) => {
      groupModel.value.objImg = res;
      onFinish();
    })
    .catch(() => {
      groupModel.value.objImg = "";
      window.$message.error("上传失败");
      onError();
    })
    .finally(() => {
      groupFormRef.value?.validate(
        () => {},
        (rule) => {
          return rule?.key === "objImg";
        }
      );
    });
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
    addMeta(groupModel.value).then(() => {
      finish();
    });
  });

  return false;
};

defineExpose({
  show
});
</script>
