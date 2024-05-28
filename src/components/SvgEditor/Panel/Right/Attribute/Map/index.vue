<template>
  <Item title="ID">
    <p class="truncate" :title="mapStore.mapInfo?.mapId">
      {{ mapStore.mapInfo?.mapId }}
    </p>
  </Item>
  <Item title="尺寸">
    <n-flex :wrap="false">
      <n-input-number v-model:value="mapStore.mapSize.width" size="small" :show-button="false" />
      <n-input-number v-model:value="mapStore.mapSize.height" size="small" :show-button="false" />
    </n-flex>
  </Item>

  <Item title="背景">
    <n-input
      v-model:value="mapStore.mapInfo!.background"
      placeholder="背景图片地址"
      style="width: 300px"
      size="small"
      @update:value="handleUpdateBackground"
    >
      <template #suffix>
        <n-upload
          style="height: 20px"
          :default-upload="false"
          :show-file-list="false"
          @change="handleChange"
        >
          <n-icon :component="CloudUpload" size="18" class="cursor-pointer" />
        </n-upload>
      </template>
    </n-input>
  </Item>
</template>

<script setup lang="ts">
import { useMapStore } from "@/stores";
import Item from "../Item/index.vue";
import CloudUpload from "@/assets/images/icons/CloudUpload.svg?component";
import { updateMap, uploadFile } from "@/utils/http/apis";
import { attrMapBackground } from "@/utils/editor/attr";
import type { UploadFileInfo } from "naive-ui";

const mapStore = useMapStore();

const handleUpdateBackground = (val: string) => {
  if (!mapStore.mapInfo) return;
  mapStore.mapInfo.background = val;
  attrMapBackground();
  updateMap(mapStore.mapInfo);
};

const handleChange = (options: { file: UploadFileInfo }) => {
  const file = options.file.file;
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);

  uploadFile(formData)
    .then((res) => {
      console.log("🚀 ~ .then ~ res:", res);
      handleUpdateBackground(res);
    })
    .catch(() => {
      window.$message.error("上传失败");
    });
};
</script>

<style scoped>
.light-green {
  height: 50px;
  background-color: rgba(0, 128, 0, 0.12);
}
.green {
  height: 50px;
  background-color: rgba(0, 128, 0, 0.24);
}
</style>
