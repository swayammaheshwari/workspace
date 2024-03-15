import { createInterface } from 'readline';
// import { createInterface } from 'readline';
import { stdin as input, stdout as output } from 'node:process';


    const rl = createInterface({ input, output });
  
    rl.question('What do you think of Node.js? ', (answer) => {
    // TODO: Log the answer in a database
    console.log(`Thank you for your valuable feedback: ${answer}`);
  
    rl.close();
  });
  