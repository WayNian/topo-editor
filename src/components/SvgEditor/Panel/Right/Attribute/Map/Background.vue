<template>
  <Item title="显示">
    <n-switch v-model:value="svgStore.isBgSHow" size="small" @update:value="handleBgStatusChanhe">
      <template #checked> 显示 </template>
      <template #unchecked> 隐藏 </template>
    </n-switch>
  </Item>
  <!-- <Item title="类型">
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
  </Item> -->
  <n-scrollbar style="height: 200px">
    <VueDraggable v-model="bgList" :animation="150" handle=".handle">
      <Item title="地址" :is-show-title="false" v-for="(item, index) in bgList" :key="item.id">
        <div class="flex items-center">
          <n-icon :component="ListOutline" size="18" class="handle m-1 cursor-move" />
          <n-input
            :value="item.url"
            placeholder="背景图片地址"
            size="small"
            class="flex-1 flex-shrink-0"
            :disabled="svgStore.bgType === 'local'"
            @update:value="handleUpdateBackground($event, index)"
          >
            <template #suffix>
              <n-upload
                style="height: 20px; width: 20px"
                clearable
                :default-upload="false"
                :show-file-list="false"
                @change="handleChange($event, index)"
              >
                <n-icon :component="CloudUpload" size="18" class="cursor-pointer" />
              </n-upload>
            </template>
          </n-input>

          <n-icon
            :component="AddFilled"
            size="18"
            class="mr-1 cursor-pointer"
            @click="add(index)"
          />
          <n-icon
            v-if="bgList.length > 1"
            :component="Subtract"
            size="18"
            class="mr-1 cursor-pointer"
            @click="remove(index)"
          />
        </div>
      </Item>
    </VueDraggable>
  </n-scrollbar>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { useSvgStore, useMapStore } from "@/stores";
import { VueDraggable } from "vue-draggable-plus";
import Item from "../Item/index.vue";
import CloudUpload from "@/assets/images/icons/CloudUpload.svg?component";
import AddFilled from "@/assets/images/icons/AddFilled.svg?component";
import ListOutline from "@/assets/images/icons/ListOutline.svg?component";
import Subtract from "@/assets/images/icons/Subtract.svg?component";
import { updateMap, uploadFile } from "@/utils/http/apis";
import { attrMapBackground } from "@/utils/editor/attr";
import type { UploadFileInfo } from "naive-ui";

const mapStore = useMapStore();
const svgStore = useSvgStore();

const bgList = ref<
  {
    url: string;
    id: number;
  }[]
>([]);

const add = (index: number) => {
  if (bgList.value.length >= 8) {
    window.$message.error("最多支持8张背景图片");
    return;
  }
  bgList.value.splice(index + 1, 0, {
    url: "",
    id: Date.now()
  });
};

const remove = (index: number) => {
  bgList.value.splice(index, 1);
};

const handleUpdateBackground = (val: string, index: number) => {
  if (!mapStore.mapInfo) return;
  bgList.value[index].url = val;
};

const handleBgStatusChanhe = () => {
  attrMapBackground();
};
const handleChange = (options: { file: UploadFileInfo }, index: number) => {
  const file = options.file.file;
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);

  if (svgStore.bgType === "local") {
    svgStore.bgUrl = URL.createObjectURL(file);
  } else {
    uploadFile(formData)
      .then((res) => {
        handleUpdateBackground(res, index);
      })
      .catch(() => {
        window.$message.error("上传失败");
      });
  }
};

const handleBgTypeChange = (val: string) => {
  svgStore.bgType = val;
};

const initBgList = () => {
  if (!mapStore.mapInfo) return;
  if (!mapStore.mapInfo.background) {
    bgList.value = [
      {
        url: "",
        id: Date.now()
      }
    ];
  } else {
    bgList.value = mapStore.mapInfo.background.split(",").map((item, index) => ({
      url: item,
      id: index
    }));
  }
};

watch(
  () => bgList.value,
  (val) => {
    if (!mapStore.mapInfo) return;
    const background = val.map((ele) => ele.url).join(",");
    if (background === mapStore.mapInfo.background) return;
    mapStore.mapInfo.background = background;
    attrMapBackground();
    updateMap(mapStore.mapInfo);
  },
  {
    deep: true
  }
);
watch(
  () => mapStore.mapInfo,
  () => {
    URL.revokeObjectURL(svgStore.bgUrl);
    svgStore.bgType = "cloud";
    initBgList();
  },
  {
    immediate: true
  }
);

onBeforeUnmount(() => {
  URL.revokeObjectURL(svgStore.bgUrl);
});
</script>
