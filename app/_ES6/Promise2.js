function one() {
  return new Promise((resolve) => {
    doSomething();
    resolve();
  });
}

function two() {
  return new Promise((resolve) => {
    doSomethingElse();
    resolve();
  });
}

function three() {
  return new Promise((resolve) => {
    doAnotherThing();
    resolve();
  });
}

one()
  .then(() => {
    return two();
  })
  .then(() => {
    return three();
  })
  .then(() => {
    console.log("We did them all");
  });

function doSomething() {
  console.log("first");
}
function doSomethingElse() {
  for (let i = 0; i <= 1000000000; i++) {
    if (i == 100000000) {
      console.log("second");
    }
  }
}
function doAnotherThing() {
  console.log("third");
}
