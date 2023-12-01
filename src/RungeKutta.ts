export function rungeKutta(t: number, x: number, h: number, f: (t: number, x: number) => number): number 
{
    let a = f(t, x);
    let b = f(t + h/2, x + h/2 * a);
    let c = f(t + h/2, x + h/2 * b);
    let d = f(t + h, x + h * c);
    console.log(a, b, c, d);
    return x + h / 6 * (a + 2 * b + 2 * c + d);
}