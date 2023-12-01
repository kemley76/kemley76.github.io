import PendulumComponent from "./PendulumComponent.svelte";
import SpringComponent from "./SpringComponent.svelte";
import { GRAVITY } from "./constants";

export class Connector {
    start: Point;
    end: Point;
    bottomMass: Mass;
    theta: number;
    component: any;
    topMass?: Mass;
    constant: number;

    constructor(x: number, y: number, mass: Mass) {
        this.start = new Point(x, y);
        this.end = new Point(x, y - mass.size() / 2);
        this.bottomMass = mass;
        mass.topConnector = this;
        this.theta = this.angle();
        this.constant = 0;
    }

    magnitude(): number {
        return this.direction().magnitude();
    }

    massMagnitude(): number {
        return this.start.subtract(this.bottomMass.point).magnitude();
    }

    angle(): number {
        return this.bottomMass.point.subtract(this.start).angle();
    }

    pendAngle(): number {
        return this.angle() - Math.PI / 2;
    }

    direction(): Point {
        return this.end.subtract(this.start);
    }

    unitDirection(): Point {
        return this.direction().unit();
    }
    
    force(): Point {
        return new Point(0, 0);
    }
    
    simulationStep(h: number): void {}
}

export class Spring extends Connector {
    component = SpringComponent;

    constructor(x: number, y: number, constant: number, mass: Mass)
    {
        super(x, y, mass);
        this.constant = constant; // represents the spring constant
    }

    equilibrium(): Point {
        if (this.bottomMass.bottomConnector)
            return new Point(0, (this.bottomMass.bottomConnector.bottomMass.mass + this.bottomMass.mass) * GRAVITY / this.constant);
        return new Point(0, this.bottomMass.mass * GRAVITY / this.constant);
    }

    force() {
        return this.direction().multiply(-this.constant);
    }

    simulationStep(h: number) {
        if (this.bottomMass)
        {
            this.bottomMass.simulationStep(this.force(), h);
        }
    }
}

export class Pendulum extends Connector {
    component = PendulumComponent;

    dtheta: number;

    constructor(x: number, y: number, mass: Mass)
    {
        super(x, y, mass);
        this.dtheta = 0;
        this.constant = this.massMagnitude(); // represents the length of the spring
    }
    
    // tension force
    force(): Point {
        let sin = Math.sin(this.pendAngle());
        let cos = Math.cos(this.pendAngle());
        // v^2/r is centripetal acceleration 
        // T = cos * mg + m * v^2/r 
        let tension = cos * this.bottomMass.mass * GRAVITY + 
            this.bottomMass.mass * Math.pow(this.bottomMass.point.velocity().magnitude(), 2) / this.constant;
        if (this.bottomMass.bottomConnector)
        {
            let c: Connector = this.bottomMass.bottomConnector;
            tension += Math.cos(c.pendAngle() - this.pendAngle()) * c.force().magnitude();
            //return new Point(sin * tension, -cos * tension).add(c.force());
        }
        
        return new Point(sin * tension, -cos * tension);
    }

    simulationStep(h: number) {
        if (this.bottomMass)
        {
            //this.dtheta -= Spring.h * GRAVITY / this.massMagnitude() * Math.sin(this.theta - Math.PI / 2);
            //this.theta += Spring.h * this.dtheta;
            //this.setAngle(this.theta);
            this.bottomMass.simulationStep(this.force(), h);
            //this.theta = this.angle();
        }
    }
    
    setAngle(theta: number) {
        this.bottomMass.setPoint(new Point(Math.cos(theta + Math.PI / 2), Math.sin(theta + Math.PI / 2)).multiply(this.constant).add(this.start));
    }
}

export class Mass {
    point: Point;
    mass: number;
    damping: number;
    topConnector?: Connector;
    bottomConnector?: Connector;
    name?: String;

    constructor(x: number, y: number, mass: number, damping: number)
    {
        this.point = new Point(x, y);
        this.mass = mass;
        this.damping = damping;
        this.name = "";
    }

    simulationStep(force: Point, h: number)
    {
        // y'' = m * g - k * y - gamma * y' 
        // add force of connector and gravity 

        let acceleration = force.add(new Point(0, this.mass * GRAVITY));

        // if there is another force, add the force of the other connector
        if (this.bottomConnector)
            acceleration = acceleration.subtract(this.bottomConnector.force());

        // divide the force by the mass because a = f/m and then subtract the drag force
        if (this.damping != 0)
            acceleration = acceleration.divide(this.mass).subtract(this.point.velocity().multiply(this.damping));
        else 
            acceleration = acceleration.divide(this.mass);

        this.point.dx += h * acceleration.x;
        this.point.dy += h * acceleration.y;

        this.point.y += h * this.point.dy;
        this.point.x += h * this.point.dx;

        /*if (this.topConnector && this.topConnector.start.y > this.topConnector.end.y && this.point.dy < 0)
        {
            this.point.dy = 0;
        }

        if (this.bottomConnector && this.bottomConnector.start.y > this.bottomConnector.end.y && this.point.dy > 0)
        {
            this.point.dy = 0;
        } */
        this.setY(this.point.y);
        this.setX(this.point.x);

        this.bottomConnector?.simulationStep(h);
    }

    size(): number {
        return Math.sqrt(this.mass) * 20;
    }

    setPoint(point: Point) {
        this.point = point.copy();
        this.setX(point.x);
        this.setY(point.y);
        if (this.topConnector)
        {
            // TODO: Make the positioning on the ends a little better
            //this.topConnector.theta = this.topConnector.angle();
        }
    }

    setX(x: number) {
        this.point.x = x;
        if (this.topConnector) 
        {
            this.topConnector.end.x = x;
        }
        if (this.bottomConnector)
        {
            this.bottomConnector.start.x = x;
        }
    }

    setY(y: number) {
        this.point.y = y;
        if (this.topConnector)
            this.topConnector.end.y = y - this.size() / 2;

        if (this.bottomConnector)
            this.bottomConnector.start.y = y + this.size() / 2;
    }

    updateConnector() {
        if (this.topConnector) {
            this.topConnector.end = this.point.add(new Point(0, -this.size()/2))
        }
        if (this.bottomConnector)
        {
            this.bottomConnector.start = this.point.add(new Point(0, this.size()/2))
        }
    }
}

export class Point {
    x: number;
    y: number;
    dx: number;
    dy: number;

    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
    }

    add(a: Point): Point {
        return new Point(this.x + a.x, this.y + a.y);
    }

    multiply(a: number): Point {
        return new Point(this.x * a, this.y * a);
    }

    subtract(a: Point)
    {
        return new Point(this.x - a.x, this.y - a.y);
    }

    divide(a: number): Point {
        if (a == 0)
            throw new Error("Dividing point by zero!!! Ya can't do that!");
        return new Point(this.x / a, this.y / a);
    }

    velocity(): Point {
        return new Point(this.dx, this.dy);
    }

    magnitude(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    copy(): Point {
        return new Point(this.x, this.y);
    }

    angle(): number {
        return Math.atan2(this.y, this.x);
    }

    unit(): Point {
        return this.divide(this.magnitude());
    }
}