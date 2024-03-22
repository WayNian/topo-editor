<template>
  <div class="fixed right-2 bottom-2 h-12 px-2 flex items-center bg-#181818">
    <div class="w-12 text-xl text-center text-#d5d5d5">23%</div>
    <div class="mx-4">|</div>
    <div class="flex-1 flex">
      <n-button text style="font-size: 24px" @click="resetSvgSizePosition">
        <n-icon>
          <Location />
        </n-icon>
      </n-button>

      <!-- <n-button text style="font-size: 24px">
        <n-icon>
          <ScanSharp />
        </n-icon>
      </n-button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import Location from "@/assets/images/icons/location.svg?component";
import { resetSvgSizePosition } from "@/utils/draw/event/svg";
</script>

<style scoped></style>
