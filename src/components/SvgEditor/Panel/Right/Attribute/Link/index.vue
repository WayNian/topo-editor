<template>
  <Item title="ID">
    <p class="truncate" :title="dataStore.currentLink?.linkId">
      {{ dataStore.currentLink?.linkId }}
    </p>
  </Item>
  <n-divider />
  <n-collapse :default-expanded-names="['1', '2', '3']">
    <n-collapse-item title="连线点" name="1">
      <Item title="路径">
        <p>
          {{ dataStore.currentLink?.linkPath }}
        </p>
      </Item>
    </n-collapse-item>
    <n-collapse-item title="样式" name="2">
      <Item title="线宽">
        <n-input-number
          :default-value="dataStore.currentLink?.linkWidth"
          size="small"
          :min="0"
          placeholder="请输入宽度"
          @update:value="updateLinkWidth"
        >
        </n-input-number>
      </Item>
      <Item title="线型">
        <n-select
          :default-value="dataStore.currentLink?.dashedLink"
          :options="linkTypeOptions"
          placeholder="请选择线型"
          @update:value="updateDashedLink"
        />
      </Item>
      <Item title="颜色">
        <n-color-picker
          :default-value="getRgb(dataStore.currentLink?.style.stroke)"
          :show-preview="true"
          :modes="['hex', 'rgb']"
          size="small"
          @update:value="updateLinkStyle('stroke', $event)"
          @complete="updateLinkAttribute"
        />
      </Item>
    </n-collapse-item>
    <!-- <n-collapse-item title="自定义样式" name="3">
      <Item
        v-for="(value, key) in dataStore.currentLink?.style"
        :key="key"
        :title="StyleNameMap[key] ? StyleNameMap[key].title : '12'"
      >
        <n-color-picker
          v-if="StyleNameMap[key].type === 'color'"
          :default-value="getRgb(value + '')"
          :show-preview="true"
          :modes="['hex', 'rgb']"
          size="small"
          @update:value="updateLinkColorAttribute(key, $event)"
          @complete="updateLinkStyle(key, $event)"
        />
        <n-input-number
          v-else-if="StyleNameMap[key].type === 'number'"
          :default-value="parseFloat(value + '')"
          size="small"
          :min="getRange(key)[0]"
          :max="getRange(key)[1]"
          placeholder="请输入"
          @update:value="updateLinkStyle(key, $event)"
        >
          <template #suffix v-if="StyleNameMap[key].suffix">
            {{ StyleNameMap[key].suffix }}
          </template>
        </n-input-number>
      </Item>
    </n-collapse-item> -->
  </n-collapse>
</template>

<script setup lang="ts">
import { useDataStore } from "@/stores";
import { attrUpdateLink } from "@/utils/editor/attr";
import { updateLink } from "@/utils/http/apis";
import { getRgb } from "@/utils/tools";

const dataStore = useDataStore();

const linkTypeOptions = [
  { label: "实线", value: "solid" },
  { label: "虚线", value: "dashed" },
  { label: "点线", value: "dotted" }
];

// 颜色选择器
const updateLinkColorAttribute = (key: string, value: string) => {
  if (!dataStore.currentLink) return;
  dataStore.currentLink.style[key] = value;
  attrUpdateLink(dataStore.currentLink);
};

// 更新线宽
const updateLinkWidth = (value: number) => {
  if (!dataStore.currentLink) return;
  dataStore.currentLink.linkWidth = value;
  dataStore.currentLink.style["stroke-width"] = value;

  updateLinkAttribute();
};

// 更新线型
const updateDashedLink = (value: string) => {
  if (!dataStore.currentLink) return;
  dataStore.currentLink.dashedLink = value;
  dataStore.currentLink.style["stroke-dasharray"] = value === "solid" ? "none" : "5,5";

  updateLinkAttribute();
};

const formatStyleFill = () => {
  if (!dataStore.currentLink) return;
  if (!dataStore.currentLink.style["fill"]) {
    dataStore.currentLink.style["fill"] = "none";
  }
};

const updateLinkStyle = (key: string, value: string | number) => {
  if (!dataStore.currentLink) return;
  dataStore.currentLink.style[key] = value;

  formatStyleFill();
  attrUpdateLink(dataStore.currentLink);
};

const updateLinkAttribute = () => {
  if (!dataStore.currentLink) return;
  formatStyleFill();
  dataStore.currentLink.linkStyles = JSON.stringify(dataStore.currentLink.style);
  attrUpdateLink(dataStore.currentLink);
  updateLink([dataStore.currentLink]);
};
</script>

<style scoped></style>
