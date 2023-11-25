<script lang="ts">
  import PendulumComponent from "./PendulumComponent.svelte";
  import { Point, Mass, Pendulum, Spring } from "./Structures";
  import { GRAVITY } from "./constants";
  import Dot from "./Dot.svelte";

  let topMass: Mass = new Mass(0, 100, 10, 0);
  let topPendulum: Pendulum = new Pendulum(0, 0, topMass);
  topMass.updateConnector();

  let topDamping = 0;
  let pendulumOffset = new Point(500, 200);
  let started = false;
  let intervalId: number;
  let dots: {x: number, y: number}[] = [];

  let interval = 20;
  let h = .1;
  let t = 0; // t is not used, but we have it so the function signatures line up 

  function start()
  {
    started = true;
    intervalId = setInterval(update, interval);
    topPendulum.constant = topPendulum.massMagnitude();
    topPendulum.theta = topPendulum.angle();
  }

  function pause()
  {
    started = false;
    clearInterval(intervalId)
  }

  function update()
  {
    /*topPendulum.simulationStep();
    topPendulum = topPendulum;
    bottomPendulum = bottomPendulum;
    return;*/
    let g = GRAVITY;
    let m1 = topMass.mass;
    let t1 = topPendulum.pendAngle();
    let l1 = topPendulum.massMagnitude();
    let sin = Math.sin;

    // final equations from: https://www.myphysicslab.com/pendulum/double-pendulum-en.html
    let topAngularAcceleration: number = -g/l1 * sin(t1);

    topAngularAcceleration -= topPendulum.dtheta * topDamping;
    topPendulum.dtheta += topAngularAcceleration * Spring.h;

    topPendulum.theta += topPendulum.dtheta;

    topPendulum.setAngle(topPendulum.theta);

    topPendulum = topPendulum;

    let p = topMass.point.add(pendulumOffset);
    dots[t++ % 200] = {x: p.x, y: p.y};
  }
</script>

<PendulumComponent connector={topPendulum} editable={!started} offset={pendulumOffset}></PendulumComponent>
{#each dots as p}
  <Dot {p} />
{/each}
Top Mass: <input bind:value={topMass.mass} type="number" /><br />
Damping: <input bind:value={topDamping} type="number" /> <br />
{topPendulum.pendAngle()} <br />
{#if !started}
<button on:click={start}>Start</button>
{:else}
<button on:click={pause}>Pause</button>
{/if} <br />