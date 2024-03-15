class Func {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  getSum() {
    return this.a + this.b;
  }

  num() {
    return `this is number 1: ${this.a}`;
  }
}

let x = new Func(3, 4);
let y = new Func(3);
console.log("sum: ", x.getSum()); // sum:  7
console.log(y.num());
