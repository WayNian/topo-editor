<template>
  <n-modal
    v-model:show="isVisible"
    preset="dialog"
    :title="tabActive === 'folder' ? '创建文件夹' : '创建文件'"
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
    <n-tabs v-model:value="tabActive" type="line" animated>
      <n-tab-pane name="folder" tab="文件夹">
        <n-form
          ref="folderFormRef"
          :model="folderModel"
          :rules="folderRules"
          label-placement="top"
          label-width="auto"
          require-mark-placement="right-hanging"
        >
          <n-form-item label="名称" path="folderName">
            <n-input v-model:value="folderModel.folderName" placeholder="文件名称" />
          </n-form-item>
          <n-form-item label="目录" path="menuId">
            <n-cascader
              v-model:value="fileModel.menuId"
              placeholder="所属目录"
              expand-trigger="hover"
              :options="store.menuCascaderList"
              check-strategy="all"
              filterable
            />
          </n-form-item> </n-form
      ></n-tab-pane>
      <n-tab-pane name="file" tab="文件">
        <n-form
          ref="fileFormRef"
          :model="fileModel"
          :rules="fileRules"
          label-placement="top"
          label-width="auto"
          require-mark-placement="right-hanging"
        >
          <n-grid :cols="24" :x-gap="15">
            <n-form-item-gi :span="24" label="名称" path="mapName">
              <n-input v-model:value="fileModel.mapName" placeholder="文件名称" />
            </n-form-item-gi>

            <n-form-item-gi :span="12" label="宽高" path="width">
              <n-input-number v-model:value="fileModel.width" :min="0" placeholder="请输入宽度" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" path="height">
              <n-input-number v-model:value="fileModel.height" :min="0" placeholder="请输入高度" />
            </n-form-item-gi>

            <n-form-item-gi :span="24" label="目录" path="menuId">
              <n-cascader
                v-model:value="fileModel.menuId"
                placeholder="所属目录"
                expand-trigger="hover"
                :options="store.menuCascaderList"
                check-strategy="all"
                filterable
              />
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </n-tab-pane>
    </n-tabs>
  </n-modal>
</template>

<script setup lang="ts">
import { useTopoStore } from "@/stores/topo";
import type { FormInst } from "naive-ui";
import { ref } from "vue";
import { useFolder } from "@/hooks/menu/useFolder";
import { useFile } from "@/hooks/menu/useFile";

const store = useTopoStore();

const { folderModel, folderRules, resetFolderModel, createFolder } = useFolder();
const { fileModel, fileRules, resetFileMoel, createFile } = useFile();

const tabActive = ref("folder");
const folderFormRef = ref<FormInst | null>(null);
const fileFormRef = ref<FormInst | null>(null);

const isVisible = ref(false);

const show = (menuId: string) => {
  fileModel.value.menuId = menuId || "0";
  folderModel.value.menuId = menuId || "0";
  isVisible.value = true;
};
const hide = () => {
  console.log("----");

  isVisible.value = false;
  tabActive.value = "folder";
  resetFileMoel();
  resetFolderModel();
};

const finish = () => {
  hide();
  window.$message.success("创建成功");
  store.getMenuList();
};

const submit = () => {
  if (tabActive.value === "folder") {
    folderFormRef.value?.validate((errors) => {
      if (!errors) {
        createFolder().then(finish);
      }
    });
  } else {
    fileFormRef.value?.validate((errors) => {
      if (!errors) {
        createFile().then(finish);
      }
    });
  }
  return false;
};

defineExpose({
  show
});
</script>

<style scoped></style>
