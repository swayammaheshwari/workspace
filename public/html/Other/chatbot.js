const fs = require("fs");
const data = fs.readFileSync("public/data/datasets3.txt", "utf8").split("\r\n");
const responses = data.map((line) => line.split("\t")[1]);

function chatbot(input) {
  const index = data.findIndex((line) => line.startsWith(input));
  if (index === -1) {
    return "I'm sorry, I don't understand.";
  }
  return responses[index];
}

console.log(chatbot("hi, how are you doing?"));

console.log(chatbot("what school do you go to?"));
