import { exec } from "child_process";

// Define the terminal command you want to run
const command = "ls -l";

// Run the command
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing the command: ${error}`);
    return;
  }

  // Output of the command
  console.log(`Command output:\n${stdout}`);

  // Any errors or warnings from the command
  if (stderr) {
    console.error(`Command stderr:\n${stderr}`);
  }
});
