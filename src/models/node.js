import randomId from "@/utils/random_id.js";

export default class Node {
  constructor({ id = randomId(8), x = 100, y = 100, name = "Node" } = {}) {
    this.id = id;
    this.x = x;
    this.y = y;

    this.name = name;
  }

  destroy(nodes, links) {
    nodes.value = nodes.value.filter((n) => n !== this);
    links.value = links.value.filter((c) => c.f !== this && c.t !== this);
  }
}
