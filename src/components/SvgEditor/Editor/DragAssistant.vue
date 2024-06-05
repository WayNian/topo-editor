<template>
  <g id="nodeSelectionGroup">
    <rect
      v-for="item in dataStore.nodesSelected"
      :key="item.nodeId"
      :width="item.width + rectBorderWidth"
      :height="item.height + rectBorderWidth"
      :x="item.x - rectBorderWidth / 2"
      :y="
        item.nodeType === 'text'
          ? item.y - rectBorderWidth / 2 - +item.fontSize
          : item.y - rectBorderWidth / 2
      "
      :transform="`rotate(${item.rotate} ${item.x - rectBorderWidth / 2 + item.width / 2} ${
        item.nodeType === 'text'
          ? item.y - rectBorderWidth / 2 - +item.fontSize + +item.width / 2
          : item.y - rectBorderWidth / 2 + item.height / 2
      })`"
      fill="none"
      stroke-dasharray="10,5"
      stroke="#409eff"
      :stroke-width="rectBorderWidth"
      pointer-events="none"
    />
  </g>
  <g id="linkSelectionGroup">
    <rect
      v-for="item in dataStore.linksSelected"
      :key="item.linkId"
      :width="item.width + item.linkWidth + getStrokeWidth(item) + rectBorderWidth"
      :height="item.height + item.linkWidth + getStrokeWidth(item) + rectBorderWidth"
      :x="item.x - item.linkWidth * 0.5 - 2 - getStrokeWidth(item) / (rectBorderWidth / 2)"
      :y="item.y - item.linkWidth * 0.5 - 2 - getStrokeWidth(item) / (rectBorderWidth / 2)"
      :transform="`translate(${item.transform.x}, ${item.transform.y})`"
      fill="none"
      stroke-dasharray="10,5"
      stroke="#409eff"
      :stroke-width="rectBorderWidth"
      pointer-events="none"
    />
  </g>
  <g id="selectionBox" v-show="isSelectionBoxVisible" fill="#ffffff">
    <rect
      class="cursor-move"
      :width="selectionBox.width + rectBorderWidth"
      :height="selectionBox.height + rectBorderWidth"
      :x="selectionBox.x - rectBorderWidth / 2"
      :y="selectionBox.y - rectBorderWidth / 2"
      fill="none"
      stroke-dasharray="10,5"
      stroke="#409eff"
      :stroke-width="rectBorderWidth"
      pointer-events="all"
    />
    <circle
      id="dragPointLeftTop"
      class="cursor-nw-resize"
      :r="cicleWidth"
      :stroke-width="cicleStrokeWidth"
      stroke="#409eff"
      :cx="selectionBox.x"
      :cy="selectionBox.y"
    />
    <circle
      id="dragPointRightTop"
      class="cursor-ne-resize"
      :r="cicleWidth"
      :cx="selectionBox.x + selectionBox.width"
      :cy="selectionBox.y"
      :stroke-width="cicleStrokeWidth"
      stroke="#409eff"
    />
    <circle
      id="dragPointRightBottom"
      class="cursor-se-resize"
      :r="cicleWidth"
      :cx="selectionBox.x + selectionBox.width"
      :cy="selectionBox.y + selectionBox.height"
      :stroke-width="cicleStrokeWidth"
      stroke="#409eff"
    />
    <circle
      id="dragPointLeftBottom"
      class="cursor-sw-resize"
      :r="cicleWidth"
      :cx="selectionBox.x"
      :cy="selectionBox.y + selectionBox.height"
      :stroke-width="cicleStrokeWidth"
      stroke="#409eff"
    />
    <!-- <circle id="dragPointRotate"       :r="cicleWidth"
 :stroke-width="cicleStrokeWidth" stroke="#409eff" /> -->
  </g>
</template>

<script setup lang="ts">
import { useCommonStore, useDataStore, useSvgStore } from "@/stores";
import type { ILink } from "@/types";
import { attrSelectionDrag } from "@/utils/editor/attr/selection";
import { computed, ref, watch } from "vue";

const dataStore = useDataStore();
const commonStore = useCommonStore();
const svgStore = useSvgStore();

const rectBorderWidth = ref(4);
const cicleWidth = ref(8);
const cicleStrokeWidth = ref(1);

const selectionBox = computed(() => {
  if (!dataStore.nodesSelected.length && !dataStore.linksSelected.length)
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  const boxList: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[] = [];

  dataStore.nodesSelected.forEach((item) => {
    boxList.push({
      x: item.x,
      y: item.nodeType === "text" ? item.y - +item.fontSize : item.y,
      width: item.width,
      height: item.height
    });
  });

  dataStore.linksSelected.forEach((item) => {
    const strokeWidth = getStrokeWidth(dataStore.currentLink);
    boxList.push({
      x: item.x - strokeWidth / 2 - 2 + item.transform.x,
      y: item.y - strokeWidth / 2 - 2 + item.transform.y,
      width: item.width + strokeWidth + 4,
      height: item.height + strokeWidth + 4
    });
  });

  const leftX = Math.min(...boxList.map((item) => item.x));
  const topY = Math.min(...boxList.map((item) => item.y));
  const rightX = Math.max(...boxList.map((item) => item.x + item.width));
  const bottomY = Math.max(...boxList.map((item) => item.y + item.height));

  return {
    x: leftX,
    y: topY,
    width: rightX - leftX,
    height: bottomY - topY
  };
});

watch(
  () => selectionBox.value,
  (value) => {
    commonStore.selectedBoxInfo = value;
  }
);

watch(
  () => commonStore.isShiftDown,
  (value) => {
    attrSelectionDrag(!value);
  }
);

const isSelectionBoxVisible = computed(() => {
  return dataStore.nodesSelected.length || dataStore.linksSelected.length;
});

const getStrokeWidth = (item: ILink | null) => {
  if (!item) return 0;
  return parseFloat(item.style["stroke-width"] + "");
};

watch(
  () => svgStore.zoomTrans.k,
  (val) => {
    rectBorderWidth.value = Math.min(4 / val, 4);
    cicleWidth.value = Math.min(8 / val, 8);
    cicleStrokeWidth.value = Math.min(1 / val, 1);
  }
);
</script>

<style></style>
