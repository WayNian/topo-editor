<template>
  <Item title="ID">
    <p class="truncate" :title="dataStore.currentNode?.nodeId">
      {{ dataStore.currentNode?.nodeId }}
    </p>
  </Item>
  <Item title="类型">
    <p class="truncate">{{ dataStore.currentNode?.nodeType }}</p>
  </Item>
  <n-divider />
  <n-collapse>
    <n-collapse-item title="基础" name="1">
      <Item title="尺寸">
        <n-flex :wrap="false">
          <n-input-number
            :value="dataStore.currentNode?.width"
            size="small"
            :min="0"
            @update:value="updateSize('width', $event)"
          />
          <n-input-number
            :value="dataStore.currentNode?.height"
            size="small"
            :min="0"
            @update:value="updateSize('height', $event)"
          />
        </n-flex>
      </Item>
      <Item title="位置">
        <n-flex :wrap="false">
          <n-input-number
            :value="dataStore.currentNode?.x"
            size="small"
            @update:value="updatePosition('x', $event)"
          />
          <n-input-number
            :value="dataStore.currentNode?.y"
            size="small"
            @update:value="updatePosition('y', $event)"
          />
        </n-flex>
      </Item>
    </n-collapse-item>
    <n-collapse-item title="其他" name="2">
      <Item title="图元">
        <n-flex :wrap="false">
          <n-select
            :value="dataStore.currentNode?.nodeType"
            filterable
            placeholder="选择图元"
            size="small"
            :options="metaStore.metaOptions"
            @update:value="changeMetaIcon"
          />
        </n-flex>
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
  if (!dataStore.currentNode) return;
  dataStore.currentNode.nodeType = value;
  style.value.image = row.objImg;
  dataStore.currentNode.nodeStyles = JSON.stringify(style.value);
  dataStore.currentNode.style = style.value;
  removeNode(dataStore.currentNode.nodeId);
  updateNodeAttribute();
};

const updateSize = (key: "width" | "height", value: number) => {
  if (!dataStore.currentNode) return;
  dataStore.currentNode[key] = value;
  updateNodeAttribute();
};

const updatePosition = (key: "x" | "y", value: number) => {
  if (!dataStore.currentNode) return;
  dataStore.currentNode[key] = value;
  updateNodeAttribute();
};

const updateNodeAttribute = () => {
  if (!dataStore.currentNode) return;

  dataStore.currentNode.nodePosition = `${dataStore.currentNode.x},${dataStore.currentNode.y}`;
  dataStore.currentNode.nodeSize = `${dataStore.currentNode.width}*${dataStore.currentNode.height}`;
  dataStore.currentNode.nodeStyles = JSON.stringify(style.value);

  drawNodes();
  updateNode([dataStore.currentNode]);
};
</script>

<style scoped></style>
