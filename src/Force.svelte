<script lang="ts">
    import type { Point } from "./Structures";

    export let force: Point;
    export let origin: Point;
</script>

<div class="force" 
style="left:{origin.x}px;
    top: {origin.y}px; 
    width: {force.magnitude()}px;
    transform: rotate({force.angle()}rad);"/>

<style>
    .force {
        z-index: 1000;
        position: absolute;
        background-color: black;
        height: 10px;
        transform-origin: 0% 0%;
    }
</style>