<script setup>
import {ref, computed} from 'vue'

// node radius
const R = 80 / 2

class Node {
    constructor(x = 100, y = 100) {
        this.x = x
        this.y = y
    }
}

const a = new Node()
const b = new Node(300, 300)

const nodes = ref([a, b])
const conns = ref([[a, b]])

const dragging = ref(null)

document.addEventListener("mousemove", (e) => {
    if (!dragging.value) return 

    dragging.value.x += e.movementX
    dragging.value.y += e.movementY
})

document.addEventListener("mouseup", (e) => {
    dragging.value = null
})

const onDrag = (e, node) => {
    if (e.shiftKey) {
        const {x, y} = node

        const nNode = new Node(x, y) // shadow
        nodes.value.push(nNode)
        conns.value.push([node, nNode]) // shadow link

        dragging.value = nNode

        return 
    }  
    
    dragging.value = node
}

const dropOnCanvas = (e) => {
    if (!dragging.value) return 

    if (e.shiftKey) {
        // just do nothing
    }
    
    dragging.value = null
}

const nStyle = (node) => {
    const {x, y} = node
    return {
        left: `${x}px`,
        top: `${y}px`
    }
}

</script>

<template>
    <div class="canvas" @mouseup="dropOnCanvas">
        <svg xmlns="http://www.w3.org/2000/svg">
            <line v-for="([f, t]) in conns" :x1="f.x" :y1="f.y" :x2="t.x" :y2="t.y"/>
            <circle v-for="node in nodes" :cx="node.x" :cy="node.y" :r="R" @mousedown="onDrag($event, node)" />
        </svg>
    </div>
</template>

<style scoped>
    .canvas {
        background: #f8f8f8;
        height: 80vh;

        position: relative;
    }
    svg {
        background: #f8f8f8;
        position: absolute;
        width: 100%;
        height: 100%;
    }
    line {
        stroke:red; 
        stroke-width: 4;
    }
    circle {
        fill: rgba(255,255,255, .8);
        stroke:#333; 
        stroke-width: 4;
    }
</style>