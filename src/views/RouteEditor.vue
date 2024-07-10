<script setup>
import {ref, computed} from 'vue'

const n = {x:100, y:100}

const nodes = ref([n])
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
    <h2>Route Editor</h2>
    <div class="canvas">
        <div class="node" :style="nStyle(node)" v-for="node in nodes" @mousedown="mousedown(node)">

        </div>
    </div>
</template>

<style scoped>
    .node {
        width: 80px;
        height: 80px;
        border: 4px solid #333;
        border-radius: 100%;

        background: #fff;

        position:absolute;
        left:100px;
        top: 100px;
    }
</style>