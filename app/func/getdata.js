async function get_data() {
  const data = await fetch("https://api.github.com/users")
    .then((response) => response.json())
    .catch((error) => {
      console.log(`Error: ${error}`);
    });
  return data;
}

async function displayData() {
  let sum = 0;
  for (let i = 0; i < 1500000000; i++) {
    sum += i;
  }
  return sum;
}

(async () => {
  console.log("first");
  const data = await get_data();
  console.log(data[0].login);
  console.log("second");
  console.log(await displayData());
  console.log("third");
})();
