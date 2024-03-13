<template>
  <Transition name="slide-fade-icon">
    <n-float-button
      class="fixed right-5 top-20 w-10 h-10 rounded-full cursor-pointer"
      type="primary"
      @click="handleChangeAttributeStatus"
    >
      <n-icon color="#f5f5f5">
        <Brush />
      </n-icon>
    </n-float-button>
  </Transition>
</template>

<script setup lang="ts">
import { useCommonStore } from "@/stores/common";
import { Brush } from "@vicons/ionicons5";

const store = useCommonStore();
const handleChangeAttributeStatus = () => {
  console.log("handleChangeAttributeStatus");
  store.isAttributeViewVisible = true;
};
</script>

<style scoped>
.slide-fade-icon-enter-active,
.slide-fade-icon-leave-active {
  transition: all 0.3s linear;
}

.slide-fade-icon-enter-from,
.slide-fade-icon-leave-to {
  transform: translateX(100px);
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s linear;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(400px);
  opacity: 0;
}
</style>
