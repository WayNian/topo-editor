<template>
  <PanelScrollbar>
    <n-checkbox-group @update:value="handleUpdateValue" class="px-3">
      <div
        v-for="(item, index) in mapStore.sublayers"
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
  <SublayerModal ref="sublayerModalRef" />
</template>

<script setup lang="ts">
import type { ISublayer } from "@/types";
import { useDataStore, useMapStore, useMenuStore } from "@/stores";
import { ref, watch } from "vue";
import PanelScrollbar from "@/components/SvgEditor/Common/PanelScrollbar/index.vue";
import SublayerModal from "@/components/SvgEditor/Panel/Left/Modal/Sublayer/index.vue";
import InformationCircleOutline from "@/assets/images/icons/InformationCircleOutline.svg?component";
import DeleteForeverOutlined from "@/assets/images/icons/DeleteForeverOutlined.svg?component";
import { drawNodesLinks } from "@/utils/editor/draw";

const menuStore = useMenuStore();
const mapStore = useMapStore();
const dataStore = useDataStore();

const sublayerModalRef = ref<InstanceType<typeof SublayerModal> | null>(null);

watch(
  () => menuStore.mapInfo,
  (val) => {
    mapStore.getSublayers(val?.mapId);
  }
);

// 根据子图层， 显示页面中的元素
const handleUpdateValue = (val: string[]) => {
  mapStore.sublayerIds = val;
  dataStore.filterNodesLinks();
  drawNodesLinks();
};

const handleCheckInfo = (item: ISublayer) => {
  sublayerModalRef.value?.show(item);
};

// 删除元素含有当前的图层
const handleDelete = () => {};
</script>

<style>
.n-checkbox__label {
  word-break: break-all;
}
</style>
