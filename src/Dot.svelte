<script lang="ts">
  import type { Point } from "./Structures";

    export let p: {x: number, y: number};
</script>

<div class="point" style = "left: {p.x}px; top: {p.y}px;"/> 


<style>
    .point {
        position: absolute;
        width: 5px;
        height: 5px;
        background-color: red;
        border-radius: 50%;
        z-index: 100;
    }
</style>