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
      <!-- <n-form-item label="关联组件" path="compClass">
        <n-select v-model:value="groupModel.compClass" placeholder="关联组件" :options="[]" />
      </n-form-item> -->
      <n-form-item label="脚本" path="script">
        <n-button @click="setScript">设置</n-button>
      </n-form-item>
      <n-form-item label="对象图标" path="objImg">
        <n-upload
          accept="image/*"
          list-type="image-card"
          :max="1"
          :default-file-list="previewFileList"
          :custom-request="customRequest"
          @remove="onImageRemove"
        >
          <n-button>选择文件</n-button>
        </n-upload>
      </n-form-item>
      <!-- <n-form-item label="图标比例" path="groupName">
        <n-select v-model:value="groupModel.selectValue" placeholder="图标比例" :options="[]" />
      </n-form-item> -->
    </n-form>
  </n-modal>
  <CodeMirrorModal
    ref="codeMirrorModalRef"
    @onValueUpdate="onCodeMirrorValueUpdate"
  ></CodeMirrorModal>
</template>

<script setup lang="ts">
import type { FormInst, UploadCustomRequestOptions } from "naive-ui";
import { computed, ref } from "vue";
import { useMetaStore } from "@/stores";
import { addMeta, updateMeta, uploadFile } from "@/utils/http/apis";
import type { IMetaItem, IMetaModel } from "@/types";
import CodeMirrorModal from "@/components/SvgEditor/Panel/Left/CodeMirror/index.vue";

const metaStore = useMetaStore();
const groupFormRef = ref<FormInst | null>(null);
const codeMirrorModalRef = ref<InstanceType<typeof CodeMirrorModal> | null>(null);
const previewFileList = ref<
  {
    id?: string;
    name: string;
    url: string;
    status: string;
  }[]
>([]);
const groupModel = ref<IMetaModel>({
  objType: "",
  objName: "",
  groupId: "",
  compClass: "",
  script: "",
  objImg: "",
  imgScale: "1",
  svgData: ""
});

const isVisible = ref(false);
const isEdit = ref(false);
const groupRules = {
  objType: [{ required: true, message: "请输入类型编码", trigger: "blur" }],
  objName: [{ required: true, message: "请输入对象名称", trigger: "blur" }],
  groupId: [{ required: true, message: "请选择所属分组", trigger: "change" }],
  objImg: [
    { key: "objImg", required: true, message: "请选择对象图标", trigger: ["change", "blur"] }
  ]
};

const title = computed(() => (isEdit.value ? "编辑对象" : "新增对象"));

const customRequest = ({ file, onFinish, onError }: UploadCustomRequestOptions) => {
  const formData = new FormData();
  formData.append("file", file.file as File);

  if (!file.file) return;
  if (file.type === "image/svg+xml") {
    const reader = new FileReader();
    reader.onload = function (e) {
      if (e.target) {
        groupModel.value.svgData = e.target.result as string; // 这里是SVG文件的内容
      }
    };

    reader.readAsText(new Blob([file.file])); // 以文本格式读取文件
  }

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

const onImageRemove = () => {
  groupModel.value.objImg = "";
};

const setScript = () => {
  codeMirrorModalRef.value?.show(groupModel.value.script);
};

const onCodeMirrorValueUpdate = (content: string) => {
  groupModel.value.script = content;
};

const show = (val?: IMetaItem) => {
  isVisible.value = true;
  isEdit.value = !!val;
  if (val) {
    const {
      objType,
      objName,
      groupId = "",
      compClass = "",
      script = "",
      objImg,
      imgScale = "",
      svgData = ""
    } = val;
    groupModel.value = {
      objType,
      objName,
      groupId,
      compClass,
      script,
      objImg,
      imgScale,
      svgData
    };
    previewFileList.value = [
      {
        name: objName,
        url: objImg,
        status: "finished"
      }
    ];
  }
};

const hide = () => {
  isVisible.value = false;
  groupModel.value = {
    objType: "",
    objName: "",
    groupId: "",
    compClass: "",
    script: "",
    objImg: "",
    imgScale: "1",
    svgData: ""
  };
};

const finish = () => {
  const msg = isEdit.value ? "更新成功" : "创建成功";
  hide();
  metaStore.getMetaData();
  window.$message.success(msg);
};

const submit = () => {
  groupFormRef.value?.validate((errors) => {
    if (errors) return;
    const fn = isEdit.value ? updateMeta : addMeta;
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
