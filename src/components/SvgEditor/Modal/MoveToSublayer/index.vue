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
    <p class="text-xs my-2 text-yellow-400 opacity-70">
      提示：选择“其他”，会将节点、连线所属子图层移除
    </p>
    <n-select v-model:value="sublayerId" placeholder="请选择子图层" :options="options" />
  </n-modal>
</template>

<script setup lang="ts">
import { useMapStore } from "@/stores";
import type { ISublayer } from "@/types";
import { addNodesLinksToSublayer } from "@/utils/tools";
import type { FormInst } from "naive-ui";
import { computed, ref } from "vue";

const mapStore = useMapStore();

const isVisible = ref(false);
const formRef = ref<FormInst | null>(null);
const sublayerId = ref<string>("other");

const options = computed(() => {
  console.log("mapStore.sublayers", mapStore.sublayers);

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
  const sublayer = mapStore.sublayers.find(
    (item) => item.sublayerId === sublayerId.value
  ) as ISublayer;
  addNodesLinksToSublayer(sublayer);
  hide();
  //   formRef.value?.validate().then(async () => {});
  return false;
};

defineExpose({
  show
});
</script>
