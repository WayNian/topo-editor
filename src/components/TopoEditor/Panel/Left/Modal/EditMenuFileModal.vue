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
    <n-tabs v-model:value="tabActive" type="line" animated>
      <n-tab-pane name="menu" tab="文件夹" :disabled="isMenuDisabled">
        <n-form
          ref="menuFormRef"
          :model="menuModel"
          :rules="menuRules"
          label-placement="top"
          label-width="auto"
          require-mark-placement="right-hanging"
        >
          <n-form-item label="名称" path="menuName">
            <n-input v-model:value="menuModel.menuName" placeholder="文件名称" />
          </n-form-item>
          <n-form-item label="目录" path="menuId">
            <n-cascader
              v-model:value="mapModel.menuId"
              placeholder="所属目录"
              expand-trigger="hover"
              :options="store.menuCascaderList"
              check-strategy="all"
              filterable
            />
          </n-form-item> </n-form
      ></n-tab-pane>
      <n-tab-pane name="map" tab="文件" :disabled="isMapDisabled">
        <n-form
          ref="mapFormRef"
          :model="mapModel"
          :rules="mapRules"
          label-placement="top"
          label-width="auto"
          require-mark-placement="right-hanging"
        >
          <n-grid :cols="24" :x-gap="15">
            <n-form-item-gi :span="24" label="名称" path="mapName">
              <n-input v-model:value="mapModel.mapName" placeholder="文件名称" />
            </n-form-item-gi>

            <n-form-item-gi :span="12" label="宽高" path="width">
              <n-input-number v-model:value="mapModel.width" :min="0" placeholder="请输入宽度" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" path="height">
              <n-input-number v-model:value="mapModel.height" :min="0" placeholder="请输入高度" />
            </n-form-item-gi>

            <n-form-item-gi :span="24" label="目录" path="menuId">
              <n-cascader
                v-model:value="mapModel.menuId"
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
import { useCanvasStore } from "@/stores/canvas";
import type { FormInst, TreeOption } from "naive-ui";
import { computed, ref } from "vue";
import { useMenu } from "@/hooks/menu/useMenu";
import { useMap } from "@/hooks/menu/useMap";
import type { IMapModel, IMenuModel } from "@/types";

const store = useCanvasStore();
const tabActive = ref("menu");
const menuFormRef = ref<FormInst | null>(null);
const mapFormRef = ref<FormInst | null>(null);

const isVisible = ref(false);
const isEditRf = ref(false);
const isMenuDisabled = ref(false);
const isMapDisabled = ref(false);

const { menuModel, menuRules, resetMenuModel, addMenuFunc, updateMenuFunc } = useMenu();
const { mapModel, mapRules, resetMapModel, addMapFunc, updateMapFunc } = useMap();

const title = computed(() => {
  const statusMsg = isEditRf.value ? "编辑" : "创建";
  const typeMsg = tabActive.value === "menu" ? "文件夹" : "文件";
  return `${statusMsg}${typeMsg}`;
});
const resetDisabled = () => {
  isMenuDisabled.value = false;
  isMapDisabled.value = false;
};

const initData = (isEdit: boolean, val: TreeOption | null) => {
  isEditRf.value = isEdit;
  resetDisabled();
  if (isEdit && val) {
    if (val.isMenu) {
      isMapDisabled.value = true;
      tabActive.value = "menu";
      menuModel.value = val.raw as IMenuModel;
    } else {
      isMenuDisabled.value = true;
      tabActive.value = "map";
      mapModel.value = val.raw as IMapModel;
      const [width, height] = mapModel.value.mapSize.split("*").map(Number);
      mapModel.value.width = width;
      mapModel.value.height = height;
    }
  } else {
    let menuId = "0";
    if (val) {
      menuId = val.key as string;
    }
    resetMapModel();
    resetMenuModel();
    mapModel.value.menuId = menuId;
    menuModel.value.menuParId = menuId;
  }
};

const show = (isEdit: boolean, val: TreeOption | null) => {
  initData(isEdit, val);
  isVisible.value = true;
};

const hide = () => {
  isVisible.value = false;
  tabActive.value = "menu";
  resetMapModel();
  resetMenuModel();
};

const finish = () => {
  hide();
  window.$message.success("创建成功");
  store.getMenuList();
};

const submit = () => {
  if (tabActive.value === "menu") {
    menuFormRef.value?.validate((errors) => {
      if (errors) return;
      if (isEditRf.value) {
        updateMenuFunc().then(finish);
      } else {
        addMenuFunc().then(finish);
      }
    });
  } else {
    mapFormRef.value?.validate((errors) => {
      if (errors) return;
      if (isEditRf.value) {
        updateMapFunc().then(finish);
      } else {
        addMapFunc().then(finish);
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
@/stores/canvas
