<script lang="ts">
  import PendulumComponent from "./PendulumComponent.svelte";
  import { Point, Mass, Pendulum, Spring } from "./Structures";
  import { GRAVITY } from "./constants";
  import Dot from "./Dot.svelte";
  import Graph from "./Graph.svelte";
  import { rungeKutta } from "./RungeKutta";

  let topMass: Mass = new Mass(0, 100, 10, 0);
  let topPendulum: Pendulum = new Pendulum(0, 0, topMass);

  let bottomMass = new Mass(0, 200, 10, 0);
  let bottomPendulum = new Pendulum(0, 0, bottomMass);

  topMass.bottomConnector = bottomPendulum;
  bottomPendulum.topMass = topMass;
  bottomMass.updateConnector();

  topMass.updateConnector();

  let topDamping = 0;
  let pendulumOffset = new Point(500, 200);
  export let started = false;
  let dots: {x: number, y: number}[] = [];

  let dataT1: {x: number, y: number}[] = [];
  let dataX1: {x: number, y: number}[] = [];
  let dataY1: {x: number, y: number}[] = [];

  let dataT2: {x: number, y: number}[] = [];
  let dataX2: {x: number, y: number}[] = [];
  let dataY2: {x: number, y: number}[] = [];

  export let h = 0.01;

  $: interval = 1000 * h;
  let time = 0;
  let frame = 0;

  export function extraStart()
  {
    dataT1 = [];
    dataX1 = [];
    dataY1 = [];
    dataT2 = [];
    dataX2 = [];
    dataY2 = [];
    frame = 0;

    topPendulum.constant = topPendulum.massMagnitude();
    topPendulum.theta = topPendulum.pendAngle();
    topPendulum.dtheta = 0;
    bottomPendulum.constant = bottomPendulum.massMagnitude();
    bottomPendulum.theta = bottomPendulum.pendAngle();
    bottomPendulum.dtheta = 0;
  }

  export function update()
  {
    //console.log("double pend!!!!", dataT1);
    /*topPendulum.simulationStep();
    topPendulum = topPendulum;
    bottomPendulum = bottomPendulum;
    return;*/
    let g = GRAVITY;
    let m1 = topMass.mass;
    let m2 = bottomMass.mass;
    let t1 = topPendulum.pendAngle();
    let t2 = bottomPendulum.pendAngle();
    let dt1 = topPendulum.dtheta;
    let dt2 = bottomPendulum.dtheta;
    let o12 = Math.pow(dt1, 2);
    let o22 = Math.pow(dt2, 2);
    let sq = (x: number) => Math.pow(x, 2);
    //let l1 = topPendulum.massMagnitude();
    //let l2 = bottomPendulum.massMagnitude();
    let l1 = topPendulum.constant;
    let l2 = bottomPendulum.constant;
    let sin = Math.sin;
    let cos = Math.cos;

    let n = Math.floor(5/h);
    dataT1[frame % n] = {x: time, y: t1}
    dataX1[frame % n] = {x: time, y: topPendulum.bottomMass.point.x};
    dataY1[frame % n] = {x: time, y: -topPendulum.bottomMass.point.y};

    dataT2[frame % n] = {x: time, y: t2}
    dataX2[frame % n] = {x: time, y: bottomPendulum.bottomMass.point.x};
    dataY2[frame % n] = {x: time, y: -bottomPendulum.bottomMass.point.y};

    time += interval / 1000;

    // final equations from: https://www.myphysicslab.com/pendulum/double-pendulum-en.html

    let f1 = (t: number, dTheta: number) => {
      //let top = -g * (2 * m1 + m2) * sin(t1) - m2 * g * sin(t1 - 2 * t2) - 2 * sin(t1 - t2) * m2 * (o22 * l2 + /*sq(dTheta)*/ o12 * l1 * cos(t1 - t2));
      //return top / l1 * (2 * m1 + m2 - m2 * cos(2 * t1 - 2 * t2));

      let topAngularAcceleration: number = -g * (2 * m1 + m2) * sin(t1) - m2 * g * sin(t1 - 2 * t2) - 2 * sin(t1 - t2) * m2 * (o22 * l2 + sq(dTheta) * l1 * cos(t1 - t2));
      topAngularAcceleration /= l1 * (2 * m1 + m2 - m2 * cos(2 * t1 - 2 * t2));
      return topAngularAcceleration;
    };

    let f2 = (t: number, dTheta: number) => {
      //let bottom: number = 2 * sin(t1 - t2) * (o12 * l1 * (m1 + m2) + g * (m1 + m2) * cos(t1) + sq(dTheta) * l2 * m2 * cos(t1 - t2));
      //return bottom /  l2 * (2 * m1 + m2 - m2 * cos(2 * t1 - 2 * t2));

      let bottomAngularAcceleration: number = 2 * sin(t1 - t2) * (o12 * l1 * (m1 + m2) + g * (m1 + m2) * cos(t1) + sq(dTheta) * l2 * m2 * cos(t1 - t2));
      bottomAngularAcceleration /= l2 * (2 * m1 + m2 - m2 * cos(2 * t1 - 2 * t2));
      return bottomAngularAcceleration;
    }
    // WANT::
    //topPendulum.dtheta += h * f1(0, dt1);
    //bottomPendulum.dtheta += h * f2(0, dt2);
    topPendulum.dtheta = rungeKutta(0, dt1, h, f1) - topPendulum.dtheta * topDamping;
    bottomPendulum.dtheta = rungeKutta(0, dt2, h, f2) - bottomPendulum.dtheta * topDamping;

    //bottomAngularAcceleration -= bottomPendulum.dtheta * bottomDamping;
    //topPendulum.dtheta += topAngularAcceleration * h;
    //bottomPendulum.dtheta += bottomAngularAcceleration * h;

    //let topAngularAcceleration: number = -g * (2 * m1 + m2) * sin(t1) - m2 * g * sin(t1 - 2 * t2) - 2 * sin(t1 - t2) * m2 * (o22 * l2 + o12 * l1 * cos(t1 - t2));
    //topAngularAcceleration /= l1 * (2 * m1 + m2 - m2 * cos(2 * t1 - 2 * t2));

    //let bottomAngularAcceleration: number = 2 * sin(t1 - t2) * (o12 * l1 * (m1 + m2) + g * (m1 + m2) * cos(t1) + o22 * l2 * m2 * cos(t1 - t2));
    //bottomAngularAcceleration /= l2 * (2 * m1 + m2 - m2 * cos(2 * t1 - 2 * t2));

    //topPendulum.dtheta += topAngularAcceleration * h;

    //console.log(topAngularAcceleration, f1(0, dt1));

    //console.log(rungeKutta(0, dt1, h, f1), topPendulum.dtheta);
    //bottomPendulum.dtheta += bottomAngularAcceleration * h;
    topPendulum.theta += topPendulum.dtheta * h;
    bottomPendulum.theta += bottomPendulum.dtheta * h;

    bottomPendulum.setAngle(bottomPendulum.theta);
    topPendulum.setAngle(topPendulum.theta);

    topPendulum = topPendulum;
    bottomPendulum = bottomPendulum;

    let p = bottomMass.point.add(pendulumOffset);


    dots[frame++ % 200] = {x: p.x, y: p.y};
  }
</script>

<h1>Double Pendulum System</h1>
<Graph data={dataT1} title="Top Pendulum Position" vertAxis="theta" horizAxis="t" offset = {{x: 260, y: 20}} min={-Math.PI} max={Math.PI} seconds={5}></Graph>
<Graph data={dataX1} vertAxis="x" horizAxis="t" offset = {{x: 260, y: 250}} min={-topPendulum.constant} max={topPendulum.constant} seconds={5}></Graph>
<Graph data={dataY1} vertAxis="y" horizAxis="t" offset = {{x: 260, y: 480}} min={-topPendulum.constant} max={topPendulum.constant} seconds={5}></Graph>

<Graph data={dataT2} title="Bottom Pendulum Position" vertAxis="theta" horizAxis="t" min={-Math.PI} max={Math.PI} seconds={5} offset = {{x: 0, y: 20}}></Graph>
<Graph data={dataX2} vertAxis="x" horizAxis="t" offset = {{x: 0, y: 250}} min={-(topPendulum.constant + bottomPendulum.constant)} max={topPendulum.constant + bottomPendulum.constant} seconds={5}></Graph>
<Graph data={dataY2} vertAxis="y" horizAxis="t" offset = {{x: 0, y: 480}} min={-(topPendulum.constant + bottomPendulum.constant)} max={topPendulum.constant + bottomPendulum.constant} seconds={5}></Graph>
<PendulumComponent connector={topPendulum} editable={!started} offset={pendulumOffset}></PendulumComponent>
{#each dots as p}
  <Dot {p} />
{/each}
Top Mass: <input bind:value={topMass.mass} type="number" /><br />
Bottom Mass: <input bind:value={bottomMass.mass} type="number" /><br />
Damping: <input bind:value={topDamping} type="number" step=".005"/> <br />