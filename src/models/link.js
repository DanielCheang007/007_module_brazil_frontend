export default class Link {
  constructor({ from, to, name = "Caption", type = false } = {}) {
    this.f = from;
    this.t = to;
    this.name = name;
    this.type = type;
  }

  destroy(nodes, links) {
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
