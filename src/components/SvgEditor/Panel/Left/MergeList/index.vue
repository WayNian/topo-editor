<template>
  <PanelScrollbar>
    <div v-show="mapStore.mergeNodeList.length">
      <div class="flex justify-between">
        <n-tag type="success" :bordered="false"> 节点 </n-tag>
        <div>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                quaternary
                size="tiny"
                class="mr-2"
                @click.stop="handleMergeNodeClick(mapStore.mergeNodeList, 'cancel')"
              >
                <template #icon>
                  <n-icon><Close /></n-icon>
                </template>
              </n-button>
            </template>
            放弃所有
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                quaternary
                size="tiny"
                @click.stop="handleMergeNodeClick(mapStore.mergeNodeList, 'cancel')"
              >
                <template #icon>
                  <n-icon><Checkmark /></n-icon>
                </template>
              </n-button>
            </template>
            应用所有
          </n-tooltip>
        </div>
      </div>

      <n-list hoverable clickable>
        <n-list-item
          v-for="(item, index) in mapStore.mergeNodeList"
          :key="index"
          class="merge-item"
          @click="selectMergeNodeItem(item)"
        >
          <div class="break-words break-all">连线{{ item.domId }}</div>
          <div v-if="activeNodeItem === item" class="flex justify-between mt-4">
            <div class="merge-item-menu">
              <n-button
                quaternary
                size="tiny"
                class="mr-2"
                type="warning"
                @click.stop="selectMergeNodeItem(item, 'old')"
              >
                旧
              </n-button>
              <n-button
                quaternary
                size="tiny"
                type="primary"
                @click.stop="selectMergeNodeItem(item, 'new')"
              >
                新
              </n-button>
            </div>
            <div>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button
                    quaternary
                    size="tiny"
                    class="mr-2"
                    @click.stop="handleMergeNodeClick(item, 'cancel')"
                  >
                    <template #icon>
                      <n-icon><Close /></n-icon>
                    </template>
                  </n-button>
                </template>
                放弃
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button
                    quaternary
                    size="tiny"
                    @click.stop="handleMergeNodeClick(item, 'cancel')"
                  >
                    <template #icon>
                      <n-icon><Checkmark /></n-icon>
                    </template>
                  </n-button>
                </template>
                应用
              </n-tooltip>
            </div>
          </div>
        </n-list-item>
      </n-list>
    </div>

    <div v-show="mapStore.mergeLinkList.length">
      <div class="flex justify-between">
        <n-tag type="success" :bordered="false"> 连线 </n-tag>
        <div>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                quaternary
                size="tiny"
                class="mr-2"
                @click.stop="handleMergeLinkClick(mapStore.mergeLinkList, 'cancel')"
              >
                <template #icon>
                  <n-icon><Close /></n-icon>
                </template>
              </n-button>
            </template>
            放弃所有
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                quaternary
                size="tiny"
                @click.stop="handleMergeLinkClick(mapStore.mergeLinkList, 'apply')"
              >
                <template #icon>
                  <n-icon><Checkmark /></n-icon>
                </template>
              </n-button>
            </template>
            应用所有
          </n-tooltip>
        </div>
      </div>
      <n-divider />

      <n-list hoverable clickable>
        <n-list-item
          v-for="(item, index) in mapStore.mergeLinkList"
          :key="index"
          class="merge-item"
          @click.prevent="selectMergeLinkItem(item, 'all')"
        >
          <div class="break-words break-all">{{ item.domId }}</div>
          <div v-if="activeLinkItem === item" class="flex justify-between mt-4">
            <div class="merge-item-menu">
              <n-button
                quaternary
                size="tiny"
                class="mr-2"
                type="warning"
                @click.stop="selectMergeLinkItem(item, 'old')"
              >
                旧
              </n-button>
              <n-button
                quaternary
                size="tiny"
                type="primary"
                @click.stop="selectMergeLinkItem(item, 'new')"
              >
                新
              </n-button>
            </div>
            <div>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button
                    quaternary
                    size="tiny"
                    class="mr-2"
                    @click.stop="handleMergeLinkClick(item, 'cancel')"
                  >
                    <template #icon>
                      <n-icon><Close /></n-icon>
                    </template>
                  </n-button>
                </template>
                放弃
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button
                    quaternary
                    size="tiny"
                    @click.stop="handleMergeLinkClick(item, 'apply')"
                  >
                    <template #icon>
                      <n-icon><Checkmark /></n-icon>
                    </template>
                  </n-button>
                </template>
                应用
              </n-tooltip>
            </div>
          </div>
        </n-list-item>
      </n-list>
    </div>
    <n-empty description="暂时无数据" v-show="isEmpty" class="mt-10vh"> </n-empty>
  </PanelScrollbar>
</template>

<script setup lang="ts">
import type { ILink, INode } from "@/types";
import { useMapStore } from "@/stores/";
import { computed, ref } from "vue";
import { Checkmark, Close } from "@vicons/ionicons5";
import { highlightLink, highlightNode } from "@/utils/editor/draw/";
import { useMerge } from "@/hooks/menu/useMerge";
import PanelScrollbar from "@/components/SvgEditor/Common/PanelScrollbar/index.vue";

const { mergeNodes, mergeLinks } = useMerge();
const mapStore = useMapStore();
const activeNodeItem = ref<INode>();
const activeLinkItem = ref<ILink>();

const selectMergeNodeItem = (item: INode, type?: string) => {
  activeNodeItem.value = item;
  if (!type) return;
  highlightNode(item, type);
};

const handleMergeNodeClick = (val: INode | INode[], type: string) => {
  const list = Array.isArray(val) ? val : [val];
  mergeNodes(list, type);
};

const selectMergeLinkItem = (item: ILink, type?: string) => {
  activeLinkItem.value = item;
  if (!type) return;
  highlightLink(item, type);
};

const handleMergeLinkClick = (val: ILink | ILink[], type: string) => {
  const list = Array.isArray(val) ? val : [val];
  mergeLinks(list, type);
};

const isEmpty = computed(() => {
  return !mapStore.mergeNodeList.length && !mapStore.mergeLinkList.length;
});
</script>

<style>
.merge-item:hover {
  .merge-item-menu {
    opacity: 1;
  }
}
</style>
@/utils/editor/indexSvg @/stores/modules/common
