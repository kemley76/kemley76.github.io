<script lang="ts">
  import Box from "./Box.svelte";
  import SpringComponent from "./SpringComponent.svelte";
  import { Point, Mass, Spring } from "./Structures";

  let springs = 2;

  let topMass: Mass;
  let topSpring: Spring;
  let lastMass: Mass;
  let masses: Mass[];
  updateSprings();
  //topMass.updateConnector();


  //let lastMass = topMass;
  //let masses = [topMass];

  let topSpringOffset = new Point(500, 0);
  export let started = false;
  let intervalId: number;

  let interval = 20;
  export let h = 0.01;
  let mIndex = 0;
  $: currentMass = masses[mIndex];

  export function update()
  {
    topSpring.simulationStep(h);
    topSpring = topSpring;
  }

  export function extraStart()
  {
    masses.forEach(m => {
      m.point.dy = 0; 
    }); 
  }

  function applyToAll() 
  {
    for (let i = 0; i < masses.length; i++)
    {
      let m = masses[i];
      m.mass = currentMass.mass; 
      m.damping = currentMass.damping;

      if (m.topConnector && currentMass.topConnector)
        m.topConnector.constant = currentMass.topConnector.constant
    }
  }

  function updateSprings() 
  {
    topMass = new Mass(0, 100, 1, 0);
    topSpring = new Spring(0, 0, 5, topMass);

    lastMass = topMass;
    masses = [topMass];
    for (let i = 1; i < springs; i++)
    {
      let bottomMass = new Mass(0, 100 + i * 100, 1, 0);
      let bottomSpring = new Spring(0, 0, 5, bottomMass);
      lastMass.bottomConnector = bottomSpring;
      
      lastMass = bottomMass;  
      masses.push(lastMass);
    }
    masses.forEach(m => {
      m.updateConnector() 
    });
  }

</script>

<h1>Spring System</h1>
<Box>
<SpringComponent connector={topSpring} editable={!started} offset={topSpringOffset}></SpringComponent>
Spring Count: <input type="number" bind:value={springs} on:change={updateSprings}/> <br />
<button on:click={() => mIndex = (mIndex + 1) % masses.length} >Next</button>
Spring #{mIndex + 1}: <br />
{#if currentMass.topConnector}
  Spring constant: <input bind:value={currentMass.topConnector.constant} type="number" /> <br />
{/if}
Mass: <input bind:value={currentMass.mass} type="number" /> <br />
Damping: <input bind:value={currentMass.damping} type="number" step=".2"/> <br />
<button on:click={applyToAll}>Apply to all</button><br /><br />
</Box>