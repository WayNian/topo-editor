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

  <n-collapse :default-expanded-names="['1']">
    <n-collapse-item title="背景" name="1">
      <Background></Background>
    </n-collapse-item>
  </n-collapse>
</template>

<script setup lang="ts">
import { useMapStore } from "@/stores";
import Item from "../Item/index.vue";
import Background from "./Background.vue";

const mapStore = useMapStore();
</script>
