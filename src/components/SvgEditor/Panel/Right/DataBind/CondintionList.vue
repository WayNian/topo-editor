<template>
  <n-scrollbar style="max-height: 300px">
    <div class="mb-2">配置id</div>
    <n-form ref="formRef" :model="conditionsForm" label-placement="left" class="mr-2">
      <n-form-item v-for="(item, index) in conditionsForm" :key="index">
        <n-input-group>
          <n-input
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
        <n-button
          text
          style="font-size: 18px"
          v-if="conditionsForm.length > 1"
          @click="remove(index)"
        >
          <n-icon :component="Subtract" />
        </n-button>
      </n-form-item>
    </n-form>
  </n-scrollbar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AddFilled from "@/assets/images/icons/AddFilled.svg?component";
import Subtract from "@/assets/images/icons/Subtract.svg?component";
import type { SelectOption } from "naive-ui";
import type { ITreeOption } from "@/utils/tools/data/modules/bind";

const tagNameOptions = ref<SelectOption[]>([]);

const comparisonOptions = [
  { label: ">", value: ">" },
  { label: "<", value: "<" },
  { label: "=", value: "=" },
  { label: ">=", value: ">=" },
  { label: "<=", value: "<=" }
];

const styleTypeOptions = [
  { label: "填充", value: "fill" },
  { label: "描边", value: "stroke" },
  { label: "颜色", value: "color" },
  { label: "边框", value: "border" },
  { label: "宽度", value: "width" },
  { label: "高度", value: "height" },
  { label: "半径", value: "radius" },
  { label: "可见性", value: "visibility" },
  { label: "文本", value: "text" },
  { label: "透明度", value: "opacity" },
  { label: "变换", value: "transform" },
  { label: "描边宽度", value: "stroke-width" }
];

const conditionsForm = ref<
  {
    tagName: string | null;
    comparison: string;
    threshold: string;
    style: {
      data: string;
      type: string | null;
    };
  }[]
>([]);

const add = (index: number) => {
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
};

const remove = (index: number) => {
  conditionsForm.value.splice(index, 1);
};

const initData = (val: ITreeOption) => {
  tagNameOptions.value =
    val.childrenTagNames.map((ele) => {
      return { label: ele, value: ele };
    }) || [];

  conditionsForm.value = [
    {
      tagName: null,
      comparison: "=",
      threshold: "",
      style: {
        data: "",
        type: null
      }
    }
  ];
};

defineExpose({
  initData
});
</script>

<style scoped></style>
