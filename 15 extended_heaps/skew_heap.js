const goesHigher = (a, b) => a > b; // a < b for minHeap

const newSkewHeap = () => null;

const newNode = (key, left = null, right = null) => ({ key, left, right });

const isEmpty = (heap) => heap === null;

const top = (heap) => (isEmpty(heap) ? undefined : heap.key);

const print = (tree, s = "") => {
  if (tree !== null) {
    console.log(s, tree.key);
    print(tree.left, `${s}  L:`);
    print(tree.right, `${s}  R:`);
  }
};

const merge = (heap1, heap2) => {
  if (isEmpty(heap2)) {
    if (heap1) {
      heap1.up = null;
    }
    return heap1;
  } else if (isEmpty(heap1)) {
    heap2.up = null;
    return heap2;
  } else if (goesHigher(heap1.key, heap2.key)) {
    [heap1.left, heap1.right] = [merge(heap2, heap1.right), heap1.left];
    if (heap1.left) {
      heap1.left.up = heap1;
    }
    if (heap1.right) {
      heap1.right.up = heap1;
    }
    return heap1;
  } else {
    return merge(heap2, heap1);

    /* Alternative:
    [heap2.left, heap2.right] = [merge(heap1, heap2.right), heap2.left];
    if (heap2.left) {
      heap2.left.up = heap2;
    }
    if (heap2.right) {
      heap2.right.up = heap2;
    }
    return heap2;
    */
  }
};

const add = (heap, keyToAdd) => {
  const newHeap = newNode(keyToAdd);
  return [merge(heap, newHeap), newHeap];
};

const remove = (heap) => {
  if (isEmpty(heap)) {
    throw new Error("Empty heap; cannot remove");
  } else {
    const topKey = top(heap);
    return [merge(heap.left, heap.right), topKey];
  }
};


const changeKey = (heap, node, newKey) => { // aka decreaseKey for minHeap
  if (!goesHigher(newKey, node.key)) {
    throw new Error("newKey must go higher than existing key");
  }
  const parent = node.up;
  node.up = null;
  if (parent) {
    if (parent.left === node) {
      parent.left = null;
    }
    else {
      parent.right = null;
    }
  }
  node.key = newKey;
  return merge(parent, node);
}

module.exports = {
  add,
  isEmpty,
  merge,
  newSkewHeap,
  print,
  remove,
  top
};
