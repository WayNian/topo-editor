<template>
  <n-scrollbar style="max-height: calc(100vh - 110px)">
    <div v-show="commonStore.mergeNodeList.length">
      <div class="flex justify-between">
        <n-tag type="success" :bordered="false"> 节点 </n-tag>
        <div>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                quaternary
                size="tiny"
                class="mr-2"
                @click.stop="handleMergeNodeClick(commonStore.mergeNodeList, 'cancel')"
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
                @click.stop="handleMergeNodeClick(commonStore.mergeNodeList, 'cancel')"
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
          v-for="(item, index) in commonStore.mergeNodeList"
          :key="index"
          class="merge-item"
          @click="selectMergeNodeItem(item)"
          @mouseenter="selectMergeNodeItem(item)"
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

    <div v-show="commonStore.mergeLinkList.length">
      <div class="flex justify-between">
        <n-tag type="success" :bordered="false"> 连线 </n-tag>
        <div>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                quaternary
                size="tiny"
                class="mr-2"
                @click.stop="handleMergeLinkClick(commonStore.mergeLinkList, 'cancel')"
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
                @click.stop="handleMergeLinkClick(commonStore.mergeLinkList, 'apply')"
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
          v-for="(item, index) in commonStore.mergeLinkList"
          :key="index"
          class="merge-item"
          @click.prevent="selectMergeLinkItem(item, 'all')"
          @mouseenter="selectMergeLinkItem(item)"
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
  </n-scrollbar>
</template>

<script setup lang="ts">
import { useCommonStore } from "@/stores/common";
import { computed, ref } from "vue";
import { Checkmark, Close } from "@vicons/ionicons5";
import type { ILink, INode } from "@/types";
import { highlightLink, highlightNode } from "@/utils/draw";
import { useMerge } from "@/hooks/menu/useMerge";

const { mergeNodes, mergeLinks } = useMerge();
const commonStore = useCommonStore();
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
  return !commonStore.mergeNodeList.length && !commonStore.mergeLinkList.length;
});
</script>

<style>
.merge-item:hover {
  .merge-item-menu {
    opacity: 1;
  }
}
</style>
