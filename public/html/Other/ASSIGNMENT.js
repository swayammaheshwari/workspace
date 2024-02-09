//Q1

let input = { a: 1, b: 2, c: 3 };
let output = [];

for (let key in input) {
    output.push({ [key]: input[key] });
}
console.log(output);



// Q2

let arr = [{ a: 1 }, { b: 2 }, { c: 3 }]
let finalObj = {};
console.log("The array is \n", arr);

for(let i = 0; i < arr.length; i++ ) {
  Object.assign(finalObj, arr[i]);
}

console.log("\nAfter converting array of objects to single object");
console.log(finalObj);



// Q3
//code has to be wrapped in the script in an HTML file.

let T, N, total;
T = parseInt(prompt("Enter T:"));

while (T--) {
    N = parseInt(prompt("Enter N:"));
    total = (N * (N - 1)) / 2;
    console.log(total);
    // document.getElementById("demo").innerHTML = total;
}


//for running code in node.js with readline module
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter T: ', (T) => {
    T = parseInt(T);
    while (T--) {
        rl.question('Enter N: ', (N) => {
            N = parseInt(N);
            let total = (N * (N - 1)) / 2;
            console.log(total);
            if (T === 0) {
                rl.close();
            }
        });
    }
});
