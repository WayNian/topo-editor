<template>
  <div>
    <Item title="K/V" tooltip="数据Key和Value">
      <n-grid x-gap="4" :cols="24" class="flex items-center">
        <n-gi :span="10">
          <n-input
            :value="dataStore.currentNode?.bindData.key || ''"
            placeholder="key"
            size="small"
            @update:value="onBindMapDataChange($event, 'key')"
          />
        </n-gi>
        <n-gi :span="10">
          <n-input
            :value="dataStore.currentNode?.bindData.value || ''"
            placeholder="value"
            size="small"
            @update:value="onBindMapDataChange($event, 'value')"
          />
        </n-gi>
        <n-gi :span="4">
          <n-button text size="small" class="ml-2" @click="showDataBind">
            <n-icon style="font-size: 24px">
              <Settings></Settings>
            </n-icon>
          </n-button>
        </n-gi>
      </n-grid>
    </Item>
  </div>
  <div id="svgCon"></div>
  <NButton @click="updateSvg">测试</NButton>
  <DataBindModal ref="dataBindModalRef" @onValueUpdate="onValueUpdate"></DataBindModal>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import { ref, watch, watchEffect } from "vue";
import { useDataStore } from "@/stores";
import { SvgIcon, type ISvgDataItem } from "@/utils/components/SvgIcon";
import DataBindModal from "@/components/Common/Modal/DataBind/index.vue";
import Settings from "@/assets/images/icons/Settings.svg?component";
import { updateNode } from "@/utils/http/apis";

const dataStore = useDataStore();
const dataBindModalRef = ref<InstanceType<typeof DataBindModal> | null>(null);

// http://172.19.139.246:6818/dataSource/dataPreviewController/dataPreview/previewByExtractId

let svg: SvgIcon;
watch(
  () => dataStore.currentNode?.nodeId,
  () => {
    svg = new SvgIcon(
      {
        svgContent: dataStore.currentNode?.svgData || "",
        svgContainerId: "svgCon"
      },
      []
    );
  }
);

const updateSvg = () => {
  const data: ISvgDataItem[] = [
    {
      domId: "bg-1",
      value: Math.random() * 10,
      column: "string",
      dataType: "number",
      conditions: [
        {
          // opacity
          tagName: "circle",
          comparison: ">",
          threshold: 7,
          style: {
            data: 0.5,
            type: "opacity"
          }
        },
        {
          tagName: "circle",
          comparison: ">",
          threshold: 7,
          style: {
            data: "red",
            type: "fill"
          }
        },
        {
          tagName: "circle",
          comparison: "<",
          threshold: 7,
          style: {
            data: "blue",
            type: "fill"
          }
        },
        {
          tagName: "path",
          comparison: ">",
          threshold: 5,
          style: {
            data: "yellow",
            type: "fill"
          }
        },
        {
          tagName: "path",
          comparison: "<",
          threshold: 5,
          style: {
            data: "green",
            type: "fill"
          }
        }
      ]
    }
  ];

  svg.update(data);
};

const showDataBind = () => {
  dataBindModalRef.value?.show(true);
};

const updateNodeAttribute = () => {
  if (!dataStore.currentNode) return;
  updateNode([dataStore.currentNode]);
};

const onValueUpdate = ({ value, key }: { value: string | null; key: string | null }) => {
  dataStore.currentNode!.bindData.key = key || "";
  dataStore.currentNode!.bindData.value = value || "";
  updateNodeAttribute();
};

const onBindMapDataChange = (value: string, key: string) => {
  dataStore.currentNode!.bindData[key] = value;
  updateNodeAttribute();
};
</script>

<style></style>
