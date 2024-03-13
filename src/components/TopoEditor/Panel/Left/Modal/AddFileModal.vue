<template>
  <n-modal
    v-model:show="showModal"
    preset="dialog"
    title="创建文件"
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
      :model="fileModel"
      :rules="rules"
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
            placeholder="没啥用的值"
            expand-trigger="hover"
            :options="store.menuCascaderList"
            check-strategy="all"
            filterable
            @update:value="handleUpdateValue"
          />
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { useTopo } from "@/stores/topo";
import type { IMapModel } from "@/types";
import { addMap } from "@/utils/http/apis/menu";
import type { CascaderOption, FormInst, FormItemRule, FormRules } from "naive-ui";
import { ref } from "vue";

const store = useTopo();
const fileModel = ref<IMapModel>({
  mapName: "",
  mapSize: "",
  width: 0,
  height: 0,
  background: "",
  mapIndex: 1,
  externalBind: {},
  internalBind: {},
  description: {},
  menuId: "0"
});
const formRef = ref<FormInst | null>(null);
const showModal = ref(false);

const rules: FormRules = {
  mapName: {
    required: true,
    message: "请输入文件夹名称",
    trigger: ["input", "blur"]
  },
  width: {
    required: true,
    validator(rule: FormItemRule, value: number) {
      if (value <= 0) {
        return new Error("宽度需要大于0");
      }
      return true;
    },
    trigger: ["input", "blur"]
  },
  height: {
    required: true,
    validator(rule: FormItemRule, value: number) {
      if (value <= 0) {
        return new Error("高度需要大于0");
      }
      return true;
    },
    trigger: ["input", "blur"]
  }
};

const show = (menuId: string) => {
  fileModel.value.menuId = menuId || "0";
  showModal.value = true;
};
const hide = () => {
  showModal.value = false;
  fileModel.value.mapName = "";
  fileModel.value.width = 0;
  fileModel.value.height = 0;
  fileModel.value.menuId = "0";
};

const submit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      addMap({
        ...fileModel.value,
        mapSize: `${fileModel.value.width}*${fileModel.value.height}`
      }).then(() => {
        hide();
        window.$message.success("创建文件成功");
        store.getMenuList();
      });
    }
  });
  return false;
};

const handleUpdateValue = (value: string, option: CascaderOption) => {
  console.log(value, option);
};

defineExpose({
  show
});
</script>

<style scoped></style>
