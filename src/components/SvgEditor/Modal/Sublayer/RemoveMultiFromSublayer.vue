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
    <n-form ref="formRef" label-placement="left" :model="formValue" :rules="rules">
      <n-form-item path="checkValue">
        <n-checkbox-group v-model:value="formValue.checkValue" @update:value="handleUpdateValue">
          <n-space item-style="display: flex;">
            <n-checkbox value="node" label="节点" />
            <n-checkbox value="link" label="连线" />
          </n-space>
        </n-checkbox-group>
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { useDataStore, useMapStore } from "@/stores";
import type { ISublayer, ISublayerDeleteModel } from "@/types";
import { drawNodesLinks } from "@/utils/editor/draw";
import { deleteSublayer } from "@/utils/http/apis";
import type { FormInst } from "naive-ui";
import { ref } from "vue";

const mapStore = useMapStore();
const dataStore = useDataStore();

const formRef = ref<FormInst | null>(null);
const isVisible = ref(false);
const sublayerId = ref<string>("");

const nodeIds = ref<string[]>([]);
const linkIds = ref<string[]>([]);

const formValue = ref<{
  checkValue: string[];
}>({
  checkValue: []
});

const rules = {
  checkValue: {
    type: "array",
    required: true,
    message: "请选择类型",
    trigger: "change"
  }
};

const show = (sublayer: ISublayer) => {
  sublayerId.value = sublayer.sublayerId;
  isVisible.value = true;
};

const hide = () => {
  isVisible.value = false;
  sublayerId.value = "";
  nodeIds.value = [];
  linkIds.value = [];
  formValue.value.checkValue = [];
};

const submit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      const mapId = mapStore.mapInfo!.mapId;
      const p = [];
      if (formValue.value.checkValue.includes("node") && nodeIds.value.length) {
        const nodeParams: ISublayerDeleteModel = {
          mapId,
          sublayerId: sublayerId.value,
          objType: 1,
          objIdList: nodeIds.value
        };
        p.push(deleteSublayer(nodeParams));
      }
      if (formValue.value.checkValue.includes("link") && linkIds.value.length) {
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
    }
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
