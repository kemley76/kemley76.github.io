<script lang="ts">
    import DraggableMass from "./DraggableMass.svelte";
    import { Point, type Pendulum } from "./Structures";

    export let connector: Pendulum;
    export let offset: Point = new Point(0, 0);
    export let editable = true;
</script>

<div class="pendulum" 
style="left:{connector.start.x + offset.x}px;
    top: {connector.start.y + offset.y}px; 
    width: {connector.magnitude()}px;
    transform: rotate({connector.angle()}rad);"/>

<svelte:component this={DraggableMass} bind:mass={connector.bottomMass} editable={{x: editable, y: editable}} offset={offset}/>


<style>
    .pendulum {
        z-index: -100;
        position: absolute;
        background-color: #E8E8E8;
        height: 10px;
        transform-origin: 0% 0%;
    }
</style>


