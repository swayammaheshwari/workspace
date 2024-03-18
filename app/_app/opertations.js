import {readFromFile, writeToFile} from "./functions/readAndWrite.js";


const input = readFromFile("./app/_app/inputs/freejun.yml")
const result = writeToFile(input, "./app/_app/results/output.txt");

console.log(result)