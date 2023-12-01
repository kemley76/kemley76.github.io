<script lang="ts">
    export let p: {x: number, y: number};
</script>

<div class="point" style = "left: {p.x}px; top: {p.y}px;"/> 


<style>
    .point {
        position: absolute;
        width: 5px;
        height: 5px;
        background-color: #E8E8E8;
        border-radius: 50%;
        z-index: 100;
    }
</style>