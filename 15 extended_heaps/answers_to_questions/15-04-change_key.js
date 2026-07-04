const { goesHigher, merge } = require("../skew_heap");

const changeKey = (heap, node, newKey) => { // aka decreaseKey for minHeap
  if (!goesHigher(newKey, node.key)) {
    throw new Error("newKey must go higher than existing key");
  }

  // detach parent from node
  const parent = node.up;
  node.up = null;

  // detach node from parent
  if (parent) {
    if (parent.left === node) {
      parent.left = null;
    }
    else {
      parent.right = null;
    }
  }

  // increase key (decrease key in case of minHeap)
  node.key = newKey;

  // merge like in add method
  return merge(parent, node);
}