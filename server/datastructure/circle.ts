import { DEGREE } from "../env";

export interface Circle {
    x: number;
    y: number;
    radius: number;
}

export function distanceBetweenTwoPoint(circle1: Circle, circle2: Circle) {
    return Math.sqrt(
        (circle2.x * DEGREE - circle1.x * DEGREE) * (circle2.x * DEGREE - circle1.x * DEGREE)
        + (circle2.y * DEGREE - circle1.y * DEGREE) * (circle2.y * DEGREE - circle1.y * DEGREE));
}



// export function calculateCommonArea(circle1: Circle, circle2: Circle): number {

//     let r1 = circle1.radius;
//     let r2 = circle2.radius;
//     const x = distanceBetweenTwoPoint(circle1, circle2);
//     console.log(x);
//     if (x > circle1.radius + circle2.radius) return 0;
//     if (x === 0) return 100;
//     if (x <= Math.max(r1, r2) - Math.min(r1, r2)) return 100;

//     let w = 2 * x * x * r1 * r1 + 2 * x * x * r2 * r2 + 2 * r1 * r1 * r2 * r2 - x * x * x * x - r1 * r1 * r1 * r1 - r2 * r2 * r2 * r2;
//     if (w <= 0) return 100;
//     let h = (1 / (2 * x)) * Math.sqrt(w);

//     let alpha = Math.asin(h / r1);
//     let beta = Math.asin(h / r2);

//     let Sb = beta * r2 * r2 - h * Math.sqrt(r2 * r2 - h * h);
//     let Sa = alpha * r1 * r1 - h * Math.sqrt(r1 * r1 - h * h);
//     console.log(Sb + Sa);
//     // console.log(Sa);

//     const circle1Area = Math.PI * Math.pow(circle1.radius, 2);
//     const perc1 = ((Sa + Sb) * 100) / circle1Area;

//     const circle2Area = Math.PI * Math.pow(circle2.radius, 2);
//     const perc2 = ((Sa + Sb) * 100) / circle2Area;

//     console.log(circle1Area)
//     console.log(circle2Area)
//     console.log(perc1)
//     console.log(perc2)

//     return Math.max(perc1, perc2);
// }

export function calculateCommonArea(circle1: Circle, circle2: Circle): number {

    let r1 = circle1.radius;
    let r2 = circle2.radius;
    const x = distanceBetweenTwoPoint(circle1, circle2);
    // console.log(x);
    if (x > circle1.radius + circle2.radius) return 0;
    if (x === 0) return 100;
    if (x <= Math.max(r1, r2) - Math.min(r1, r2)) return 100;


    let d1 = (r1 * r1 - r2 * r2 + x * x) / (2 * x);
    let d2 = x - d1;
   /// console.log("d1 : " + d1);
   ///// console.log("d2 : " + d2);


    let y = Math.sqrt(r1 * r1 - d1 * d1);
    let h = 2 * y;


    let A = r2 * r2 * Math.acos(d1 / r2) - d1 * Math.sqrt(r2 * r2 - d1 * d1) + r1 * r1 * Math.acos(d2 / r1) - d2 * Math.sqrt(r1 * r1 - d2 * d2);
    if (Number.isNaN(A)) return 0;


  //  console.log("area " + A);
    const circle1Area = Math.PI * Math.pow(circle1.radius, 2);

    const circle2Area = Math.PI * Math.pow(circle2.radius, 2);
  //  console.log("areac c  " + circle1Area)
  //  console.log("areac c " + circle2Area)
    const perc1 = (A * 100) / circle1Area;
    const perc2 = (A * 100) / circle2Area;
    return Math.min(Math.max(perc1, perc2), 100);
}




