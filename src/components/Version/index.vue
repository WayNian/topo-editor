<template>
  <n-modal
    v-model:show="isVisible"
    preset="dialog"
    title="更新日志"
    size="huge"
    :bordered="false"
    :show-icon="false"
    :close-on-esc="false"
    :maskClosable="false"
    positive-text="确认"
    @positive-click="hide"
    style="margin-top: 20vh; width: 600px"
  >
    <n-scrollbar style="height: 40vh">
      <ChangeLog></ChangeLog>
    </n-scrollbar>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ChangeLog from "../../../CHANGELOG.md";

const isVisible = ref(false);

const show = () => {
  isVisible.value = true;
};

const hide = () => {
  isVisible.value = false;
};

defineExpose({
  show
});
</script>
<style>
.markdown-body a {
  color: #7fe7c4;
}
.markdown-body h2 {
  margin: 10px 0;
  font-size: 24px;
  font-weight: bold;
}
.markdown-body h3 {
  margin: 5px 0;
  font-size: 20px;
  font-weight: bold;
}
</style>
