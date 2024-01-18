let arr = [1, 2, 3, 4];

for (let i of arr) {
  console.log(i);
}

let arr1 = [1, 2, 3];
let arr2 = ["a", "b", "c"];
let arr3 = [...arr1, ...arr2];

console.log(arr3);

let array = [1, 2, 3, 4];
let valueToRemove = 3;

// Use filter to create a new array without the specified value
array = array.filter((item) => item !== valueToRemove);

console.log(array); // Output: [1, 2, 4]
