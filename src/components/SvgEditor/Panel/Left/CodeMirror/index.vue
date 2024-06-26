<template>
  <n-modal
    v-model:show="isVisible"
    preset="dialog"
    title="编辑脚本"
    size="huge"
    :bordered="false"
    :show-icon="false"
    :close-on-esc="false"
    :maskClosable="false"
    positive-text="确认"
    negative-text="取消"
    @positive-click="submit"
    @negative-click="hide"
    style="margin-top: 20vh; width: 700px"
  >
    <!-- <n-scrollbar style="max-height: 300px"> -->
    <div id="codeLayout" class="w-full h-400px"></div>
    <!-- </n-scrollbar> -->
  </n-modal>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";

import { basicSetup, EditorView } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { abcdef } from "@uiw/codemirror-theme-abcdef";

const emit = defineEmits<{
  onValueUpdate: [content: string];
}>();

const isVisible = ref(false);
let view: EditorView | null = null;

onMounted(() => {});

const show = (content: string) => {
  isVisible.value = true;
  nextTick(() => {
    view = new EditorView({
      doc: "",
      extensions: [basicSetup, javascript(), abcdef],
      parent: document.querySelector("#codeLayout") as Element
    });
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: content
      }
    });
  });
};

const hide = () => {
  isVisible.value = false;
};

const submit = () => {
  emit("onValueUpdate", view?.state.doc.toString() || "");
};

defineExpose({
  show
});
</script>
<style>
.cm-editor {
  overflow: auto;
  height: 100%;
}
</style>
