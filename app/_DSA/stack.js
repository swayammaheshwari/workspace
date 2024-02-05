class Stack {
  constructor() {
    this.items = [];
  }

  // Add element to the top of the stack
  push(element) {
    this.items.push(element);
  }

  // Remove and return the top element from the stack
  pop() {
    if (this.isEmpty()) {
      return "Underflow";
    }
    return this.items.pop();
  }

  // Return the top element without removing it from the stack
  peek() {
    return this.items[this.items.length - 1];
  }

  // Check if the stack is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Return the size of the stack
  size() {
    return this.items.length;
  }

  // Clear the stack
  clear() {
    this.items = [];
  }

  // Print the stack elements
  print() {
    console.log(this.items.join(" "));
  }
}

// Example usage:
const stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
stack.print(); // Output: 10 20 30
console.log("Size:", stack.size()); // Output: 3
console.log("Top element:", stack.peek()); // Output: 30
console.log("Popped element:", stack.pop()); // Output: 30
stack.print(); // Output: 10 20
