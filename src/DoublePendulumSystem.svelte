<script lang="ts">
  import PendulumComponent from "./PendulumComponent.svelte";
  import { Point, Mass, Pendulum, Spring } from "./Structures";
  import { GRAVITY } from "./constants";
  import Dot from "./Dot.svelte";

  let topMass: Mass = new Mass(0, 100, 10, 0);
  let topPendulum: Pendulum = new Pendulum(0, 0, topMass);

  let bottomMass = new Mass(0, 200, 10, 0);
  let bottomPendulum = new Pendulum(0, 0, bottomMass);

  topMass.bottomConnector = bottomPendulum;
  bottomPendulum.topMass = topMass;
  bottomMass.updateConnector();

  topMass.updateConnector();

  let topDamping = 0;
  let bottomDamping = 0;
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
    bottomPendulum.constant = bottomPendulum.massMagnitude();
    bottomPendulum.theta = bottomPendulum.angle();
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
    let m2 = bottomMass.mass;
    let t1 = topPendulum.pendAngle();
    let t2 = bottomPendulum.pendAngle();
    let o12 = Math.pow(topPendulum.dtheta, 2);
    let o22 = Math.pow(bottomPendulum.dtheta, 2);
    let l1 = topPendulum.massMagnitude();
    let l2 = bottomPendulum.massMagnitude();
    let sin = Math.sin;
    let cos = Math.cos;

    // final equations from: https://www.myphysicslab.com/pendulum/double-pendulum-en.html
    let topAngularAcceleration: number = -g * (2 * m1 + m2) * sin(t1) - m2 * g * sin(t1 - 2 * t2) - 2 * sin(t1 - t2) * m2 * (o22 * l2 + o12 * l1 * cos(t1 - t2));
    topAngularAcceleration /= l1 * (2 * m1 + m2 - m2 * cos(2 * t1 - 2 * t2));

    let bottomAngularAcceleration: number = 2 * sin(t1 - t2) * (o12 * l1 * (m1 + m2) + g * (m1 + m2) * cos(t1) + o22 * l2 * m2 * cos(t1 - t2));
    bottomAngularAcceleration /= l2 * (2 * m1 + m2 - m2 * cos(2 * t1 - 2 * t2));

    topAngularAcceleration -= topPendulum.dtheta * topDamping;
    bottomAngularAcceleration -= bottomPendulum.dtheta * bottomDamping;
    topPendulum.dtheta += topAngularAcceleration * Spring.h;
    bottomPendulum.dtheta += bottomAngularAcceleration * Spring.h;

    topPendulum.theta += topPendulum.dtheta;
    bottomPendulum.theta += bottomPendulum.dtheta;

    bottomPendulum.setAngle(bottomPendulum.theta);
    topPendulum.setAngle(topPendulum.theta);

    topPendulum = topPendulum;
    bottomPendulum = bottomPendulum;

    let p = bottomMass.point.add(pendulumOffset);
    dots[t++ % 200] = {x: p.x, y: p.y};
  }
</script>

<PendulumComponent connector={topPendulum} editable={!started} offset={pendulumOffset}></PendulumComponent>
{#each dots as p}
  <Dot {p} />
{/each}
Top Mass: <input bind:value={topMass.mass} type="number" /><br />
Bottom Mass: <input bind:value={bottomMass.mass} type="number" /><br />
Damping: <input bind:value={topDamping} type="number" /> <br />
Damping: <input bind:value={bottomDamping} type="number" /> <br />
{topPendulum.pendAngle()} <br />
{bottomPendulum.pendAngle()} <br />
{#if !started}
<button on:click={start}>Start</button>
{:else}
<button on:click={pause}>Pause</button>
{/if} <br />