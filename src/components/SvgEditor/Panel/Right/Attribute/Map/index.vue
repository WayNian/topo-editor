<template>
  <Item title="ID">
    <p class="truncate" :title="mapStore.mapInfo?.mapId">
      {{ mapStore.mapInfo?.mapId }}
    </p>
  </Item>
  <Item title="尺寸">
    <n-flex :wrap="false">
      <n-input-number v-model:value="mapStore.mapSize.width" size="small" :show-button="false" />
      <n-input-number v-model:value="mapStore.mapSize.height" size="small" :show-button="false" />
    </n-flex>
  </Item>
</template>

<script setup lang="ts">
import { useMapStore } from "@/stores";
import Item from "../Item/index.vue";

const mapStore = useMapStore();
</script>

<style scoped>
.light-green {
  height: 50px;
  background-color: rgba(0, 128, 0, 0.12);
}
.green {
  height: 50px;
  background-color: rgba(0, 128, 0, 0.24);
}
</style>
