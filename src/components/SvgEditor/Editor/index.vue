<template>
  <n-dropdown
    trigger="manual"
    placement="bottom-start"
    :show="mapStore.isMenuVisible"
    :options="contentMenuoptions"
    :x="mapStore.menuePosition.x"
    :y="mapStore.menuePosition.y"
    @select="handleSelect"
    @clickoutside="() => (mapStore.isMenuVisible = false)"
    @contextmenu="($event: MouseEvent) => $event.preventDefault()"
  ></n-dropdown>

  <svg
    id="svgEditor"
    style="width: 100%; height: 100%"
    @dragover="handleDragover"
    @drop="handleDrop"
    @contextmenu="handleContenxtMenu"
  >
    <g id="map">
      <rect id="mapBackground" />
      <g id="linkGroup"></g>
      <g id="nodeGroup"></g>
      <g id="mergeLinkGroup"></g>
      <g id="mergeNodeGroup"></g>
      <DragAssistant></DragAssistant>
    </g>
    <rect id="selectionRect" v-show="dataStore.isSelectionRectVisible"></rect>
  </svg>

  <MoveToSublayerModal ref="moveToSublayerModalRef" />
  <RemoveSingleFromSublayer ref="removeSingleFromSublayerRef" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useCommonStore, useDataStore, useMapStore } from "@/stores/";
import { bindDragPointEvent } from "@/utils/editor/event/point";
import { onDroped } from "@/utils/tools";
import { attrLinkDrag, attrNodeDrag } from "@/utils/editor/attr";
import MoveToSublayerModal from "@/components/SvgEditor/Modal/Sublayer/MoveToSublayer.vue";
import RemoveSingleFromSublayer from "@/components/SvgEditor/Modal/Sublayer/RemoveSingleFromSublayer.vue";
import DragAssistant from "@/components/SvgEditor/Editor/DragAssistant.vue";

const dataStore = useDataStore();
const mapStore = useMapStore();
const commonStore = useCommonStore();

const moveToSublayerModalRef = ref<InstanceType<typeof MoveToSublayerModal> | null>(null);
const removeSingleFromSublayerRef = ref<InstanceType<typeof RemoveSingleFromSublayer> | null>(null);

const contentMenuoptions = [
  {
    label: "子图层",
    key: "Sublayer",
    children: [
      {
        label: "添加",
        key: "UpdateSublayer"
      },
      {
        label: "移除",
        key: "RemoveMultiFromSublayer"
      }
    ]
  }
];

const handleDragover = (e: DragEvent) => {
  e.preventDefault();
  e.dataTransfer && (e.dataTransfer.dropEffect = "copy");
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  onDroped(e);
};

const handleSelect = (key: string) => {
  mapStore.isMenuVisible = false;

  switch (key) {
    case "UpdateSublayer":
      moveToSublayerModalRef.value?.show();
      break;
    case "RemoveMultiFromSublayer":
      removeSingleFromSublayerRef.value?.show();
      break;
  }
};

const handleContenxtMenu = (e: MouseEvent) => {
  e.preventDefault();
  const mapId = mapStore.mapInfo?.mapId;
  if (!mapId) return;
  mapStore.showMapMenu({
    x: e.clientX,
    y: e.clientY
  });
};

onMounted(() => {
  bindDragPointEvent();
});

watch(
  () => commonStore.isSpaceDown,
  (val) => {
    attrLinkDrag(val);
    attrNodeDrag(val);
  }
);
</script>
@/utils/editor/event/point
