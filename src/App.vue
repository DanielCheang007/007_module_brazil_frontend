<script setup>
import { ref } from "vue";
import RouteEditor from "@/views/RouteEditor.vue";
import ViewMode from "@/views/ViewMode.vue";

const viewMode = ref(false);
</script>

<template>
  <header>
    Logo
    <a href="#" @click.prevent="viewMode = !viewMode">Switch Mode</a>
  </header>

  <main>
    <ViewMode v-if="viewMode"></ViewMode>
    <RouteEditor v-else></RouteEditor>
  </main>
</template>

<style scoped></style>
