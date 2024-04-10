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
    <n-checkbox-group v-model:value="checkValue" @update:value="handleUpdateValue">
      <n-space item-style="display: flex;">
        <n-checkbox value="node" label="节点" />
        <n-checkbox value="link" label="连线" />
      </n-space>
    </n-checkbox-group>
  </n-modal>
</template>

<script setup lang="ts">
import { useDataStore, useMapStore, useMenuStore } from "@/stores";
import type { ISublayer, ISublayerDeleteModel } from "@/types";
import { drawNodesLinks } from "@/utils/editor/draw";
import { deleteSublayer } from "@/utils/http/apis";
import { addNodesLinksToSublayer } from "@/utils/tools";
import { computed, ref } from "vue";

const mapStore = useMapStore();
const menuStore = useMenuStore();
const dataStore = useDataStore();

const isVisible = ref(false);
const activeName = ref("list");
const sublayerId = ref<string>("");

const nodeIds = ref<string[]>([]);
const linkIds = ref<string[]>([]);

const checkValue = ref<string[]>([]);

const show = (sublayer: ISublayer) => {
  sublayerId.value = sublayer.sublayerId;
  isVisible.value = true;
};

const hide = () => {
  isVisible.value = false;
  sublayerId.value = "";
  nodeIds.value = [];
  linkIds.value = [];
  checkValue.value = [];
};

const submit = () => {
  const mapId = menuStore.mapInfo!.mapId;
  const p = [];
  if (checkValue.value.includes("node") && nodeIds.value.length) {
    const nodeParams: ISublayerDeleteModel = {
      mapId,
      sublayerId: sublayerId.value,
      objType: 1,
      objIdList: nodeIds.value
    };
    p.push(deleteSublayer(nodeParams));
  }
  if (checkValue.value.includes("link") && linkIds.value.length) {
    const linkParams: ISublayerDeleteModel = {
      mapId,
      sublayerId: sublayerId.value,
      objType: 2,
      objIdList: linkIds.value
    };
    p.push(deleteSublayer(linkParams));
  }

  Promise.all(p).then(async () => {
    hide();
    window.$message.success("移除成功");
    await dataStore.fetchNodeLinkList(mapId);
    mapStore.getSublayers(mapId);
    dataStore.renewNodesLinks();
    drawNodesLinks();
  });
  return false;
};

const handleUpdateValue = (val: string[]) => {
  nodeIds.value = [];
  linkIds.value = [];
  if (val.includes("node")) {
    nodeIds.value = dataStore.nodesTotal
      .filter(
        (item) =>
          item.sublayerList &&
          item.sublayerList.some((sublayer) => sublayer.sublayerId === sublayerId.value)
      )
      .map((item) => item.nodeId);
  }
  if (val.includes("link")) {
    linkIds.value = dataStore.linksTotal
      .filter(
        (item) =>
          item.sublayerList &&
          item.sublayerList.some((sublayer) => sublayer.sublayerId === sublayerId.value)
      )
      .map((item) => item.linkId);
  }
};

defineExpose({
  show
});
</script>
