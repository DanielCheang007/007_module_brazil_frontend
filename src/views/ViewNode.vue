<script setup>
import { computed } from "vue";
import { nodes, links } from "@/stores/app.js";

const props = defineProps(["node"]);
const emit = defineEmits(["next-to"]);

const nodeLinks = computed(() => links.value.filter((c) => c.f === props.node));
</script>
<template>
  <h2>{{ node.name }} {{ node.id }}</h2>
  <ul>
    <li v-for="c in nodeLinks">
      <a href="#" @click.prevent="$emit('next-to', c.t)">{{ c.name }}</a>
    </li>
  </ul>
</template>
