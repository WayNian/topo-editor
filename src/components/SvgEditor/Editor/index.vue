<template>
  <n-dropdown
    trigger="manual"
    placement="bottom-start"
    :show="mapStore.isMenuVisible"
    :options="MenuOptions"
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
  <AddGroup ref="addGroupRef" />
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useCommonStore, useDataStore, useMapStore } from "@/stores/";
import { bindDragPointEvent } from "@/utils/editor/event/point";
import { onDroped } from "@/utils/tools";
import { EditMenu } from "@/utils/constant";
import { attrLinkDrag, attrNodeDrag, attrSvgDrag } from "@/utils/editor/attr";
import MoveToSublayerModal from "@/components/SvgEditor/Modal/Sublayer/MoveToSublayer.vue";
import RemoveSingleFromSublayer from "@/components/SvgEditor/Modal/Sublayer/RemoveSingleFromSublayer.vue";
import DragAssistant from "@/components/SvgEditor/Editor/DragAssistant.vue";
import AddGroup from "@/components/SvgEditor/Modal/Group/Add.vue";
import { useSvgMenu } from "@/hooks/svg/useSvgMenu";
import { bindDragSelectionEvent } from "@/utils/editor/event/selection";
import { attrSelectionDrag } from "@/utils/editor/attr/selection";

const dataStore = useDataStore();
const mapStore = useMapStore();
const commonStore = useCommonStore();

const {
  removeSingleFromSublayerRef,
  moveToSublayerModalRef,
  addGroupRef,
  handleSelect,
  handleContenxtMenu
} = useSvgMenu();

const MenuOptions = computed(() => {
  return EditMenu[mapStore.selectType];
});

const handleDragover = (e: DragEvent) => {
  e.preventDefault();
  e.dataTransfer && (e.dataTransfer.dropEffect = "copy");
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  onDroped(e);
};

onMounted(() => {
  bindDragPointEvent();
  bindDragSelectionEvent();
});

watch(
  () => commonStore.isSpaceDown,
  (val) => {
    attrLinkDrag(val);
    attrNodeDrag(val);
    attrSvgDrag(val);
    attrSelectionDrag(val);
  }
);
</script>
