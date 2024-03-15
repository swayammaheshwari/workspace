// Queue class
class Queue {
  constructor() {
    this.items = [];
  }

  // enqueue method to add an element to the end of the queue
  enqueue(element) {
    this.items.push(element);
  }

  // dequeue method to remove and return the element from the front of the queue
  dequeue() {
    if (this.isEmpty()) {
      return "Underflow";
    }
    return this.items.shift();
  }

  // front method to return the element at the front of the queue without removing it
  front() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[0];
  }

  // isEmpty method to check if the queue is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // size method to get the number of elements in the queue
  size() {
    return this.items.length;
  }
}

// Example usage:
const myQueue = new Queue();

myQueue.enqueue(10);
myQueue.enqueue(20);
myQueue.enqueue(30);

console.log("Front of the queue:", myQueue.front()); // Output: Front of the queue: 10

console.log("Dequeue:", myQueue.dequeue()); // Output: Dequeue: 10

console.log("Size of the queue:", myQueue.size()); // Output: Size of the queue: 2
