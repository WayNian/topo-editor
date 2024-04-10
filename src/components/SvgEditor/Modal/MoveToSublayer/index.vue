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
    <p class="text-xs my-2 text-yellow-400 opacity-70">输入新的名称，保存将创建新的图层</p>
    <n-select
      v-model:value="sublayerId"
      filterable
      tag
      placeholder="请选择子图层"
      :options="options"
    />
  </n-modal>
</template>

<script setup lang="ts">
import { useMapStore } from "@/stores";
import type { ISublayerAddModel } from "@/types";
import { addNodesLinksToSublayer } from "@/utils/tools";
import { computed, ref } from "vue";

const mapStore = useMapStore();

const isVisible = ref(false);
const sublayerId = ref<string>("");

const options = computed(() => {
  return mapStore.sublayers
    .filter((ele) => ele.sublayerId !== "other")
    .map((item) => ({
      label: item.sublayerName,
      value: item.sublayerId
    }));
});
const show = () => {
  isVisible.value = true;
};

const hide = () => {
  isVisible.value = false;
};

const submit = async () => {
  let sublayer: ISublayerAddModel | undefined = mapStore.sublayers.find(
    (item) => item.sublayerId === sublayerId.value
  );

  if (!sublayer) {
    sublayer = {
      sublayerName: sublayerId.value,
      isVisible: 1,
      listOrder: 0
    };
  }

  hide();
  addNodesLinksToSublayer(sublayer);
  return false;
};

defineExpose({
  show
});
</script>
