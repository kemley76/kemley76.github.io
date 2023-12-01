<script lang="ts">
    export let title: string = "";
    export let seconds: number;
    export let min: number;
    export let max: number;
    export let data: {x: number, y: number}[] = [];
    export let vertAxis: string = "";
    export let horizAxis: string = "";
    export let offset: {x: number, y: number} = {x: 0, y: 0};
    let width = 200;
    let height = 200;
</script>

<div class="graph" style="top:{offset.y}px; right:{offset.x}px;">
    <span class="label" style="left: -40px; top: -15px; width: 200px;">{title}</span>
    {#each data as p, i}
        {#if p.y > min && p.y < max}
            <div class="point" style = "left: {(p.x % seconds) * width / seconds}px; 
            top: {height - (p.y - min) / (max - min) * height}px;"/> 
        {/if}
    {/each}
    <span class="label" style="left: -50px;">{max.toFixed(2)}</span>
    <span class="label rotate" style="top: 100px; left: -30px;">{vertAxis}</span> <!--Y axis label-->
    <span class="label" style="top: 210px; left: 90px;">{horizAxis}</span> <!--X axis label-->
    <span class="label" style="top: 190px; left: -50px;">{min.toFixed(2)}</span>
</div>


<style>
    .point {
        position: absolute;
        width: 3px;
        height: 3px;
        background-color: #E8E8E8;
        border-radius: 50%;
        z-index: 100;
    }

.graph {
    position: fixed;
    width: 200px;
    height: 200px;
    border: 1px solid #E8E8E8;
    background-image: linear-gradient(#808080 1.5px, transparent 1.5px, transparent calc(100% - 1.5px), #808080 calc(100% - 1.5px)), linear-gradient(90deg, #808080 1.5px, transparent 1.5px, transparent calc(100% - 1.5px), #808080 calc(100% - 1.5px));
    background-size: 25% 25%;
}

.label {
    position: absolute;
    text-align: center;
    transform: translate(0px, -.5em);
}

.rotate {
    transform: rotate(-90deg);
}
</style>