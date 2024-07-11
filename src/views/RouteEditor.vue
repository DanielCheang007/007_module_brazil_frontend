<script setup>
import {ref, watch, computed} from 'vue'

// node radius
const R = 80 / 2

const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890"
const randomId = len => {
    return [...Array(len)].map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join("")
}


class Node {
    constructor({id = randomId(8), x = 100, y = 100, name = "Node"} = {}) {
        this.id = id
        this.x = x
        this.y = y

        this.name = name
    }

    destroy() {
        nodes.value = nodes.value.filter(n => n !== this)
        links.value = links.value.filter(c => c.f !== this && c.t !== this)
    }
}

class Link {
    constructor({from, to, type = false} = {}) {
        this.f = from
        this.t = to
        this.type = type
    }

    destroy() {
        links.value = links.value.filter(c => c !== this)
    }

    // export the node id only
    toJSON() {
        const {f, t, type} = this
        return {
            fid: f.id,
            tid: t.id,
            type
        }
    }
}



const nodes = ref([])
const links = ref([])

const dragging = ref(null)
const selected = ref(null)

document.addEventListener("mousemove", (e) => {
    if (!dragging.value) return 

    dragging.value.x += e.movementX
    dragging.value.y += e.movementY
})

document.addEventListener("mouseup", (e) => {
    dragging.value = null
})

document.addEventListener("keydown", (e) => {
    if (e.key === 'Delete' && selected.value) {
        selected.value.destroy()
    }
})


const onDragNode = (e, node) => {
    selected.value = node

    if (e.shiftKey) {
        const {x, y} = node
        dragging.value = {x, y, placeholder: true, from: node} // a placeholder object
        return 
    }  
    
    dragging.value = node
}

const dropOnCanvas = (e) => {
    selected.value = null

    if (!dragging.value) return 

    if (e.shiftKey) {
        const {x, y, from} = dragging.value
        const nNode = new Node({x, y})
        nodes.value.push(nNode)
        links.value.push(new Link({from, to: nNode}))
    }
    
    dragging.value = null
}

const dropOnNode = (e, node) => {
    if (!dragging.value) return 

    if (e.shiftKey) {
        const {from} = dragging.value
        links.value.push(new Link({from, to: node}))
    }

    dragging.value = null
}

const switchDirection = () => {
    if (selected.value && selected.value instanceof Link) {
        const {f, t} = selected.value
        selected.value.f = t
        selected.value.t = f
    }
}

const canvasOffset = ref({
    x: 0,
    y: 0
})

const draggingCanvas = ref(false)

document.addEventListener("mousemove", (e) => {
    if (!draggingCanvas.value) return 

    canvasOffset.value.x += e.movementX
    canvasOffset.value.y += e.movementY
})

document.addEventListener("mouseup", (e) => {
    draggingCanvas.value = null
})



// ---- store status

const save = () => {
    localStorage.setItem("data", JSON.stringify({
        nodes: nodes.value,
        links: links.value
    }))
}

const load = () => {
    const dataStr = localStorage.getItem("data")
    if (typeof dataStr === "string") {
        const {nodes: ns, links: ls} = JSON.parse(dataStr)

        // load nodes
        nodes.value = ns.map(n => new Node(n))

        // load links
        links.value = ls.map(({fid, tid, type}) => {
            const from = nodes.value.find(n => n.id === fid)
            const to = nodes.value.find(n => n.id === tid)
            return new Link({from, to, type})
        })

    } else {
        const a = new Node({x: 100, y: 100})
        const b = new Node({x: 400, y: 150})
        const link = new Link({from: a, to: b})
        
        nodes.value = [a, b]
        links.value = [link]
    }
}

watch(() => [nodes, links], save, {deep: true})
load()


</script>

<template>
    <div style="display:flex;">
        <main class="canvas" @mouseup="dropOnCanvas" @mousedown.shift="draggingCanvas = true">
            <svg xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="0"
                    refY="5"
                    markerWidth="20"
                    markerHeight="20"
                    markerUnits="userSpaceOnUse"
                    orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                    </marker>
                </defs>
        
                <g :transform="`translate(${canvasOffset.x} ${canvasOffset.y})`">
                    <line 
                        v-for="link in links" 
                        :x1="link.f.x" :y1="link.f.y" :x2="link.t.x" :y2="link.t.y" 
                        :class="{selected: link === selected}"
                        marker-end="url(#arrow)"
                        @mousedown.stop="selected = link"
                        @mouseup.stop />

                    <circle 
                        v-for="node in nodes" :cx="node.x" :cy="node.y" :r="R" 
                        :class="{selected: node === selected}"
                        @mousedown.stop="onDragNode($event, node)"
                        @mouseup.stop="dropOnNode($event, node)" />
                    
                    <text v-for="node in nodes" :x="node.x" :y="node.y + R + 20">
                        {{ node.name }}
                    </text>

                    <!-- shift drag -->
                    <template v-if="dragging?.placeholder">
                        <line :x1="dragging.from.x" :y1="dragging.from.y" :x2="dragging.x" :y2="dragging.y" 
                            marker-end="url(#arrow)"/>
                        <circle class="disabled" :cx="dragging.x" :cy="dragging.y" :r="R" />
                    </template>
                </g>
            </svg>
        </main>
        <aside>
            <form v-if="selected" @submit.prevent>
                <label>
                    Name <br>
                    <input type="text" v-model="selected.name"/>
                </label>
            </form>

            <button @click.prevent="switchDirection">Switch Direction</button>
        </aside>
    </div>
</template>

<style scoped>
    .canvas {
        background: #f8f8f8;
        height: 80vh;

        position: relative;
        flex: 1;
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

    line {
        stroke-width: 4;
        stroke: #ccc;
    }
    line.selected {
        stroke: green;
    }

    circle {
        fill: rgba(255,255,255, .8);
        stroke:#333; 
        stroke-width: 4;
    }

    circle.disabled {
        pointer-events: none;
        stroke: #ccc;
    }

    circle.selected {
        stroke: green;
    }

    text {
        text-anchor: middle;
    }

    
</style>