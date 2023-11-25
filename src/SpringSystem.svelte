<script lang="ts">
  import SpringComponent from "./SpringComponent.svelte";
  import { Point, Mass, Spring } from "./Structures";

  export let springs;

  let topMass = new Mass(0, 100, 10, 0);
  let topSpring = new Spring(0, 0, 5, topMass);

  let lastMass = topMass;
  let masses = [topMass];
  for (let i = 1; i < springs; i++)
  {
    let bottomMass = new Mass(0, 100 + i * 100, 10, 0);
    let bottomSpring = new Spring(0, 0, 5, bottomMass);
    lastMass.bottomConnector = bottomSpring;
    
    lastMass = bottomMass;  
    masses.push(lastMass);
  }
  masses.forEach(m => {
    m.updateConnector() 
  });

  let topSpringOffset = new Point(500, 200);
  let started = false;
  let intervalId: number;

  let interval = 20;
  let h = .1;
  let t = 0; // t is not used, but we have it so the function signatures line up 
  function start()
  {
    started = true;
    intervalId = setInterval(update, interval);
  }

  function pause()
  {
    started = false;
    clearInterval(intervalId)
  }

  function update()
  {
    topSpring.simulationStep();
    topSpring = topSpring;
  }

</script>

<SpringComponent connector={topSpring} editable={!started} offset={topSpringOffset}></SpringComponent>
{#if !started}
<button on:click={start}>Start</button>
{:else}
<button on:click={pause}>Pause</button>
{/if} <br />
From top to bottom <br />
{#each masses as m, i}
  Spring #{i}: <br />
  {#if m.topConnector}
    Spring constant: <input bind:value={m.topConnector.constant} type="number" /> <br />
  {/if}
  Mass: <input bind:value={m.mass} type="number" /> <br />
  Damping: <input bind:value={m.damping} type="number" /> <br /><br />
{/each}