<template>
  <div class="flex flex-col h-100vh">
    <Header class="justify-between"></Header>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/Common/Header/index.vue";
</script>

<style scoped></style>
