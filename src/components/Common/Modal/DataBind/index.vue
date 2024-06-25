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
    style="margin-top: 15vh"
  >
    <n-grid x-gap="12" :cols="24">
      <n-gi :span="5" class="flex items-center justify-end">指标名称：</n-gi>
      <n-gi :span="19" class="flex items-center">
        <n-select
          v-model:value="id"
          label-field="name"
          value-field="id"
          filterable
          placeholder="请选择指标"
          :options="dataBindStore.dataExtractList"
          @update:value="onDataExtractChange"
        />
      </n-gi>
      <n-gi :span="5" class="flex items-center justify-end">key：</n-gi>
      <n-gi :span="19" class="flex items-center my-2">
        <n-select
          v-model:value="checkedKey"
          placeholder="请选择key"
          filterable
          :options="dataBindStore.dataExtractKeyOptions"
          @update:value="onKeyChange"
        >
        </n-select>
      </n-gi>
      <n-gi :span="5" class="flex items-center justify-end" v-if="isShowValueSelect">value：</n-gi>
      <n-gi :span="19" class="flex items-center" v-if="isShowValueSelect">
        <n-select
          :value="checkedValue"
          placeholder="请选择value"
          filterable
          :options="dataExtractValueOptions"
          @update:value="onValueChange"
        >
        </n-select>
      </n-gi>
    </n-grid>
  </n-modal>
</template>

<script setup lang="ts">
import { useDataBindStore } from "@/stores/";
import { computed, ref } from "vue";

const emit = defineEmits<{
  onValueUpdate: [
    {
      id: number | null;
      key: string | null;
      value: string | null;
    }
  ];
}>();

const dataBindStore = useDataBindStore();
const isVisible = ref(false);
const checkedKey = ref<string | null>(null);
const checkedValue = ref<string | null>(null);
const id = ref<number | null>(null);
const isShowValueSelect = ref<boolean>(false);

const onDataExtractChange = async () => {
  await dataBindStore.getDataExtractInfo(314);
};

const onKeyChange = () => {
  checkedValue.value = null;
};

const onValueChange = (value: string) => {
  checkedValue.value = value.split("-")[1];
};

const dataExtractValueOptions = computed(() => {
  if (checkedKey.value === null) return [];
  const list = dataBindStore.dataExtractInfoList
    .map((ele, index) => {
      return {
        label: String(ele[checkedKey.value as string]),
        value: index + "-" + String(ele[checkedKey.value as string])
      };
    })
    .filter((ele) => ele.label);
  return list;
});

const show = (isNode?: boolean) => {
  isVisible.value = true;
  isShowValueSelect.value = !!isNode;
};

const hide = () => {
  isVisible.value = false;
  checkedValue.value = null;
};

const submit = () => {
  emit("onValueUpdate", {
    id: id.value,
    key: checkedKey.value,
    value: checkedValue.value
  });
  hide();
};

defineExpose({
  show
});
</script>

<style scoped></style>
