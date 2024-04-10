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
    <n-tabs type="line" animated v-model:value="activeName">
      <n-tab-pane name="list" tab="列表">
        <p class="text-xs my-2 text-yellow-400 opacity-70">提示：选择“其他”，会将所属子图层移除</p>
        <n-select v-model:value="sublayerId" placeholder="请选择子图层" :options="options" />
      </n-tab-pane>
      <n-tab-pane name="new" tab="新建">
        <n-input v-model:value="newSublayer" type="text" placeholder="请输入子图层名称" />
      </n-tab-pane>
    </n-tabs>
  </n-modal>
</template>

<script setup lang="ts">
import { useMapStore } from "@/stores";
import type { ISublayer, ISublayerAddModel } from "@/types";
import { addNodesLinksToSublayer } from "@/utils/tools";
import { computed, ref } from "vue";

const mapStore = useMapStore();

const isVisible = ref(false);
const activeName = ref("list");
const newSublayer = ref<string>("");
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
  const sublayer: ISublayerAddModel =
    activeName.value === "new"
      ? {
          sublayerName: newSublayer.value,
          isVisible: 1,
          listOrder: 0
        }
      : (mapStore.sublayers.find(
          (item) => item.sublayerId === sublayerId.value
        ) as ISublayerAddModel);
  hide();
  addNodesLinksToSublayer(sublayer);
  return false;
};

defineExpose({
  show
});
</script>
