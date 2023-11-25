<script lang="ts">
  import DoublePendulumSystem from "./DoublePendulumSystem.svelte";
  import SinglePendulumSystem from "./SinglePendulumSystem.svelte";
  import SpringSystem from "./SpringSystem.svelte";

  let double: boolean = false;
  let spring: boolean = false;
  let springs = 2;
 </script>

<main>
  
  {#if double}
    {#if spring}
      {#key springs} 
      <SpringSystem {springs}> </SpringSystem> 
      {/key}
    {:else}
      <DoublePendulumSystem></DoublePendulumSystem>
    {/if}
  {:else}
    <SinglePendulumSystem></SinglePendulumSystem>
  {/if}
  Double: <input type="checkbox" bind:checked={double} /> <br />
  Spring: <input type="checkbox" bind:checked={spring} /> <br />
  Spring: <input type="number" bind:value={springs} />
</main>

<style>
  main {
    user-select: none;
  }
</style>
