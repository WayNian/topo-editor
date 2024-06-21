<template>
  <n-modal
    v-model:show="isVisible"
    preset="dialog"
    title="数据配置"
    :bordered="false"
    :show-icon="false"
    :close-on-esc="false"
    :maskClosable="false"
    positive-text="确认"
    negative-text="取消"
    @positive-click="submit"
    @negative-click="hide"
    style="margin-top: 15vh; width: 800px"
  >
    <SvgIcon ref="svgIconRef" @onIdSelect="onIdSelect"></SvgIcon>
    <CondintionList ref="condintionListRef"></CondintionList>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, nextTick, toRaw } from "vue";
import type { ITreeOption } from "@/utils/tools/data/modules/bind";
import SvgIcon from "../DataBind/SvgIcon.vue";
import CondintionList from "../DataBind/CondintionList.vue";
import type { INode } from "@/types";
import { useDataStore } from "@/stores";

const dataStore = useDataStore();

const isVisible = ref(false);
const svgIconRef = ref<InstanceType<typeof SvgIcon> | null>(null);
const condintionListRef = ref<InstanceType<typeof CondintionList> | null>(null);

const onIdSelect = (val: ITreeOption) => {
  condintionListRef.value?.initData(val);
};

const data = ref<INode>();
const show = () => {
  isVisible.value = true;
  nextTick(() => {
    data.value = structuredClone(toRaw(dataStore.currentNode) as INode);
    svgIconRef.value?.initData(data.value);
  });
};

const hide = () => {
  isVisible.value = false;
};

const submit = () => {
  console.log("data", dataStore.currentNode, data.value);
};

defineExpose({
  show
});
</script>

<style scoped></style>
