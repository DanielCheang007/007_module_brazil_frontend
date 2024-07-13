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

const linePath = computed(() => {
  let { f, t } = props.link;

  // switch start and end to keep text direction
  if (f.x > t.x) [f, t] = [t, f];

  return `M${f.x} ${f.y}, L${t.x} ${t.y}`;
});

const caption = computed(() => {
  const { f, t, name } = props.link;
  const lineLen = Math.sqrt(Math.pow(f.x - t.x, 2) + Math.pow(f.y - t.y, 2));
  const textLen = Math.floor(lineLen / 20);
  if (name) {
    return `${name.slice(0, textLen)}${name.length > textLen ? "..." : ""}`;
  }
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

    <path :id="`p${uid}`" :d="linePath" />
    <text dy="-10">
      <textPath :href="`#p${uid}`" startOffset="50%" text-anchor="middle">
        {{ caption }}
      </textPath>
    </text>
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
