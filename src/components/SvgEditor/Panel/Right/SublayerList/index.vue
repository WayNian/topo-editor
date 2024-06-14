<template>
  <PanelScrollbar>
    <n-checkbox-group :value="mapStore.sublayerIds" @update:value="handleUpdateValue" class="px-3">
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

          <n-button text style="font-size: 20px" @click="handleDelete(item)">
            <n-icon>
              <Delete />
            </n-icon>
          </n-button>
        </div>
      </div>
    </n-checkbox-group>
  </PanelScrollbar>
  <SublayerModal ref="sublayerModalRef" />
  <RemoveMultiFromSublayer ref="RemoveMultiFromSublayerRef" />
</template>

<script setup lang="ts">
import type { ISublayer } from "@/types";
import { useMapStore } from "@/stores";
import { ref } from "vue";
import PanelScrollbar from "@/components/SvgEditor/Common/PanelScrollbar/index.vue";
import SublayerModal from "@/components/SvgEditor/Modal/Sublayer/Update.vue";
import RemoveMultiFromSublayer from "@/components/SvgEditor/Modal/Sublayer/RemoveMultiFromSublayer.vue";
import InformationCircleOutline from "@/assets/images/icons/InformationCircleOutline.svg?component";
import Delete from "@/assets/images/icons/Delete.svg?component";
import { drawNodesLinks } from "@/utils/editor/draw";
import { renewNodesLinks } from "@/utils/tools";

const mapStore = useMapStore();

const sublayerModalRef = ref<InstanceType<typeof SublayerModal> | null>(null);
const RemoveMultiFromSublayerRef = ref<InstanceType<typeof RemoveMultiFromSublayer> | null>(null);

// 根据子图层， 显示页面中的元素
const handleUpdateValue = (val: string[]) => {
  mapStore.sublayerIds = val;
  renewNodesLinks();
  //   drawNodesLinks();
};

const handleCheckInfo = (sublayer: ISublayer) => {
  sublayerModalRef.value?.show(sublayer);
};

// 删除元素含有当前的图层
const handleDelete = (sublayer: ISublayer) => {
  RemoveMultiFromSublayerRef.value?.show(sublayer);
};
</script>

<style>
.n-checkbox__label {
  word-break: break-all;
}
</style>
