<template>
  <PanelScrollbar>
    <n-checkbox-group @update:value="handleUpdateValue" class="px-3">
      <div
        v-for="(item, index) in mapStore.subLayers"
        :key="index"
        class="flex items-center justify-between mb-3"
      >
        <n-checkbox :value="item.sublayerId" :label="item.sublayerName" />
        <div v-if="item.sublayerId !== 'other'">
          <n-button text style="font-size: 20px" class="mx-3" @click="handleCheckInfo(item)">
            <n-icon>
              <InformationCircleOutline />
            </n-icon>
          </n-button>

          <n-button text style="font-size: 20px" @click="handleDelete()">
            <n-icon>
              <DeleteForeverOutlined />
            </n-icon>
          </n-button>
        </div>
      </div>
    </n-checkbox-group>
  </PanelScrollbar>
  <SubLayerModal ref="subLayerModalRef" />
</template>

<script setup lang="ts">
import type { ISubLayer } from "@/types";
import { useDataStore, useMapStore, useMenuStore } from "@/stores";
import { ref, watch } from "vue";
import PanelScrollbar from "@/components/SvgEditor/Common/PanelScrollbar/index.vue";
import SubLayerModal from "@/components/SvgEditor/Panel/Left/Modal/SubLayer/index.vue";
import InformationCircleOutline from "@/assets/images/icons/InformationCircleOutline.svg?component";
import DeleteForeverOutlined from "@/assets/images/icons/DeleteForeverOutlined.svg?component";

const menuStore = useMenuStore();
const mapStore = useMapStore();
const dataStore = useDataStore();

const subLayerModalRef = ref<InstanceType<typeof SubLayerModal> | null>(null);

watch(
  () => menuStore.mapInfo,
  (val) => {
    mapStore.getSubLayers(val?.mapId);
  }
);

const handleAddSubLayer = () => {
  const mapId = menuStore.mapInfo?.mapId;
  if (!mapId) return;
  mapStore.addSubLayers({
    mapId: mapId,
    sublayerName: "新建图层1"
    // sublayerList: [
    //   {
    //     sublayerId: dataStore.currentNode?.sublayerId,
    //     objType: 1,
    //     objId: dataStore.currentNode?.nodeId
    //   }
    // ]
  });
};

// 根据子图层， 显示页面中的元素
const handleUpdateValue = (val: string[]) => {
  mapStore.subLayerIds = val;
  dataStore.filterNodesLinks(mapStore.subLayerIds);
};

const handleCheckInfo = (item: ISubLayer) => {
  subLayerModalRef.value?.show(item);
};

// 删除元素含有当前的图层
const handleDelete = () => {};
</script>

<style>
.n-checkbox__label {
  word-break: break-all;
}
</style>
