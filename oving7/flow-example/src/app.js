/* @flow */

//(1)
let v1 = [1, 2, 3];
let v2 = [4, 5, 6];

console.log('2 + v1: ', v1.map(e => 2 + e));

console.log('2 * c1: ', v1.map(e => 2 * e));

console.log('mean of v1: ', v1[Math.floor(v1.length / 2)]);

console.log('v1 dot v2: ', v1.reduce((sum, e, index) => sum + e * v2[index], 0));

console.log('sum of v1 + 2 * v2: ', v1.reduce((sum, e, index) => sum + (e + 2 * v2[index]), 0));

console.log('v1 as string: ', v1.map((e, index) => `v1[${index}] = ${e}`).join(', '));

//(2)

class Complex {
  real: number;
  imag: number;

  constructor(real: number, img: number) {
    this.real = real;
    this.imag = img;
  }
}

let v = [new Complex(2, 2), new Complex(1, 1)];

console.log("v elements as strings: ", v.map(e  => `${e.real}i + ${e.imag}i`));
console.log("magnitude of v elements: ", v.map(e => Math.sqrt(Math.pow(e.imag, 2) + Math.pow(e.real, 2))));
console.log("sum of v: ", v.reduce((sum, e) => sum + e));
