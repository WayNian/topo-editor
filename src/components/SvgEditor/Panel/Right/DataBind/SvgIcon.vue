<template>
  <div class="flex flex-1">
    <n-form ref="formRef" label-placement="top" class="mr-10 flex-shrink-0">
      <n-form-item label="数据key">
        <n-input placeholder="数据key">
          <template #suffix>
            <n-button text style="font-size: 18px">
              <n-icon>
                <Settings />
              </n-icon>
            </n-button>
          </template>
        </n-input>
      </n-form-item>
      <n-form-item label="数据类型">
        <n-select :options="dataTypeOptions" placeholder="数据类型"> </n-select>
      </n-form-item>
    </n-form>
    <n-scrollbar style="max-height: 160px">
      <div class="flex flex-1 pl-10">
        <n-tree
          class="w-50"
          block-line
          :data="idOptions"
          :node-props="nodeProps"
          :selected-keys="selectedKeys"
        />
      </div>
    </n-scrollbar>

    <div class="w-40 h-40 flex justify-center items-center flex-shrink-0">
      <div id="iconDataBind" class="w-40 h-40" v-html="svgData"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import {
  bindIconData,
  cancelHightlight,
  hightlightPart,
  type ITreeOption
} from "@/utils/tools/data/modules/bind";
import Settings from "@/assets/images/icons/Settings.svg?component";
import type { INode } from "@/types";

const dataTypeOptions = [
  { label: "文本", value: "text" },
  { label: "数字", value: "number" },
  { label: "布尔", value: "boolean" }
];

const emit = defineEmits<{
  onIdSelect: [idOption: ITreeOption];
}>();

const info = ref<INode>();
const idOptions = ref<ITreeOption[]>([]);
const expandedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const svgData = ref<string>();

const initData = (data?: INode) => {
  info.value = data;
  if (data?.svgData) {
    svgData.value = data.svgData;
    nextTick(() => {
      const ids = bindIconData(data);
      idOptions.value = formatIdOptions(ids);
    });
  } else {
    idOptions.value = [];
  }
};

const formatIdOptions = (ids: ITreeOption[]) => {
  return ids.map((ele) => {
    if (ele.children?.length) {
      ele.children = formatIdOptions(ele.children);
      expandedKeys.value.push(ele.label as string);
    } else {
      delete ele.children;
    }
    return ele;
  });
};

const nodeProps = ({ option }: { option: ITreeOption }) => {
  return {
    onClick() {
      if (option.label === selectedKeys.value[0]) {
        selectedKeys.value = [];
        cancelHightlight();
      } else {
        hightlightPart(option.label as string);
        selectedKeys.value = [option.label as string];
        emit("onIdSelect", option);
      }
    },
    onMouseenter() {
      hightlightPart(option.label as string);
    }
  };
};

defineExpose({
  initData
});
</script>

<style></style>
