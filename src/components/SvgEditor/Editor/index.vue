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
      <g id="nodeSelectionGroup">
        <rect
          v-for="item in dataStore.nodesSelected"
          :key="item.nodeId"
          :width="item.width"
          :height="item.height"
          :x="item.x"
          :y="item.y"
          fill="none"
          stroke-dasharray="5,5"
          stroke="#409eff"
          stroke-width="2"
          pointer-events="none"
        />
      </g>
      <g id="linkSelectionGroup">
        <rect
          v-for="item in dataStore.linksSelected"
          :key="item.linkId"
          :width="item.rect.width + item.linkWidth + 4"
          :height="item.rect.height + item.linkWidth + 4"
          :x="item.rect.x - item.linkWidth * 0.5 - 2"
          :y="item.rect.y - item.linkWidth * 0.5 - 2"
          :transform="`translate(${item.transform.x}, ${item.transform.y})`"
          fill="none"
          stroke-dasharray="5,5"
          stroke="#409eff"
          stroke-width="2"
          pointer-events="none"
        />
      </g>
      <g
        id="dragPoints"
        v-show="isDragPointsVisible"
        :transform="`translate(${currentBBox.x}, ${currentBBox.y})`"
        fill="#ffffff"
      >
        <circle id="dragPointLeftTop" r="8" stroke-width="1" stroke="#409eff" />
        <circle
          id="dragPointRightTop"
          r="8"
          :cx="currentBBox.width"
          stroke-width="1"
          stroke="#409eff"
        />
        <circle
          id="dragPointRightBottom"
          r="8"
          :cx="currentBBox.width"
          :cy="currentBBox.height"
          stroke-width="1"
          stroke="#409eff"
        />
        <circle
          id="dragPointLeftBottom"
          r="8"
          :cy="currentBBox.height"
          stroke-width="1"
          stroke="#409eff"
        />
        <circle id="dragPointRotate" r="8" stroke-width="1" stroke="#409eff" />
      </g>
    </g>
    <rect id="selectionRect" v-show="dataStore.isSelectionRectVisible"></rect>
  </svg>

  <MoveToSublayerModal ref="moveToSublayerModalRef" />
  <RemoveSingleFromSublayer ref="removeSingleFromSublayerRef" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useCommonStore, useDataStore, useMapStore } from "@/stores/";
import { bindDragPointEvent } from "@/utils/editor/event/dragPoint";
import { onDroped } from "@/utils/tools";
import MoveToSublayerModal from "@/components/SvgEditor/Modal/Sublayer/MoveToSublayer.vue";
import RemoveSingleFromSublayer from "@/components/SvgEditor/Modal/Sublayer/RemoveSingleFromSublayer.vue";
import { attrLinkDrag, attrNodeDrag } from "@/utils/editor/attr";

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

const currentBBox = computed(() => {
  if (!dataStore.currentNode) return { x: 0, y: 0, width: 0, height: 0 };
  const { x, y, width, height } = dataStore.currentNode;
  return { x, y, width, height };
});

const isDragPointsVisible = computed(() => {
  if (!dataStore.currentNode || dataStore.nodesSelected.length !== 1) {
    return false;
  }

  return dataStore.nodesSelected[0].nodeId === dataStore.currentNode.nodeId;
});

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
