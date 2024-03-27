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
      <n-button text style="font-size: 24px" class="mx-3">
        <n-icon>
          <OptionsSharp />
        </n-icon>
      </n-button>
      <n-button text style="font-size: 24px">
        <n-icon>
          <SettingsSharp />
        </n-icon>
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ColorFilterSharp, LibrarySharp, OptionsSharp, SettingsSharp } from "@vicons/ionicons5";
import MenuSharp from "@/assets/images/icons/MenuSharp.svg?component";

import { useMenuStore } from "@/stores";

const store = useMenuStore();

const toggleCollapsed = () => {
  store.collapsed = !store.collapsed;
};
</script>

<style scoped></style>
