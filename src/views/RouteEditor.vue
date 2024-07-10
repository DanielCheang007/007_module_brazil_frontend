<script setup>
import {ref, computed} from 'vue'

// node radius
const R = 80 / 2

const a = {x:100, y:100}
const b = {x:300, y:300}

const conns = ref([[a, b]])

const nodes = ref([a, b])
const dragging = ref(null)

document.addEventListener("mousemove", (e) => {
    if (!dragging.value) return 

    dragging.value.x += e.movementX
    dragging.value.y += e.movementY
})

document.addEventListener("mouseup", (e) => {
    dragging.value = null
})

const mousedown = (node) => {
    dragging.value = node
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
    <div class="canvas">
        <svg xmlns="http://www.w3.org/2000/svg">
            <line v-for="([f, t]) in conns" :x1="f.x" :y1="f.y" :x2="t.x" :y2="t.y"/>
            <circle v-for="node in nodes" :cx="node.x" :cy="node.y" :r="R" @mousedown="mousedown(node)" />
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