<script setup>
import { getCurrentInstance, computed } from "vue";

const props = defineProps(["link", "R"]);

const { uid } = getCurrentInstance();

const linePos = computed(() => {
  const { f, t } = props.link;
  return {
    x1: f.x,
    y1: f.y,
    x2: t.x,
    y2: t.y,
  };
});
</script>

<template>
  <g>
    <!-- mask the start and end -->
    <mask :id="`m${uid}`">
      <rect x="0" y="0" width="9999" height="9999" fill="white" />
      <circle :cx="link.f.x" :cy="link.f.y" :r="R + 10" fill="black" />
      <circle :cx="link.t.x" :cy="link.t.y" :r="R + 20" fill="black" />
    </mask>

    <!-- larger line width for suitable click area -->
    <line v-bind="linePos" stroke="transparent" stroke-width="48" />

    <!-- the line -->
    <line v-bind="linePos" class="link" :mask="`url(#m${uid})`" />

    <!-- for arrow mark, the mask will affect this arrow, so separate it -->
    <line v-bind="linePos" class="arrow-marker pointer-none" />
  </g>
</template>

<style scoped>
g {
  cursor: pointer;
}

.link {
  stroke-width: 4;
  stroke: var(--line-color);
}
.arrow-marker {
  marker-end: url(#arrow);
}
</style>
