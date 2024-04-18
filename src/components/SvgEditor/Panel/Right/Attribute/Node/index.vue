<template>
  <p>{{ dataStore.currentNode }}</p>
</template>

<script setup lang="ts">
import { useDataStore } from "@/stores";

const dataStore = useDataStore();
</script>

<style scoped></style>
