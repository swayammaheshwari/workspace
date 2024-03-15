function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function* asyncGenerator() {
  let n = 330;
  console.log("Start");
  yield 1;

  console.log("After first yield");

  try {
    if (n > 44) {
      console.log("no.");
      // Simulating an asynchronous operation
      await delay(3000);
    }
  } catch (error) {
    if (error) throw error;
  }

  yield 2;
  console.log("End");
}

// Creating a generator iterator
const iterator = asyncGenerator();

// Using async/await to handle the asynchronous operation
async function iterate() {
  const a = await iterator.next();
  const b = await iterator.next();
  const c = await iterator.next();
}

iterate();
