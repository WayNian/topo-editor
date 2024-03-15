<template>
  <n-scrollbar style="max-height: calc(100vh - 110px)">
    <div v-show="commonStore.mergeNodeList.length">
      <n-tag type="success" :bordered="false"> 节点 </n-tag>
      <n-list hoverable clickable>
        <n-list-item
          v-for="(item, index) in commonStore.mergeNodeList"
          :key="index"
          class="merge-item"
          @click="selectMergeNodeItem(item)"
          @mouseenter="selectMergeNodeItem(item)"
        >
          <div class="break-words break-all">连线{{ item.id }}</div>
          <div v-if="activeNodeItem === item" class="flex justify-between mt-4">
            <div class="merge-item-menu">
              <n-button quaternary size="tiny" class="mr-2" type="warning"> 旧 </n-button>
              <n-button quaternary size="tiny" type="primary"> 新 </n-button>
            </div>
            <div>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button quaternary size="tiny" class="mr-2">
                    <template #icon>
                      <n-icon><Close /></n-icon>
                    </template>
                  </n-button>
                </template>
                放弃
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button quaternary size="tiny">
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
      <n-tag type="success" :bordered="false"> 连线 </n-tag>
      <n-divider />

      <n-list hoverable clickable>
        <n-list-item
          v-for="(item, index) in commonStore.mergeLinkList"
          :key="index"
          class="merge-item"
          @click="selectMergeLinkItem(item)"
          @mouseenter="selectMergeLinkItem(item)"
        >
          <div class="break-words break-all">{{ item.linkId }}</div>
          <div v-if="activeLinkItem === item" class="flex justify-between mt-4">
            <div class="merge-item-menu">
              <n-button quaternary size="tiny" class="mr-2" type="warning"> 旧 </n-button>
              <n-button quaternary size="tiny" type="primary"> 新 </n-button>
            </div>
            <div>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button quaternary size="tiny" class="mr-2">
                    <template #icon>
                      <n-icon><Close /></n-icon>
                    </template>
                  </n-button>
                </template>
                放弃
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button quaternary size="tiny">
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

const commonStore = useCommonStore();
const activeNodeItem = ref<INode>();
const activeLinkItem = ref<ILink>();

const selectMergeNodeItem = (item: INode) => {
  activeNodeItem.value = item;
};

const selectMergeLinkItem = (item: ILink) => {
  activeLinkItem.value = item;
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
