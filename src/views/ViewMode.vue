<script setup>
import { computed } from "vue";
import { nodes, links } from "@/stores/app.js";

const node = computed(() => nodes.value[0]);
const nodeLinks = computed(() => links.value.filter((c) => c.f === node.value));
</script>
<template>
  <h2>This is View Mode</h2>
  <div>
    {{ node }}
  </div>
  <div v-for="c in nodeLinks">
    {{ c }}
  </div>
</template>
