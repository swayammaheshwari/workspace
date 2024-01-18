class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

// Example usage:
const node1 = new ListNode(10);
const node2 = new ListNode(20);
const node3 = new ListNode(30);

node1.next = node2;
node2.next = node3;

// The linked list now looks like: 10 -> 20 -> 30

console.log("Linked list:", node1.value, "->", node2.value, "->", node3.value);
