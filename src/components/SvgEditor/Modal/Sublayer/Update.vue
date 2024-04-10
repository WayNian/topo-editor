<template>
  <n-modal
    v-model:show="isVisible"
    preset="dialog"
    title="子图层信息"
    size="huge"
    :bordered="false"
    :show-icon="false"
    :close-on-esc="false"
    :maskClosable="false"
    positive-text="确认"
    negative-text="取消"
    @positive-click="submit"
    @negative-click="hide"
    style="margin-top: 20vh"
  >
    <n-form ref="formRef" :model="formValue" :rules="rules" label-placement="left" label-width="80">
      <n-form-item label="ID" path="sublayerId">
        <span>{{ formValue.sublayerId }}</span>
      </n-form-item>
      <n-form-item label="名称" path="sublayerName">
        <n-input v-model:value="formValue.sublayerName" maxlength="50" placeholder="输入名称" />
      </n-form-item>
      <n-form-item label="显示" path="isVisible">
        <n-switch v-model:value="formValue.isVisible" :unchecked-value="0" :checked-value="1" />
      </n-form-item>
      <n-form-item label="排序" path="listOrder">
        <n-input-number
          v-model:value="formValue.listOrder"
          :min="0"
          :step="1"
          style="width: 100%"
        />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { useMapStore, useMenuStore } from "@/stores";
import type { ISublayer } from "@/types";
import { updateSublayer } from "@/utils/http/apis";
import type { FormInst, FormItemRule } from "naive-ui";
import { ref } from "vue";

const menuStore = useMenuStore();
const mapStore = useMapStore();

const isVisible = ref(false);
const formRef = ref<FormInst | null>(null);
const formValue = ref<ISublayer>({
  sublayerId: "",
  sublayerName: "",
  isVisible: 1,
  listOrder: 0
});

const rules = {
  sublayerName: [{ required: true, message: "请输入名称", trigger: "blur" }],
  listOrder: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (value === null || value === undefined || value === "") {
          return new Error("请输入序号");
        }
        return true;
      },
      trigger: "blur"
    }
  ]
};
const show = (val: ISublayer) => {
  isVisible.value = true;
  formValue.value = { ...val };
};

const hide = () => {
  isVisible.value = false;
};

const submit = () => {
  formRef.value?.validate().then(async () => {
    const mapId = menuStore.mapInfo?.mapId;
    if (!mapId) return;
    await updateSublayer({ ...formValue.value, mapId });
    mapStore.getSublayers(mapId);
    window.$message.success("更新成功");
    hide();
  });
  return false;
};

defineExpose({
  show
});
</script>
