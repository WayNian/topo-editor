<template>
  <div
    class="fixed right-2 bottom-2 h-12 px-2 flex items-center bg-#181818"
    v-if="mapStore.mapInfo"
  >
    <div class="w-16 text-lg text-center text-#d5d5d5">{{ scale }}</div>
    <div class="mx-4">|</div>
    <div class="flex-1 flex">
      <n-button text style="font-size: 24px" @click="resetSvgSizePosition">
        <n-icon>
          <Location />
        </n-icon>
      </n-button>

      <!-- <n-button text style="font-size: 24px">
        <n-icon>
          <ScanSharp />
        </n-icon>
      </n-button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import Location from "@/assets/images/icons/Location.svg?component";
import { useMapStore, useSvgStore } from "@/stores";
import { resetSvgSizePosition } from "@/utils/editor/event";

const svgStore = useSvgStore();
const mapStore = useMapStore();

const scale = computed(() => {
  return (svgStore.scale * 100).toFixed(1) + "%";
});
</script>

<style scoped></style>
