<template>
  <Item title="ID">
    <p class="truncate" :title="dataStore.currentLink?.linkId">
      {{ dataStore.currentLink?.linkId }}
    </p>
  </Item>
  <n-divider />
  <n-collapse :default-expanded-names="['1', '2', '3']">
    <n-collapse-item title="连线点" name="2">
      <Item title="d">
        <p>
          {{ dataStore.currentLink?.linkPath }}
        </p>
      </Item>
    </n-collapse-item>
    <n-collapse-item title="自定义样式" name="3">
      <Item
        v-for="(value, key) in dataStore.currentLink?.style"
        :key="key"
        :title="StyleNameMap[key].title"
      >
        <n-color-picker
          v-if="StyleNameMap[key].type === 'color'"
          :default-value="getRgb(value)"
          :show-preview="true"
          :modes="['hex', 'rgb']"
          size="small"
          @update:value="updateLinkAttribute(key, $event)"
        />
        <n-input-number
          v-else-if="StyleNameMap[key].type === 'number'"
          :default-value="parseFloat(value)"
          size="small"
          :min="getRange(key)[0]"
          :max="getRange(key)[1]"
          placeholder="请输入"
          @update:value="updateLinkAttribute(key, $event)"
        >
          <template #suffix v-if="StyleNameMap[key].suffix">
            {{ StyleNameMap[key].suffix }}
          </template>
        </n-input-number>
      </Item>
    </n-collapse-item>
  </n-collapse>
</template>

<script setup lang="ts">
import { useDataStore } from "@/stores";
import { attrUpdateLink } from "@/utils/editor/attr";
import { getRgb } from "@/utils/tools";

const dataStore = useDataStore();

const StyleNameMap: {
  [key: string]: {
    title: string;
    type: string;
    suffix?: string;
    range?: number[];
    options?: { label: string; value: string }[];
  };
} = {
  fill: {
    title: "填充",
    type: "color"
  },
  stroke: {
    title: "描边",
    type: "color"
  },
  "stroke-width": {
    title: "描边宽度",
    type: "number",
    range: [0],
    suffix: "px"
  },
  "stroke-dasharray": {
    title: "描边样式",
    type: "select",
    options: [
      {
        label: "实线",
        value: "solid"
      },
      {
        label: "虚线",
        value: "dashed"
      },
      {
        label: "点线",
        value: "dotted"
      }
    ]
  },
  opacity: {
    title: "透明度",
    type: "number",
    range: [0, 1]
  },
  "font-family": {
    title: "字体",
    type: "select",
    options: [
      {
        label: "宋体",
        value: "宋体"
      },
      {
        label: "黑体",
        value: "黑体"
      },
      {
        label: "楷体",
        value: "楷体"
      }
    ]
  },
  "font-size": {
    title: "字体大小",
    type: "number"
  },
  "font-weight": {
    title: "字体粗细",
    type: "select",
    options: [
      {
        label: "正常",
        value: "normal"
      },
      {
        label: "粗体",
        value: "bold"
      }
    ]
  }
};

const getRange = (key: string) => {
  return StyleNameMap[key].range || [];
};

const updateLinkAttribute = (key: string, value: string) => {
  if (dataStore.currentLink) {
    dataStore.currentLink.style[key] = value;
    attrUpdateLink(dataStore.currentLink);
  }
};
</script>

<style scoped></style>
