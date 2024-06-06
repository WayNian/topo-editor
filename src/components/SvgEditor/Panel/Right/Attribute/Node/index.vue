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
  <n-collapse :default-expanded-names="['1', '2', '3', '4']">
    <n-collapse-item title="基础" name="1">
      <Item title="尺寸">
        <n-flex :wrap="false">
          <n-input-number
            :value="dataStore.currentNode?.width"
            size="small"
            :min="0"
            :show-button="false"
            @update:value="updateSize('width', $event)"
          />
          <n-input-number
            :value="dataStore.currentNode?.height"
            size="small"
            :min="0"
            :show-button="false"
            @update:value="updateSize('height', $event)"
          />
        </n-flex>
      </Item>
      <Item title="位置">
        <n-flex :wrap="false">
          <n-input-number
            :value="dataStore.currentNode?.x"
            size="small"
            :show-button="false"
            @update:value="updatePosition('x', $event)"
          />
          <n-input-number
            :value="dataStore.currentNode?.y"
            size="small"
            :show-button="false"
            @update:value="updatePosition('y', $event)"
          />
        </n-flex>
      </Item>
      <Item title="角度">
        <n-input-number
          :value="dataStore.currentNode?.rotate"
          size="small"
          :min="-180"
          :max="180"
          @update:value="updatePosition('rotate', $event)"
        />
      </Item>
    </n-collapse-item>
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
    <n-collapse-item title="样式" name="3">
      <Item title="填充" v-if="dataStore.currentNode?.nodeType === 'text'">
        <n-color-picker
          :default-value="dataStore.currentNode?.style.fill"
          size="small"
          :modes="['rgb', 'hex']"
          @update:value="updateStyles('fill', $event)"
        />
      </Item>
    </n-collapse-item>
    <n-collapse-item title="文字" name="4" v-if="dataStore.currentNode?.nodeType === 'text'">
      <Item title="内容">
        <n-input
          :value="dataStore.currentNode?.nodeText"
          size="small"
          placeholder="请输入文字"
          @update:value="updateContent"
        />
      </Item>
      <!-- 字体、大小、颜色、旋转角度 -->
      <Item title="大小">
        <n-input-number
          :default-value="parseFloat(dataStore.currentNode?.style['font-size'] || '14px')"
          size="small"
          :min="0"
          placeholder="请输入文字大小"
          @update:value="updateStyles('font-size', $event)"
        />
      </Item>
      <Item title="颜色">
        <n-color-picker
          :default-value="dataStore.currentNode?.style.fill"
          size="small"
          :modes="['rgb', 'hex']"
          @update:value="updateStyles('fill', $event)"
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
import { updateNodeById, removeNode, drawNodes } from "@/utils/editor/draw";
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

const updateNodeAttribute = () => {
  if (!dataStore.currentNode) return;
  updateNodeById(dataStore.currentNode.nodeId);
  updateNode([dataStore.currentNode]);
};

const changeMetaIcon = (value: string, { row }: { row: IMetaItem }) => {
  if (!dataStore.currentNode) return;
  dataStore.currentNode.nodeType = value;
  style.value.image = row.objImg;
  dataStore.currentNode.nodeStyles = JSON.stringify(style.value);
  dataStore.currentNode.style = style.value;
  removeNode(dataStore.currentNode.nodeId);
  drawNodes();
  updateNode([dataStore.currentNode]);
};

const updateSize = (key: "width" | "height", value: number) => {
  if (!dataStore.currentNode) return;
  dataStore.currentNode[key] = value;
  updateNodeAttribute();
};

const updateContent = (value: string) => {
  if (!dataStore.currentNode) return;
  dataStore.currentNode.nodeText = value;
  updateNodeAttribute();
};

const updatePosition = (key: "x" | "y" | "rotate", value: number) => {
  if (!dataStore.currentNode) return;
  dataStore.currentNode[key] = value;
  updateNodeAttribute();
};

const updateStyles = (key: string, value: string) => {
  if (!dataStore.currentNode) return;
  if (key === "fill") {
    dataStore.currentNode.fontColor = value;
  }
  if (key === "font-size") {
    dataStore.currentNode.style["font-size"] = value + "px";
  } else {
    dataStore.currentNode.style[key] = value;
  }
  dataStore.currentNode.nodeStyles = JSON.stringify(dataStore.currentNode.style);
  updateNodeAttribute();
};
</script>

<style scoped></style>
