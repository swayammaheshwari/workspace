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

const recordVideoOne = new Promise((resolve, reject) => {
  resolve("Video 1 Recorded");
});

const recordVideoTwo = new Promise((resolve, reject) => {
  resolve("Video 2 Recorded");
});

const recordVideoThree = new Promise((resolve, reject) => {
  resolve("Video 3 Recorded");
});

Promise.all([recordVideoOne, recordVideoTwo, recordVideoThree]).then(
  (messages) => {
    console.log(messages);
  }
);
