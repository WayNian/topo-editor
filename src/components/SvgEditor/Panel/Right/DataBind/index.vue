<template>
  <DataBindItem
    v-for="item in dataStore.groupSelected"
    :key="item.groupId"
    :data="item"
    @onShowDataBindModal="showDataBindModal($event, item)"
  ></DataBindItem>
  <Item title="Value">
    <n-input
      :value="dataStore.currentNode?.domId"
      placeholder="Value"
      size="small"
      @update:value="onAttributeChange($event, 'domId')"
    />
  </Item>
  <DataBindModal ref="dataBindModalRef" @onValueUpdate="onValueUpdate"></DataBindModal>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import { computed, ref, watch, watchEffect } from "vue";
import { useDataStore, useMapStore } from "@/stores";
import { SvgIcon, type ISvgDataItem } from "@/utils/components/SvgIcon";
import DataBindModal from "@/components/Common/Modal/DataBind/index.vue";
import DataBindItem from "@/components/SvgEditor/Panel/Right/Attribute/Item/DataBindItem.vue";
import { updateMapGroupData, updateNode } from "@/utils/http/apis";
import type { IGroupData, IGroupDataBind } from "@/types";
import { getGroupDataList } from "@/utils/tools";
const dataStore = useDataStore();
const dataBindModalRef = ref<InstanceType<typeof DataBindModal> | null>(null);

let svg: SvgIcon;

const mapStore = useMapStore();
const currentGroup = ref<IGroupData>();
const cureentType = ref<string>("");

watch(
  () => dataStore.currentNode?.nodeId,
  () => {
    svg = new SvgIcon(
      {
        svgContent: dataStore.currentNode?.svgData || "",
        svgContainerId: "svgCon",
        script: dataStore.currentNode?.script || ""
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

const showDataBindModal = (nodeType: string, group: IGroupData) => {
  cureentType.value = nodeType;
  currentGroup.value = group;
  dataBindModalRef.value?.show(true);
};

// 更新节点属性
const updateGroupAttribute = async () => {
  if (!currentGroup.value) return;
  const { nodes, links } = currentGroup.value;
  const mapId = mapStore.mapInfo!.mapId;

  await updateMapGroupData({
    ...currentGroup.value,
    mapId,
    topoMapsGroupDataList: getGroupDataList(nodes, links)
  });

  window.$message.success("更新成功");
};

const onValueUpdate = ({
  key,
  detailId
}: {
  value: string | null;
  key: string | null;
  detailId: string | null;
}) => {
  currentGroup.value!.bindData?.forEach((item) => {
    if (item.nodeType === cureentType.value) {
      item.key = key;
      //   item.value = value!;
      item.detailId = detailId;
    }
  });

  updateGroupAttribute();
};

// 更新节点属性
const updateNodeAttributeByHttp = () => {
  if (!dataStore.currentNode) return;
  updateNode([dataStore.currentNode]);
};

const onAttributeChange = (value: string, key: "domId") => {
  if (!dataStore.currentNode) return;
  dataStore.currentNode[key] = value;
  updateNodeAttributeByHttp();
};
</script>

<style></style>
