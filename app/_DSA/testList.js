class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

const node1 = new ListNode(10);
const node2 = new ListNode(20);
const node3 = new ListNode(20);
const node4 = new ListNode(40);

node1.next = node2;
console.log(node1.next);
node2.next = node3;
node3.next = node4;

console.log("Linked list:", node1.value, node2.value, node3.value, node4.value);

const duplicateValuesRemove = () => {};
