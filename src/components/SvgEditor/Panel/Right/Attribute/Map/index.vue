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

  <n-collapse :default-expanded-names="['1']">
    <n-collapse-item title="背景" name="1">
      <Item title="显示">
        <n-switch
          v-model:value="svgStore.isBgSHow"
          size="small"
          @update:value="handleBgStatusChanhe"
        >
          <template #checked> 显示 </template>
          <template #unchecked> 隐藏 </template>
        </n-switch>
      </Item>
      <Item title="类型">
        <n-radio
          :checked="svgStore.bgType === 'cloud'"
          value="cloud"
          name="bg-group"
          size="small"
          @change="handleBgTypeChange('cloud')"
        >
          云端
        </n-radio>
        <n-radio
          :checked="svgStore.bgType === 'local'"
          value="local"
          name="bg-group"
          size="small"
          @change="handleBgTypeChange('local')"
        >
          本地
        </n-radio>
      </Item>
      <Item title="地址">
        <div class="flex items-center">
          <n-input
            v-model:value="mapStore.mapInfo!.background"
            placeholder="背景图片地址"
            size="small"
            class="flex-1 flex-shrink-0"
            :disabled="svgStore.bgType === 'local'"
            @update:value="handleUpdateBackground"
          >
          </n-input>
          <n-upload
            style="height: 20px; width: 20px; margin-left: 10px"
            :default-upload="false"
            :show-file-list="false"
            @change="handleChange"
          >
            <n-icon :component="CloudUpload" size="18" class="cursor-pointer" />
          </n-upload>
        </div>
      </Item>
    </n-collapse-item>
  </n-collapse>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from "vue";
import { useSvgStore, useMapStore } from "@/stores";
import Item from "../Item/index.vue";
import CloudUpload from "@/assets/images/icons/CloudUpload.svg?component";
import { updateMap, uploadFile } from "@/utils/http/apis";
import { attrMapBackground } from "@/utils/editor/attr";
import type { UploadFileInfo } from "naive-ui";

const mapStore = useMapStore();
const svgStore = useSvgStore();

const handleUpdateBackground = (val: string) => {
  if (!mapStore.mapInfo) return;
  mapStore.mapInfo.background = val;
  attrMapBackground();
  updateMap(mapStore.mapInfo);
};

const handleBgStatusChanhe = () => {
  attrMapBackground();
};
const handleChange = (options: { file: UploadFileInfo }) => {
  const file = options.file.file;
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);

  if (svgStore.bgType === "local") {
    svgStore.bgUrl = URL.createObjectURL(file);
  } else {
    uploadFile(formData)
      .then((res) => {
        handleUpdateBackground(res);
      })
      .catch(() => {
        window.$message.error("上传失败");
      });
  }
};

const handleBgTypeChange = (val: string) => {
  svgStore.bgType = val;
};

watch(
  () => mapStore.mapInfo,
  () => {
    URL.revokeObjectURL(svgStore.bgUrl);
    svgStore.bgType = "cloud";
  }
);

onBeforeUnmount(() => {
  URL.revokeObjectURL(svgStore.bgUrl);
});
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
