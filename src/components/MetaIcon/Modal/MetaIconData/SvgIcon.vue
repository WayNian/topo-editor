<template>
  <div class="flex flex-1 mb-4">
    <n-scrollbar style="max-height: 160px" class="w-50">
      <n-tree
        class="w-50"
        block-line
        :data="idOptions"
        :node-props="nodeProps"
        :selected-keys="selectedKeys"
      />
    </n-scrollbar>

    <div class="w-40 h-40 ml-10">
      <div id="iconDataBind" class="w-40 h-40" v-html="svgData"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick,ref } from "vue";

import type { IMetaItem } from "@/types";
import {
  bindIconData,
  cancelHightlight,
  hightlightPart,
  type ITreeOption
} from "@/utils/tools/data/modules/bind";

const emit = defineEmits<{
  onIdSelect: [idOption?: ITreeOption];
}>();

const iconMetaInfo = ref<IMetaItem>();
const idOptions = ref<ITreeOption[]>([]);
const expandedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const svgData = ref<string>();

const initData = (data?: IMetaItem) => {
  iconMetaInfo.value = data;
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
        emit("onIdSelect");
      } else {
        hightlightPart(option.label as string);
        selectedKeys.value = [option.label as string];
        emit("onIdSelect", option);
      }
    }
    // onMouseenter() {
    //   hightlightPart(option.label as string);
    // }
  };
};

defineExpose({
  initData
});
</script>

<style></style>
