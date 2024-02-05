class Queue {
  constructor() {
    this.items = [];
  }

  // Add element to the queue
  enqueue(element) {
    this.items.push(element);
  }

  // Remove element from the queue and return it
  dequeue() {
    if (this.isEmpty()) {
      return "Underflow";
    }
    return this.items.shift();
  }

  // Return the front element of the queue
  front() {
    if (this.isEmpty()) {
      return "No elements in Queue";
    }
    return this.items[0];
  }

  // Check if the queue is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Return the size of the queue
  size() {
    return this.items.length;
  }

  // Print the queue
  printQueue() {
    let str = "";
    for (let i = 0; i < this.items.length; i++) {
      str += this.items[i] + " ";
    }
    return str;
  }
}

// Example usage:
const queue = new Queue();
// queue.enqueue(10);
// queue.enqueue(20);
// queue.enqueue(30);
console.log(queue.printQueue()); // Output: 10 20 30
console.log(queue.size()); // Output: 3
console.log(queue.front()); // Output: 10
console.log(queue.printQueue()); // Output: 20 30
queue.dequeue();
console.log(queue.printQueue()); // Output: 20 30
