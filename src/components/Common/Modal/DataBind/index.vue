<template>
  <n-modal
    v-model:show="isVisible"
    preset="dialog"
    title="数据配置"
    :bordered="false"
    :show-icon="false"
    :close-on-esc="false"
    :maskClosable="false"
    positive-text="确认"
    negative-text="取消"
    @positive-click="submit"
    @negative-click="hide"
    style="margin-top: 15vh; width: 600px"
  >
    <div class="flex items-center mb-2">
      <div class="w-25">指标名称：</div>
      <n-select
        label-field="name"
        value-field="id"
        filterable
        placeholder="请选择指标"
        :options="dataBindStore.dataExtractList"
        @update:value="onDataExtractChange"
      />
    </div>
    <n-data-table
      v-model:checked-row-keys="checkedRowKeys"
      :columns="columns"
      :data="dataBindStore.dataExtractInfo"
      :bordered="false"
    />
  </n-modal>
</template>

<script setup lang="ts">
import { useDataBindStore } from "@/stores/modules/data-bind";
import { ref } from "vue";

const emit = defineEmits<{
  onKeySelect: [
    {
      column: string | undefined;
      id: number | undefined;
    }
  ];
}>();

const dataBindStore = useDataBindStore();
const isVisible = ref(false);
const checkedRowKeys = ref<string[]>([]);
const id = ref<number>();

const columns = [
  {
    type: "selection",
    multiple: false
  },
  {
    title: "序号",
    key: "index"
  },
  {
    title: "key",
    key: "key"
  }
];

const onDataExtractChange = (val: number) => {
  dataBindStore.getDataExtractInfo(403);
  id.value = val;
};

const show = () => {
  isVisible.value = true;
};

const hide = () => {
  isVisible.value = false;
  dataBindStore.dataExtractInfo = [];
};

const submit = () => {
  emit("onKeySelect", {
    column: checkedRowKeys.value[0],
    id: id.value
  });
};

defineExpose({
  show
});
</script>

<style scoped></style>
