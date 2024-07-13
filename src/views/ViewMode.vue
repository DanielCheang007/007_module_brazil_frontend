<script setup>
import { ref, computed } from "vue";
import { nodes } from "@/stores/app.js";

import ViewNode from "@/views/ViewNode.vue";

const node = ref(nodes.value[0]);
</script>
<template>
  <h2>This is View Mode</h2>
  <ViewNode :node="node" @next-to="(n) => (node = n)"></ViewNode>
</template>
