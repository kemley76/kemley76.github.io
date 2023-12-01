<script lang="ts">
    import { Spring } from "./Structures";
    let update: () => void;
    let extraStart: () => void;

    export let started = false;
    let intervalId: number;
    let h = 0.01;

    export let currentComponent: ConstructorOfATypedSvelteComponent;

    function start()
    {
        started = true;
        intervalId = setInterval(update, 1000 * h);
        extraStart();
    }

    function pause()
    {
        started = false;
        clearInterval(intervalId)
    }

</script>
{#if !started}
<button on:click={start} class="green big">Start! (Resets velocity to 0)</button>
{:else}
<button on:click={pause} class="red big">Pause!</button>
{/if}
h: <input bind:value={h} disabled={started} type="number" step=".01"/> <br />
<svelte:component this={currentComponent} {h} bind:update={update} bind:extraStart={extraStart}/>

<style>
    .big {
        width: 100px;
        height: 50px;
        border: none;
    }

    .red {
        background-color: red;
    }

    .red:hover {
        background-color: darkred;
    }

    .green {
        background-color: lightgreen;
    }

    .green:hover {
        background-color: green;
    }
</style>
