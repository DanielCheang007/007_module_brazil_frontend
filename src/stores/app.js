import { ref, watch, computed, onUnmounted } from "vue";

import Node from "@/models/node.js";
import Link from "@/models/link.js";

const nodes = ref([]);
const links = ref([]);

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
    clearAll();
  }
};

watch(() => [nodes, links], save, { deep: true });
load();

// ---- clearAll
const clearAll = () => {
  nodes.value = [];
  links.value = [];

  const a = new Node({ x: 100, y: 100, isStart: true });
  const b = new Node({ x: 400, y: 150, isFinal: true });
  const link = new Link({ from: a, to: b });

  nodes.value = [a, b];
  links.value = [link];
};

export { nodes, links, clearAll };
