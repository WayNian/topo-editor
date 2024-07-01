<template>
  <div v-for="(item, index) in dataBindForms" :key="index">
    <Item title="类型">
      <div class="flex items-center justify-between pr-2">
        {{ item.nodeType }}

        <n-button text size="small" class="ml-2" @click="showDataBind(item.nodeType)">
          <n-icon style="font-size: 24px">
            <Settings></Settings>
          </n-icon>
        </n-button>
      </div>
    </Item>
    <Item title="ID">
      <n-input
        v-model:value="item.detailId"
        placeholder="ID"
        size="small"
        @update:value="onBindMapDataChange"
      />
    </Item>
    <Item title="Key" tooltip="数据Key">
      <n-input
        v-model:value="item.key"
        placeholder="key"
        size="small"
        @update:value="onBindMapDataChange"
      />
    </Item>
  </div>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import { ref, watchEffect } from "vue";
import Settings from "@/assets/images/icons/Settings.svg?component";
import type { IGroupData, IGroupDataBind } from "@/types";

const emit = defineEmits<{
  "update:dataBind": [value: IGroupDataBind[]];
  onShowDataBindModal: [nodeType: string];
}>();

const props = defineProps<{
  data: IGroupData;
}>();

const dataBindForms = ref<IGroupDataBind[]>([]);

watchEffect(() => {
  dataBindForms.value = props.data.bindData || [];
});

const showDataBind = (nodeType: string) => {
  emit("onShowDataBindModal", nodeType);
};

const onBindMapDataChange = () => {
  console.log("🚀 ~ onBindMapDataChange ~ dataBindForm.value:", dataBindForms.value);

  //   dataBindForms.value[key] = value;
  //   emit("onDataBindUpdate", dataBindForm.value);
};
</script>

<style></style>
