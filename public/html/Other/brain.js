const brain = require("brain.js");
const csv = require("csv-parser");
const fs = require("fs");

const data = [];

// Read the CSV file and push the question-answer pairs to the `data` array
fs.createReadStream("path/to/your/csv/file.csv")
  .pipe(csv())
  .on("data", (row) => {
    data.push({ input: row["0"], output: row["1"] });
  })
  .on("end", () => {
    // Once the file is fully read and parsed, train the neural network
    const net = new brain.recurrent.LSTM();
    net.train(data);

    // Test the chatbot
    const output1 = net.run("Hi, how are you doing?");
    console.log(output1); // Output: "I'm fine. how about yourself?"

    const output2 = net.run("I'm fine. how about yourself?");
    console.log(output2); // Output: "I'm pretty good. thanks for asking."
  });
