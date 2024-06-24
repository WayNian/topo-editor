<template>
  <n-modal
    v-model:show="isVisible"
    preset="dialog"
    title="数据配置"
    :bordered="false"
    :show-icon="false"
    :close-on-esc="false"
    :maskClosable="false"
    style="margin-top: 15vh; width: 800px"
  >
    <SvgIcon ref="svgIconRef" @onIdSelect="onIdSelect"></SvgIcon>
    <CondintionList ref="condintionListRef"></CondintionList>
    <template #footer> 尾部 </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, nextTick, toRaw } from "vue";
import type { ITreeOption } from "@/utils/tools/data/modules/bind";
import SvgIcon from "./SvgIcon.vue";
import CondintionList from "./CondintionList.vue";
import type { IMetaIconDataBind, IMetaItem } from "@/types";
import { useDataStore, useMetaStore } from "@/stores";

const dataStore = useDataStore();

const isVisible = ref(false);
const svgIconRef = ref<InstanceType<typeof SvgIcon> | null>(null);
const condintionListRef = ref<InstanceType<typeof CondintionList> | null>(null);

const onIdSelect = (val?: ITreeOption) => {
  condintionListRef.value?.onIdChange(val);
};

const iconMetaInfo = ref<IMetaItem>();

const show = async (val: IMetaItem) => {
  isVisible.value = true;
  nextTick(() => {
    svgIconRef.value?.initData(val);
    condintionListRef.value?.initData(val);
  });
};

const hide = () => {
  isVisible.value = false;
};

const submit = () => {
  console.log("data", dataStore.currentNode, iconMetaInfo.value);
};

defineExpose({
  show
});
</script>

<style scoped></style>
