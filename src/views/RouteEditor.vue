<script setup>
import {ref, computed} from 'vue'

// node radius
const R = 80 / 2

class Node {
    constructor(x = 100, y = 100) {
        this.x = x
        this.y = y

        this.name = "Node"
    }
}

class Link {
    constructor(from, to, type = false) {
        this.f = from
        this.t = to
        this.type = type
    }
}

const a = new Node(100, 100)
const b = new Node(300, 100)
const link = new Link(a, b)

const nodes = ref([a, b])
const conns = ref([link])

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
        const node = selected.value
        nodes.value = nodes.value.filter(n => n !== node)

        conns.value = conns.value.filter(c => c.f !== node && c.t !== node)
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
        const nNode = new Node(x, y)
        nodes.value.push(nNode)
        conns.value.push(new Link(from, nNode))
    }
    
    dragging.value = null
}

const dropOnNode = (e, node) => {
    if (!dragging.value) return 

    if (e.shiftKey) {
        const {from} = dragging.value
        conns.value.push(new Link(from, node))
    }

    dragging.value = null
}

// const nStyle = (node) => {
//     const {x, y} = node
//     return {
//         left: `${x}px`,
//         top: `${y}px`
//     }
// }

const switchDirection = () => {
    if (selected.value && selected.value instanceof Link) {
        const {f, t} = selected.value
        selected.value.f = t
        selected.value.t = f
    }
}

</script>

<template>
    <div style="display:flex;">
        <main class="canvas" @mouseup="dropOnCanvas">
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
        
                <g>
                    <line 
                        v-for="link in conns" 
                        :x1="link.f.x" :y1="link.f.y" :x2="link.t.x" :y2="link.t.y" 
                        :class="{selected: link === selected}"
                        marker-end="url(#arrow)"
                        @mousedown="selected = link"
                        @mouseup.stop />

                    <circle 
                        v-for="node in nodes" :cx="node.x" :cy="node.y" :r="R" 
                        :class="{selected: node === selected}"
                        @mousedown="onDragNode($event, node)"
                        @mouseup.stop="dropOnNode($event, node)" />

                    <template v-if="dragging?.placeholder">
                        <line :x1="dragging.from.x" :y1="dragging.from.y" :x2="dragging.x" :y2="dragging.y" 
                            marker-end="url(#arrow)"/>
                        <circle class="disabled" :cx="dragging.x" :cy="dragging.y" :r="R" />
                    </template>
                    
                    <text v-for="node in nodes" :x="node.x" :y="node.y + R + 20">
                        {{ node.name }}
                    </text>
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