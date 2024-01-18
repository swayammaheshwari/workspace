const { program } = require('commander');

program
  .description('A sample application to parse options')
  .option('-a, --alpha', 'Alpha')
  .option('-b, --beta <VALUE>', 'Specify a VALUE', 'Foo');


  program.parse();

const options = program.opts();
console.log('Options detected:');

if (options.alpha) console.log('alpha');
 
const beta = !options.beta ? 'no' : options.beta;
console.log('beta is: %s', beta);