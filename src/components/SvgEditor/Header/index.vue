<template>
  <Header>
    <div class="flex flex-1 justify-between items-center">
      <div class="flex">
        <n-button text style="font-size: 24px" class="mr-3">
          <n-icon>
            <ColorFilterSharp />
          </n-icon>
        </n-button>

        <n-button text style="font-size: 24px">
          <n-icon>
            <LibrarySharp />
          </n-icon>
        </n-button>
      </div>
      <div class="flex">
        <n-dropdown :options="exportOptions">
          <n-button text style="font-size: 24px" class="mx-3">
            <n-icon>
              <FileExport />
            </n-icon>
          </n-button>
        </n-dropdown>
      </div>
    </div>
  </Header>
</template>

<script setup lang="ts">
import { ColorFilterSharp, LibrarySharp } from "@vicons/ionicons5";

import FileExport from "@/assets/images/icons/FileExport.svg?component";
import Header from "@/components/Common/Header/index.vue";

const exportOptions = [
  {
    label: "SVG",
    key: "svg"
  },
  {
    label: "PNG",
    key: "png"
  },
  {
    label: "PDF",
    key: "PDF"
  }
];
</script>

<style scoped></style>
