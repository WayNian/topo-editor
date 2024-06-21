<template>
  <div>
    <Item title="ID">
      <div class="flex">
        <n-input :value="dataStore.currentNode?.compClass" placeholder="输入数据ID" size="small" />
        <n-button @click="showDataBind" size="small" class="ml-2">配置</n-button>
      </div>
    </Item>
  </div>
  <!-- <IconDataBind ref="iconDataBindRef"></IconDataBind> -->
  <IconDataBindConfig ref="iconDataBindConfigRef"></IconDataBindConfig>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import { ref } from "vue";
import { useDataStore } from "@/stores";
import IconDataBindConfig from "@/components/SvgEditor/Panel/Right/Modal/IconDataBindConfig.vue";

const dataStore = useDataStore();
const iconDataBindConfigRef = ref<InstanceType<typeof IconDataBindConfig> | null>(null);

const showDataBind = () => {
  iconDataBindConfigRef.value?.show();
};
</script>

<style></style>
