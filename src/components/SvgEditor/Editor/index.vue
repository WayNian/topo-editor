<template>
  <n-dropdown
    trigger="manual"
    placement="bottom-start"
    :show="isDropdownVisible"
    :options="contentMenuoptions"
    :x="position.x"
    :y="position.y"
    @select="handleSelect"
    @clickoutside="() => (isDropdownVisible = false)"
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
      <g>
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
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useDataStore, useMenuStore } from "@/stores/";
import { bindDragPointEvent } from "@/utils/editor/event/dragPoint";
import { onDroped } from "@/utils/tools";
import MoveToSublayerModal from "@/components/SvgEditor/Modal/MoveToSublayer/index.vue";

const dataStore = useDataStore();
const menuStore = useMenuStore();

const isDropdownVisible = ref(false);
const position = ref({ x: 0, y: 0 });

const moveToSublayerModalRef = ref<InstanceType<typeof MoveToSublayerModal> | null>(null);
console.log("🚀 ~ useSvgEditor ~ moveToSublayerModalRef:", moveToSublayerModalRef);

const contentMenuoptions = [
  {
    label: "修改子图层",
    key: "sublayer"
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
  switch (key) {
    case "sublayer":
      moveToSublayerModalRef.value?.show();
      isDropdownVisible.value = false;
      break;
  }
};

const handleContenxtMenu = (e: MouseEvent) => {
  e.preventDefault();
  const mapId = menuStore.mapInfo?.mapId;
  if (!mapId) return;
  isDropdownVisible.value = true;
  position.value.x = e.clientX;
  position.value.y = e.clientY;
};

onMounted(() => {
  bindDragPointEvent();
});
</script>

<style scoped></style>
