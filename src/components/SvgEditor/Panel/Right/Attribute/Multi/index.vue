<template>
  <n-collapse :default-expanded-names="['1', '2', '3']">
    <n-collapse-item title="图元" name="2">
      <Item title="图元">
        <n-select
          :value="dataStore.currentNode?.nodeType"
          filterable
          placeholder="选择图元"
          size="small"
          :options="metaStore.metaOptions"
          @update:value="changeMetaIcon"
        />
      </Item>
    </n-collapse-item>
  </n-collapse>
</template>

<script setup lang="ts">
import { useDataStore, useMetaStore } from "@/stores";
import Item from "../Item/index.vue";
import { ref, watch } from "vue";
import { formatObject } from "@/utils/tools";
import type { IMetaItem } from "@/types";
import { drawNodes, removeNode } from "@/utils/editor/draw";
import { updateNode } from "@/utils/http/apis";

const dataStore = useDataStore();
const metaStore = useMetaStore();
const style = ref<Record<string, any>>({});

watch(
  () => dataStore.currentNode?.nodeId,
  (val) => {
    if (!val) return;
    style.value = formatObject(dataStore.currentNode?.nodeStyles);
  }
);

const changeMetaIcon = (value: string, { row }: { row: IMetaItem }) => {
  if (!dataStore.nodesSelected.length) return;
  dataStore.nodesSelected.forEach((node) => {
    node.nodeType = value;
    style.value.image = row.objImg;
    node.nodeStyles = JSON.stringify(style.value);
    node.style = style.value;
    removeNode(node.nodeId);
  });

  updateNodeAttribute();
};

const updateNodeAttribute = () => {
  if (!dataStore.nodesSelected.length) return;
  drawNodes();
  updateNode(dataStore.nodesSelected);
};
</script>

<style scoped></style>
