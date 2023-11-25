<script lang="ts">
    import Dot from "./Dot.svelte";
    import { Point, type Mass } from "./Structures";

    export let mass: Mass;
    export let offset: Point;
    export let editable: {x: boolean, y: boolean};
    
    let dragStatus: {dragging: boolean, point: Point, springPoint?: Point};

    function mouseDown(e: MouseEvent)
    {
        dragStatus = {
            dragging: true, 
            point: new Point(e.x, e.y).subtract(mass.point)
        };
    }

    function mouseMove(e: MouseEvent)
    {
        if (!dragStatus || !dragStatus.dragging)
            return;

        let newPoint = new Point(e.x, e.y).subtract(dragStatus.point);

        if (editable.x && editable.y)
        {
            mass.setPoint(newPoint);
        } else
        {
            if (editable.x)
                mass.setX(newPoint.x);

            if (editable.y)
                mass.setY(newPoint.y);
        }

        mass = mass;
    }

    function mouseUp()
    {
        if (!dragStatus)
            return;

        mass.point.dx = 0;
        mass.point.dy = 0;
        dragStatus.dragging = false;
    }
</script>
<div class="weight" 
    style="left: {mass.point.x + offset.x}px; 
    top: {mass.point.y + offset.y}px; 
    width: {mass.size()}px;
    height: {mass.size()}px;
    transform: translate(-50%, -50%);" 
    on:mousedown={mouseDown}>
{mass.name}                        
</div>

<Dot p={mass.point.add(offset)} />

<!--Figure out how to have a bottom connector that could be either spring or pendulum-->
{#if mass.bottomConnector}
<svelte:component this={mass.bottomConnector.component} connector={mass.bottomConnector} {offset} editable={editable.y}/>
{/if}

<svelte:window on:mouseup={mouseUp} on:mousemove={mouseMove} />
<style>
    .weight {
        position: absolute;
        background-color: blue;
        border-radius: 50%;
        color: white;
    }
</style>