<script lang="ts">
    import DraggableMass from "./DraggableMass.svelte";
    import { Point, type Spring } from "./Structures";

    export let connector: Spring;
    export let offset: Point = new Point(0, 0);
    export let editable = true;

</script>

<div class="spring" 
style="left:{connector.start.x + offset.x}px;
    top: {connector.start.y + offset.y}px; 
    width: {connector.magnitude()}px;
    transform: rotate({connector.angle()}rad);
    background: repeating-linear-gradient(
        45deg, 
        transparent,
        transparent {5 + connector.constant}%,
        #E8E8E8 {5 + connector.constant}%,
        #E8E8E8 {(5 + connector.constant) * 2}%
    )"/>
<svelte:component this={DraggableMass} bind:mass={connector.bottomMass} editable={{x: false, y: editable}} offset={offset}/>
<style>
    .spring {
        z-index: -100;
        position: absolute;
        height: 15px;
        transform-origin: 0% 0%;
        background-color: #e5e5f7;
        opacity: 0.8;
    }
</style>

