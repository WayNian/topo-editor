<template>
  <div class="w-full h-12 flex flex-shrink-0 items-center justify-between px-3">
    <div>
      <n-button text style="font-size: 24px" class="mr-3">
        <n-icon>
          <MenuSharp />
        </n-icon>
      </n-button>

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
    <!-- <div>操作</div> -->
    <div>
      <n-dropdown :options="exportOptions">
        <n-button text style="font-size: 24px" class="mx-3">
          <n-icon>
            <FileExport />
          </n-icon>
        </n-button>
      </n-dropdown>

      <n-dropdown :options="settingOptions">
        <n-button text style="font-size: 24px">
          <n-icon>
            <SettingsSharp />
          </n-icon>
        </n-button>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ColorFilterSharp, LibrarySharp, SettingsSharp } from "@vicons/ionicons5";
import MenuSharp from "@/assets/images/icons/MenuSharp.svg?component";
import FileExport from "@/assets/images/icons/FileExport.svg?component";

import { useMenuStore } from "@/stores";

const menuStore = useMenuStore();

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

const settingOptions = [
  {
    label: "退出登录",
    key: "logout"
  }
];

const toggleCollapsed = () => {
  menuStore.collapsed = !menuStore.collapsed;
};
</script>

<style scoped></style>
