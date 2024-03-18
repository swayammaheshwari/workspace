import * as fs from "fs";
import { fileURLToPath } from 'url';
import * as path from 'path';

export const writeToFile = (data) => {
  // Get the directory name from the current module's URL
  const currentFileUrl = import.meta.url;
  console.log(currentFileUrl)
  const currentDir = path.dirname(fileURLToPath(currentFileUrl));
  
  // Construct the output path
  const out_path = path.join(currentDir, "results", "output.txt");
  
  // Write data to file
  fs.appendFileSync(out_path, data + "\n");
};

export const readFromFile = ()=> {
  var filePath = path.join(__dirname, "input.txt");
  try {
    var data = fs.readFileSync(filePath);
    console.log("Data from input.txt: " + data);
    return data;
  } catch (err) {
    console.error(err);
  }
};

console.log(writeToFile("dfdfdf"))
