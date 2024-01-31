<template>
  <div>
    <n-upload ref="upload" :default-upload="false" @change="handleChange">
      <n-button>上传文件</n-button>
    </n-upload>
  </div>
</template>

<script setup lang="ts">
import { parseSvg } from "@/utils/parse";
import type { UploadFileInfo } from "naive-ui";

const handleChange = (options: { file: UploadFileInfo }) => {
  const file = options.file.file;

  if (!file) return;
  const reader = new FileReader(); // 创建 FileReader 对象
  reader.onload = function (event: ProgressEvent<FileReader>) {
    if (!event.target) return;
    const data = event.target.result; // 获取文件内容
    console.log("🚀 ~ handleChange ~ data:", data);
    parseSvg(data as string);
  };
  reader.readAsText(file); // 以文本格式读取文件内容
};
</script>

<style scoped></style>
