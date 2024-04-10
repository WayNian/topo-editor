<template>
  <n-modal
    v-model:show="isVisible"
    preset="dialog"
    title="从子图层移除"
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
    <n-select v-model:value="sublayerId" filterable placeholder="请选择子图层" :options="options" />
  </n-modal>
</template>

<script setup lang="ts">
import { useDataStore, useMapStore, useMenuStore } from "@/stores";
import type { ISublayerDeleteModel } from "@/types";
import { drawLinks, drawNodes } from "@/utils/editor/draw";
import { deleteSublayer } from "@/utils/http/apis";
import { computed, ref } from "vue";

const mapStore = useMapStore();
const menuStore = useMenuStore();
const dataStore = useDataStore();

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
  const mapId = menuStore.mapInfo!.mapId;

  if (dataStore.currentNode) {
    const nodeParams: ISublayerDeleteModel = {
      mapId,
      sublayerId: sublayerId.value,
      objType: 1,
      objIdList: [dataStore.currentNode.nodeId]
    };

    await deleteSublayer(nodeParams);
    dataStore.currentNode.sublayerList = dataStore.currentNode.sublayerList.filter(
      (item) => item.sublayerId !== sublayerId.value
    );
    drawNodes();
  }
  if (dataStore.currentLink) {
    const linkParams: ISublayerDeleteModel = {
      mapId,
      sublayerId: sublayerId.value,
      objType: 2,
      objIdList: [dataStore.currentLink.linkId]
    };

    await deleteSublayer(linkParams);
    dataStore.currentLink.sublayerList = dataStore.currentLink.sublayerList.filter(
      (item) => item.sublayerId !== sublayerId.value
    );
    drawLinks();
  }

  window.$message.success("移除成功");
  hide();
  return false;
};

defineExpose({
  show
});
</script>
