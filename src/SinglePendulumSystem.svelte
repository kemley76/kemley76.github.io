<script lang="ts">
  import PendulumComponent from "./PendulumComponent.svelte";
  import { Point, Mass, Pendulum, Spring } from "./Structures";
  import { GRAVITY } from "./constants";
  import Dot from "./Dot.svelte";
  import Graph from "./Graph.svelte";
  import { rungeKutta } from "./RungeKutta";

  let topMass: Mass = new Mass(0, 100, 10, 0);
  let topPendulum: Pendulum = new Pendulum(0, 0, topMass);
  topMass.updateConnector();

  let topDamping = 0;
  let pendulumOffset = new Point(500, 200);
  export let started = false;
  let dots: {x: number, y: number}[] = [];
  let dataT: {x: number, y: number}[] = [];
  let dataX: {x: number, y: number}[] = [];
  let dataY: {x: number, y: number}[] = [];
  export let h = 0.01;

  let time = 0;
  let frame = 0;

  export function extraStart()
  {
    topPendulum.constant = topPendulum.massMagnitude();
    topPendulum.theta = topPendulum.pendAngle();
    topPendulum.dtheta = 0;
    console.log(topPendulum.constant);
  }

  export function update()
  {
    let g = GRAVITY;
    let m1 = topMass.mass;
    let t1 = topPendulum.theta;
    let l1 = topPendulum.massMagnitude();
    let sin = Math.sin;

    let n = Math.floor(5 / h);
    dataT[frame % n] = {x: time, y: t1}
    dataX[frame % n] = {x: time, y: topPendulum.bottomMass.point.x};
    dataY[frame % n] = {x: time, y: -topPendulum.bottomMass.point.y};

    time += h;

    // final equations from: https://www.myphysicslab.com/pendulum/pendulum-en.html

    let f = (t: number, dTheta: number) => {
      return -g / l1 * sin(t1);
    };

    topPendulum.dtheta = rungeKutta(0, topPendulum.dtheta, h, f) - topPendulum.dtheta * topDamping;
    topPendulum.theta += topPendulum.dtheta * h;


    if (topPendulum.theta < -Math.PI)
      topPendulum.theta += Math.PI * 2;
    if (topPendulum.theta > Math.PI)
      topPendulum.theta -= Math.PI * 2;

    topPendulum.setAngle(topPendulum.theta);
    topPendulum = topPendulum;

    let p = topMass.point.add(pendulumOffset);
    dots[frame++ % 200] = {x: p.x, y: p.y};
  }
</script>

<h1>Single Pendulum System</h1>
<Graph data={dataT} title="Pendulum Position" offset = {{x: 0, y: 20}} vertAxis="theta" horizAxis="t" min={-Math.PI} max={Math.PI} seconds={5}></Graph>
<Graph data={dataX} vertAxis="x" horizAxis="t" offset = {{x: 0, y: 250}} min={-topPendulum.constant} max={topPendulum.constant} seconds={5}></Graph>
<Graph data={dataY} vertAxis="y" horizAxis="t" offset = {{x: 0, y: 480}} min={-topPendulum.constant} max={topPendulum.constant} seconds={5}></Graph>

<PendulumComponent connector={topPendulum} editable={!started} offset={pendulumOffset}></PendulumComponent>
{#each dots as p}
  <Dot {p} />
{/each}
Top Mass: <input bind:value={topMass.mass} type="number" /><br />
Damping: <input bind:value={topDamping} type="number"  step=".005"/> <br />