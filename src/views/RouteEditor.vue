<script setup>
import { ref, watch, computed } from "vue";

import draggable from "@/utils/draggable.js";

import ArrowMarker from "@/components/svg_elems/ArrowMarker.vue";
import NodeLink from "@/components/svg_elems/NodeLink.vue";

// node radius
const R = 80 / 2;

const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890";
const randomId = (len) => {
  return [...Array(len)]
    .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
    .join("");
};

class Node {
  constructor({ id = randomId(8), x = 100, y = 100, name = "Node" } = {}) {
    this.id = id;
    this.x = x;
    this.y = y;

    this.name = name;
  }

  destroy() {
    nodes.value = nodes.value.filter((n) => n !== this);
    links.value = links.value.filter((c) => c.f !== this && c.t !== this);
  }
}

class Link {
  constructor({ from, to, name = "Caption", type = false } = {}) {
    this.f = from;
    this.t = to;
    this.name = name;
    this.type = type;
  }

  destroy() {
    links.value = links.value.filter((c) => c !== this);
  }

  // export the node id only
  toJSON() {
    const { f, t, name, type } = this;
    return {
      fid: f.id,
      tid: t.id,
      name,
      type,
    };
  }
}

const nodes = ref([]);
const links = ref([]);

const dragging = ref(null);
const selected = ref(null);

draggable(dragging);

document.addEventListener("keydown", (e) => {
  if (e.key === "Delete" && selected.value) {
    selected.value.destroy();
  }
});

const onDragNode = (e, node) => {
  selected.value = node;

  if (e.shiftKey) {
    const { x, y } = node;
    dragging.value = { x, y, placeholder: true, from: node }; // a placeholder object
    return;
  }

  dragging.value = node;
};

const dropOnCanvas = (e) => {
  selected.value = null;

  if (!dragging.value) return;

  if (e.shiftKey) {
    const { x, y, from } = dragging.value;
    const nNode = new Node({ x, y });
    nodes.value.push(nNode);
    links.value.push(new Link({ from, to: nNode }));
  }

  dragging.value = null;
};

const dropOnNode = (e, node) => {
  if (!dragging.value) return;

  if (e.shiftKey) {
    const { from } = dragging.value;
    links.value.push(new Link({ from, to: node }));
  }

  dragging.value = null;
};

const switchDirection = () => {
  if (selected.value && selected.value instanceof Link) {
    const { f, t } = selected.value;
    selected.value.f = t;
    selected.value.t = f;
  }
};

const canvasOffset = ref({
  x: 0,
  y: 0,
});

const draggingCanvas = ref(false);
draggable(draggingCanvas);

// ---- store status
const save = () => {
  localStorage.setItem(
    "data",
    JSON.stringify({
      nodes: nodes.value,
      links: links.value,
    })
  );
};

const load = () => {
  const dataStr = localStorage.getItem("data");
  if (typeof dataStr === "string") {
    const { nodes: ns, links: ls } = JSON.parse(dataStr);

    // load nodes
    nodes.value = ns.map((n) => new Node(n));

    // load links
    links.value = ls.map(({ fid, tid, ...rest }) => {
      const from = nodes.value.find((n) => n.id === fid);
      const to = nodes.value.find((n) => n.id === tid);
      return new Link({ from, to, ...rest });
    });
  } else {
    const a = new Node({ x: 100, y: 100 });
    const b = new Node({ x: 400, y: 150 });
    const link = new Link({ from: a, to: b });

    nodes.value = [a, b];
    links.value = [link];
  }
};

watch(() => [nodes, links], save, { deep: true });
load();
</script>

<template>
  <div style="display: flex">
    <main
      class="canvas"
      @mouseup="dropOnCanvas"
      @mousedown.shift="draggingCanvas = canvasOffset"
    >
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <ArrowMarker id="arrow"></ArrowMarker>
          <ArrowMarker id="arrow-active"></ArrowMarker>
        </defs>

        <g :transform="`translate(${canvasOffset.x} ${canvasOffset.y})`">
          <NodeLink
            v-for="(link, i) in links"
            :link="link"
            :R="R"
            :class="{ selected: link === selected }"
            @mousedown.stop="selected = link"
          ></NodeLink>

          <circle
            v-for="node in nodes"
            class="node"
            :cx="node.x"
            :cy="node.y"
            :r="R"
            :class="{ selected: node === selected }"
            @mousedown.stop="onDragNode($event, node)"
            @mouseup.stop="dropOnNode($event, node)"
          />

          <text v-for="node in nodes" :x="node.x" :y="node.y" :dy="R + 20">
            {{ node.name }}
          </text>

          <!-- shift drag -->
          <g v-if="dragging?.placeholder" class="pointer-none">
            <NodeLink
              :link="{ f: dragging.from, t: dragging }"
              :R="R"
            ></NodeLink>

            <circle class="disabled" :cx="dragging.x" :cy="dragging.y" :r="R" />
          </g>
        </g>
      </svg>
    </main>
    <aside>
      <form v-if="selected" @submit.prevent>
        <label>
          Name <br />
          <input type="text" v-model="selected.name" />
        </label>
      </form>

      <button @click.prevent="switchDirection">Switch Direction</button>
    </aside>
  </div>
</template>

<style scoped>
.canvas {
  --line-color: #ccc;
  --line-active-color: green;
  background: #f8f8f8;
  height: 80vh;

  position: relative;
  flex: 1;

  user-select: none;
}

aside {
  flex: 0 0 30%;
  padding: 1rem;
}

svg {
  background: #f8f8f8;
  position: absolute;
  width: 100%;
  height: 100%;
}

marker#arrow {
  fill: var(--line-color);
}
marker#arrow-active {
  fill: var(--line-active-color);
}

:deep(.selected .link) {
  stroke: var(--line-active-color);
}
:deep(.selected .arrow-marker) {
  marker-end: url(#arrow-active);
}

circle.node {
  fill: rgba(255, 255, 255, 0.8);
  stroke: #333;
  stroke-width: 4;
}

circle.node.disabled {
  pointer-events: none;
  stroke: #ccc;
}

circle.node.selected {
  stroke: green;
}

text {
  text-anchor: middle;
}

.pointer-none {
  pointer-events: none;
}
</style>
