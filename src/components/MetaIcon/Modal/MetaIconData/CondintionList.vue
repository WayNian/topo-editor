<template>
  <div class="flex">
    <n-form ref="formRef" label-placement="left" inline>
      <n-form-item>
        <n-input placeholder="数据key" v-model:value="dataKey" disabled> </n-input>
        <n-button size="small" class="ml-2" @click="showDataBindModal"> 设置 </n-button>
      </n-form-item>
      <n-form-item>
        <n-select class="w-40" :options="dataTypeOptions" :disabled="!domId" placeholder="数据类型">
        </n-select>
      </n-form-item>
    </n-form>

    <div class="flex justify-end mx-2">
      <n-button size="small" type="primary" class="mr-2" @click="add()">新增</n-button>
      <n-button size="small" type="info" class="mr-2" @click="onSaveDataBind">保存</n-button>
      <n-button size="small" type="error" @click="deleteSaveDataBind">删除</n-button>
    </div>
  </div>

  <n-spin :show="isLoading">
    <n-scrollbar style="max-height: 300px" v-if="conditionsForm.length">
      <n-form ref="formRef" :model="conditionsForm" label-placement="left" class="mr-2">
        <n-form-item v-for="(item, index) in conditionsForm" :key="index">
          <n-input-group>
            <n-input-number
              v-model:value="item.threshold"
              :style="{ width: '43%' }"
              clearable
              placeholder="阈值"
            />
            <n-select
              v-model:value="item.comparison"
              :options="comparisonOptions"
              class="w-22 flex-shrink-0"
            >
            </n-select>
            <n-select
              v-model:value="item.tagName"
              :options="tagNameOptions"
              clearable
              placeholder="元素"
              class="w-22 flex-shrink-0"
            >
            </n-select>
            <n-select
              v-model:value="item.style.type"
              :options="styleTypeOptions"
              class="w-40 flex-shrink-0"
              clearable
              placeholder="样式类型"
            >
            </n-select>
            <n-input v-model:value="item.style.data" clearable placeholder="样式" />
          </n-input-group>
          <n-button text style="font-size: 18px" class="mx-1" @click="add(index)">
            <n-icon :component="AddFilled" />
          </n-button>
          <n-button text style="font-size: 18px" @click="remove(index)">
            <n-icon :component="Subtract" />
          </n-button>
        </n-form-item>
      </n-form>
    </n-scrollbar>
    <n-empty description="暂无数据" v-else> </n-empty>
  </n-spin>

  <DataBind ref="dataBindRef" @onValueUpdate="onValueUpdate"></DataBind>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AddFilled from "@/assets/images/icons/AddFilled.svg?component";
import Subtract from "@/assets/images/icons/Subtract.svg?component";
import DataBind from "@/components/Common/Modal/DataBind/index.vue";
import { useDialog, type SelectOption } from "naive-ui";
import type { ITreeOption } from "@/utils/tools/data/modules/bind";
import type { IMetaIconDataBind, IMetaItem } from "@/types";
import { useMetaStore } from "@/stores";
import { addMetaDataBind, deleteMetaDataBind, updataMetaDataBind } from "@/utils/http/apis";

const dialog = useDialog();

const dataTypeOptions = [
  { label: "文本", value: "text" },
  { label: "数字", value: "number" },
  { label: "布尔", value: "boolean" }
];

const tagNameOptions = ref<SelectOption[]>([]);

const comparisonOptions = [
  { label: "大于", value: ">" },
  { label: "小于", value: "<" },
  { label: "等于", value: "=" },
  { label: "大于等于", value: ">=" },
  { label: "小于等于", value: "<=" }
];

const styleTypeOptions = [
  { label: "填充", value: "fill" },
  { label: "描边", value: "stroke" },
  { label: "颜色", value: "color" },
  { label: "边框", value: "border" },
  { label: "缩放", value: "scale" },
  { label: "宽度", value: "width" },
  { label: "高度", value: "height" },
  { label: "半径", value: "radius" },
  { label: "可见性", value: "visibility" },
  { label: "文本", value: "text" },
  { label: "透明度", value: "opacity" },
  { label: "变换", value: "transform" },
  { label: "描边宽度", value: "stroke-width" }
];

const metaStore = useMetaStore();
const iconInfo = ref<IMetaItem>();
const dataBindId = ref<number>();

const conditionsForm = ref<
  {
    tagName: string | null;
    comparison: string;
    threshold: string | number;
    style: {
      data: string;
      type: string | null;
    };
  }[]
>([]);

const extractId = ref<number | null>(null);
const dataKey = ref<string | null>(null);
const domId = ref<string>();
const dataBindRef = ref<InstanceType<typeof DataBind> | null>(null);
const isLoading = ref(false);

const showDataBindModal = () => {
  dataBindRef.value?.show();
};

const onValueUpdate = ({ key, id }: { key: string | null; id: number | null }) => {
  dataKey.value = key;
  extractId.value = id;
};

const add = (index?: number) => {
  console.log("🚀 ~ add ~ index:", index);
  if (!domId.value) {
    window.$message.warning("请选择元素");
    return;
  }
  if (index === undefined) {
    conditionsForm.value.push({
      tagName: null,
      comparison: "=",
      threshold: 0,
      style: {
        data: "",
        type: ""
      }
    });
  } else {
    const preItem = conditionsForm.value[index];
    conditionsForm.value.splice(index + 1, 0, {
      tagName: preItem.tagName,
      comparison: preItem.comparison,
      threshold: preItem.threshold,
      style: {
        data: "",
        type: ""
      }
    });
  }
};

const remove = (index: number) => {
  conditionsForm.value.splice(index, 1);
};

const getData = async () => {
  isLoading.value = true;
  await metaStore.getMetaIconData(iconInfo.value!.objType, domId.value);
  isLoading.value = false;
};

const onIdChange = async (val?: ITreeOption) => {
  domId.value = val ? (val.key as string) : val;
  tagNameOptions.value =
    val?.childrenTagNames.map((ele) => {
      return { label: ele, value: ele };
    }) || [];

  if (val) {
    await getData();
  } else {
    metaStore.metaIconDataBindList = [];
  }

  initConditionsForm();
};

const initConditionsForm = () => {
  conditionsForm.value = [];
  dataBindId.value = undefined;
  dataKey.value = "";
  metaStore.metaIconDataBindList.forEach((ele) => {
    dataBindId.value = ele.id;
    dataKey.value = ele.column;
    if (ele.conditions && ele.conditions.length) {
      ele.conditions.forEach((item) => {
        conditionsForm.value.push({
          tagName: item.tagName,
          comparison: item.comparison,
          threshold: item.threshold,
          style: {
            data: item.style.data,
            type: item.style.type
          }
        });
      });
    }
  });
};

const initData = (iconMeta: IMetaItem) => {
  iconInfo.value = iconMeta;
};

const deleteSaveDataBind = async () => {
  if (!domId.value) {
    window.$message.warning("请选择元素");
    return;
  }
  dialog.warning({
    title: "警告",
    content: "确定删除当前数据吗？",
    positiveText: "确定",
    negativeText: "取消",
    maskClosable: false,
    closeOnEsc: false,
    onPositiveClick: async () => {
      await deleteMetaDataBind(dataBindId.value!);
      window.$message.success("删除成功");
      await getData();
      initConditionsForm();
    },
    onAfterLeave: () => {}
  });
};

const onSaveDataBind = async () => {
  if (!domId.value) {
    window.$message.warning("请选择元素");
    return;
  }
  if (!dataKey.value) {
    window.$message.warning("请选择数据key");
    return;
  }
  const params: IMetaIconDataBind = {
    id: dataBindId.value,
    domId: domId.value,
    objType: iconInfo.value!.objType,
    column: dataKey.value,
    extractId: extractId.value!,
    conditions: conditionsForm.value
  };
  const title = dataBindId.value ? "修改" : "新增";
  params.id ? await updataMetaDataBind(params) : await addMetaDataBind(params);
  window.$message.success(`${title}成功`);
  await getData();
  initConditionsForm();
};
defineExpose({
  onIdChange,
  initData
});
</script>

<style scoped></style>
