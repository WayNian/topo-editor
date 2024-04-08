<template>
  <n-modal
    v-model:show="isVisible"
    preset="dialog"
    title="移动到子图层"
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
    <n-select v-model:value="sublayerId" placeholder="请选择子图层" :options="options" />
  </n-modal>
</template>

<script setup lang="ts">
import { useMapStore } from "@/stores";
import { addNodesLinksToSublayer } from "@/utils/tools";
import type { FormInst } from "naive-ui";
import { computed, ref } from "vue";

const mapStore = useMapStore();

const isVisible = ref(false);
const formRef = ref<FormInst | null>(null);
const sublayerId = ref<string>("other");

const options = computed(() => {
  return mapStore.sublayers.map((item) => ({
    label: item.sublayerName,
    value: item.sublayerId
  }));
});
const show = () => {
  console.log("----");

  isVisible.value = true;
};

const hide = () => {
  isVisible.value = false;
};

const submit = () => {
  const sublayer = mapStore.sublayers.find((item) => item.sublayerId === sublayerId.value);
  sublayer && addNodesLinksToSublayer(sublayer);
  formRef.value?.validate().then(async () => {});
  return false;
};

defineExpose({
  show
});
</script>
