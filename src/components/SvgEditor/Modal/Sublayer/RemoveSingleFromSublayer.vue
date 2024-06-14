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
      <n-form-item path="sublayerId">
        <n-select
          v-model:value="formValue.sublayerId"
          filterable
          placeholder="请选择子图层"
          :options="options"
        />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { useDataStore, useMapStore } from "@/stores";
import type { ISublayerDeleteModel } from "@/types";
import { drawLinks, drawNodes } from "@/utils/editor/draw";
import { deleteSublayer } from "@/utils/http/apis";
import type { FormInst } from "naive-ui";
import { computed, ref } from "vue";

const mapStore = useMapStore();
const dataStore = useDataStore();

const formRef = ref<FormInst | null>(null);
const isVisible = ref(false);
const formValue = ref({
  sublayerId: ""
});

const rules = {
  sublayerId: {
    required: true,
    message: "请选择子图层",
    trigger: "blur"
  }
};

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
  const mapId = mapStore.mapInfo!.mapId;

  if (dataStore.currentNode) {
    const nodeParams: ISublayerDeleteModel = {
      mapId,
      sublayerId: formValue.value.sublayerId,
      objType: 1,
      objIdList: [dataStore.currentNode.nodeId]
    };

    await deleteSublayer(nodeParams);
    dataStore.currentNode.sublayerList = dataStore.currentNode.sublayerList.filter(
      (item) => item.sublayerId !== formValue.value.sublayerId
    );
    // drawNodes();
  }
  if (dataStore.currentLink) {
    const linkParams: ISublayerDeleteModel = {
      mapId,
      sublayerId: formValue.value.sublayerId,
      objType: 2,
      objIdList: [dataStore.currentLink.linkId]
    };

    await deleteSublayer(linkParams);
    dataStore.currentLink.sublayerList = dataStore.currentLink.sublayerList.filter(
      (item) => item.sublayerId !== formValue.value.sublayerId
    );
    // drawLinks();
  }

  window.$message.success("移除成功");
  hide();
  return false;
};

defineExpose({
  show
});
</script>
