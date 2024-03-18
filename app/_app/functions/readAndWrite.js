import * as fs from "fs";
import { fileURLToPath } from "url";
import * as path from "path";

export const writeToFile = (data, filePath) => {
  try {
    // Resolve the absolute path
    const absolutePath = path.resolve(filePath);

    // Write data to file
    fs.appendFileSync(absolutePath, data + "\n");

    return true;
  } catch (error) {
    console.error("Error writing to file:", error);
  }
};

export const readFromFile = (filePath) => {
  // Resolve the absolute path
  const absolutePath = path.resolve(filePath);

  // Read data from file
  try {
    const data = fs.readFileSync(absolutePath, "utf-8");
    return data;
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
};
