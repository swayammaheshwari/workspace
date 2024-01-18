let doSecond = () => {
  console.log("Do second.");
};

let doFirst = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("Do first.");

    resolve();
  }, 500);
});

doFirst.then(doSecond);
