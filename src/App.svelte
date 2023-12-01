<script lang="ts">
  import DoublePendulumSystem from "./DoublePendulumSystem.svelte";
  import SinglePendulumSystem from "./SinglePendulumSystem.svelte";
  import SpringSystem from "./SpringSystem.svelte";
  import System from "./System.svelte";

  let pageIdx = 0;
  let components: ConstructorOfATypedSvelteComponent[] = [SpringSystem, SinglePendulumSystem, DoublePendulumSystem];
  let started = false;

  function next()
  {
    pageIdx = (pageIdx + 1) % 3;
    started = false;
  }
 </script>

<main>
  <button on:click={next}>Next System Type</button>
  <System currentComponent={components[pageIdx]} bind:started={started}/>
  <h3 class="bottomText">Drag the weights to reposition them</h3>
</main>

<style>
  main {
    user-select: none;
  }

  h1 {
    text-align: center;
    width: 100%;
  }

  .bottomText {
    position: fixed;
    text-align: center;
    width: 100%;
    bottom: 0px;
  }
</style>
