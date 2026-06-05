const MAX_LEVEL = 32;

const newSkipList = () => ({
  value: -Infinity,
  relIndex: [0],
  next: [{ value: Infinity, next: [null] }]
});

const isEmpty = (sl) => sl.next[0].next[0] === null;

const print2 = (node) => {
  for (let i = 0; i < node.next.length; i++) {
    const levelItems = [];
    for (let ptr = node; ptr !== null; ptr = ptr.next[i]) {
      levelItems.push(`${ptr.value}`);
      if (ptr.relIndex) {
        levelItems[levelItems.length - 1] += `(${ptr.relIndex[i]})`;
      }
    }
    console.log(`${i}: ${levelItems}`);
  }
}

const print = (node) => {
  if (node) {
    console.log(
      node.value,
      node.next[0] ? JSON.stringify(node.next.map((x) => `${x.value}`)) : "[]"
    );
    print(node.next[0]);
  }
};

const _level = (sl) => sl.next.length - 1;

const _find = (node, currLevel, valueToFind) => {
  if (currLevel < 0) {
    return false;
  } else if (valueToFind === node.value) {
    return true;
  } else if (valueToFind >= node.next[currLevel].value) {
    return _find(node.next[currLevel], currLevel, valueToFind);
  } else {
    return _find(node, currLevel - 1, valueToFind);
  }
};

const find = (sl, valueToFind) => _find(sl, _level(sl), valueToFind);

const _add = (currNode, currLevel, newNode, newLevel, prevNodesInfo = null) => {
  if (prevNodesInfo) {
    // avoid repeating addition of current node width before current level
    // was entered.
    if ((currLevel + 1) >= prevNodesInfo.length // meaning _add is being 
                                                // called for the first time
       || prevNodesInfo[currLevel + 1].node !== currNode) {

      // At any level, if a link goes from node A to node B, the relIndex
      // (called "width" in book) of the
      // link is the sum of all the relIndex
      // (called "widths" in book) from A (inclusive) to B (exclusive).
      prevNodesInfo[currLevel].absIndex += currNode.relIndex[currLevel];
    }
  }
  if (newNode.value > currNode.next[currLevel].value) {
    _add(currNode.next[currLevel], currLevel, newNode, newLevel, prevNodesInfo);
  } else {
    if (prevNodesInfo) {
      prevNodesInfo[currLevel].node = currNode;
    }
    if (currLevel <= newLevel) {
      newNode.next[currLevel] = currNode.next[currLevel];
      currNode.next[currLevel] = newNode;
    }
    if (currLevel > 0) {
      if (prevNodesInfo) {
        prevNodesInfo[currLevel - 1].absIndex = prevNodesInfo[currLevel].absIndex;
      }
      _add(currNode, currLevel - 1, newNode, newLevel, prevNodesInfo);
    }
  }
};

const _add2 = (sl, currLevel, newNode, newLevel) => {
  const prevNodesInfo = new Array(currLevel + 1)
    .fill(0)
    .map(() => ({ node: null, absIndex: 0 }));
  _add(sl, currLevel, newNode, newLevel, prevNodesInfo);

  // absolute indices are 0-based relative to start sentinel,
  // and are equivalent to 1-based indices when counting non-sentinel
  // nodes starting from 1.

  // all relative indices relative to the start sentinel,
  // are equivalent to absolute indices.

  // All rel index (replacement for "width" term used in book)
  // at the bottom level are 1.
  // This includes the first non-sentinel node, whose reference is
  // taken to be the start sentinel.
  newNode.relIndex[0] = 1;

  // simply fix the relIndex of the non-sentinel next nodes after
  // prevNodes at levels above newLevel, by incrementing by 1.
  for (let level = newLevel + 1; level <= currLevel; level++) {
    const nextNode = prevNodesInfo[level].node.next[level];
    if (nextNode.next[level] !== null) {
      nextNode.relIndex[level]++;
    }
  }
  
  // Lastly, deal with fixing the relIndex of newNode and 
  // the non-sentinel next nodes after newNode,
  // at levels from 1 up to newLevel.

  const absNewNodeIndex = prevNodesInfo[0].absIndex + 1;

  for (let level = 1; level <= newLevel; level++) {
    newNode.relIndex[level] = absNewNodeIndex - prevNodesInfo[level].absIndex;

    // after getting index of new node relative to prev node at some level,
    // ie prev-to-new,
    // use it to adjust index of next node relative to new node,
    // ie new-to-next,
    // through the
    // equation: prev-to-new + new-to-next = prev-to-next + 1,
    // where prev-to-next is the existing value,
    // and the "plus 1" accounts for the addition of new node.
    const nextNode = newNode.next[level];
    if (nextNode.next[level] !== null) {
      nextNode.relIndex[level] += 1 - newNode.relIndex[level];
    }
  }
}

const add = (sl, valueToAdd) => {
  let newLevel = 0;
  while (newLevel < MAX_LEVEL && Math.random() > 0.5) {
    newLevel++;
  }
  const newNode = {
    value: valueToAdd,
    relIndex: new Array(newLevel + 1).fill(0),
    next: new Array(newLevel + 1)
  };

  let currLevel = _level(sl);

  // naive implementation.
  /*while (newLevel > currLevel) {
    let ptr = sl.next[currLevel];
    while (ptr.next[currLevel] !== null) {
      ptr = ptr.next[currLevel];
    }
    const endSentinel = ptr;
    endSentinel.next.push(null);
    sl.next.push(endSentinel);
    currLevel++;
  }
  _add2(sl, currLevel, newNode, newLevel);
  return sl;*/
  
  // To avoid need for inner while loop above,
  // one could store the end sentinel separately as a property
  // besides the 'next' property of the start sentinel.
  //
  // The book decided on an alternative approach, of
  // always ensuring that the list at the topmost level is the empty list,
  // such that the number of levels of a non-empty skip list is always at least 2,
  // and that the end sentinels point to the same reference.

  while (newLevel >= currLevel) {

    // at the beginning of each iteration,
    // sl.next[currLevel] = array of length equals to currLevel + 1,
    // in which each item is the same reference of the sole item created in the array
    // for an empty skip list;
    // and in which the number of nulls in the 'next' property of the sole item in the
    // repeated reference equals the currLevel + 1.
    const endSentinel = sl.next[currLevel];
    endSentinel.next.push(null);
    sl.next.push(endSentinel);
    sl.relIndex.push(0);
    currLevel++;
  }
  _add2(sl, currLevel, newNode, newLevel);
  return sl;
};

const _remove = (currNode, currLevel, valueToRemove, processingState = null) => {
  const nextNode = currNode.next[currLevel];
  if (valueToRemove > nextNode.value) {
    _remove(nextNode, currLevel, valueToRemove, processingState);
  } else {
    if (valueToRemove === nextNode.value) {
      if (processingState) {
        processingState.found = true;
      }
      currNode.next[currLevel] = nextNode.next[currLevel];
      // adjust if not the end sentinel.
      if (currNode.next[currLevel].next[currLevel] !== null) {
        // refer to _add2 for equation based on which this adjustment is made.
        currNode.next[currLevel].relIndex[currLevel] += nextNode.relIndex[currLevel] - 1;
      }
    }
    else {
      if (processingState) {
        // store for future adjustment if not the end sentinel.
        if (nextNode.next[currLevel] !== null) {
          processingState.remainingNodesToAdjust.push({ level: currLevel, node: nextNode });
        }
      }
    }
    if (currLevel > 0) {
      _remove(currNode, currLevel - 1, valueToRemove, processingState);
    }
  }
};

const _remove2 = (sl, valueToRemove) => {
  const processingState = {
    found: false,
    remainingNodesToAdjust: []
  };
  _remove(sl, _level(sl), valueToRemove, processingState);

  if (processingState.found) {
    for (const nodeInfo of processingState.remainingNodesToAdjust) {
      // refer to _add2 for basis of this adjustment.
      nodeInfo.node.relIndex[nodeInfo.level]--;
    }
  }
};

const remove = (sl, valueToRemove) => {
  _remove2(sl, valueToRemove);

  // to cooperate with need for addition logic to have quick access to end
  // sentinel, start from the level below the topmost level which always
  // is an empty list.
  // hence preserve empty list always at the topmost level.
  for (
    let level = _level(sl) - 1;
    level >= 0 && sl.next[level].next[level] === null;
    level--
  ) {
    const endSentinel = sl.next[level];
    endSentinel.next.splice(level, 1);
    sl.next.splice(level, 1);
    sl.relIndex.splice(level, 1);
  }
  return sl;
};

// adapted and modified from https://en.wikipedia.org/wiki/Skip_list
// section "Indexable skiplist"
const at = (sl, i) => {
  if (i < 0) return;
  let node = sl;
  i++; // don't count the head/start sentinel as a step
  for (let level = _level(sl); level >= 0; level--) {
    // while loop invariant: node has already been used in previous higher level,
    // or is not needed (like start sentinel)
    while (node.next[level].next[level] !== null // ie next node is not end sentinel
        && i >= node.next[level].relIndex[level]) { // if next step is not too far
      node = node.next[level];    // traverse forward at the current level
      i -= node.relIndex[level];  // subtract the relIndex (called "width"
                                  // in Wikipedia pseudocode) of the 
                                  // just made current node.
    }
    if (!i) break; // early exit, although algorithm is correct without it
  }
  if (!i) { // a positive i at this stage means function received
            // invalid index from the start which is beyond bounds of skip list
    return node.value;
  }
};

let sl = newSkipList();
console.log("EMPTY");
console.log(sl);
print2(sl);
console.log(isEmpty(sl));

sl = add(sl, 22);
console.log("ONE ELEMENT, 22");
print2(sl);
// console.log(sl);

sl = add(sl, 9);
console.log("AFTER 2 ADDs");
print2(sl);
// console.log(sl);

sl = add(sl, 60);
console.log("AFTER 3 ADDs");
print2(sl);
// console.log(sl);

sl = add(sl, 12);
console.log("AFTER 4 ADDs");
print2(sl);
// console.log(sl);

sl = add(sl, 4);
console.log("AFTER 5 ADDs");
print2(sl);
// console.log(sl);

sl = add(sl, 56);
console.log("AFTER 6 ADDs");
console.log("----------");
print2(sl);
console.log("----------");
// console.log(sl);

console.log("sl[0] =", at(sl, 0));
console.log("sl[1] =", at(sl, 1));
console.log("sl[2] =", at(sl, 2));
console.log("sl[3] =", at(sl, 3));
console.log("sl[4] =", at(sl, 4));
console.log("sl[5] =", at(sl, 5));
console.log("sl[6] =", at(sl, 6));
console.log("sl[7] =", at(sl, 7));


sl = remove(sl, 12);
console.log("AFTER REMOVE 12");
console.log("----------");
print2(sl);
console.log("----------");

sl = remove(sl, 12);
console.log("AFTER try REMOVE 12 again");
console.log("----------");
print2(sl);
console.log("----------");

sl = remove(sl, 22);
console.log("AFTER REMOVE 22");
console.log("----------");
print2(sl);
console.log("----------");

console.log("sl[0] =", at(sl, 0));
console.log("sl[1] =", at(sl, 1));
console.log("sl[2] =", at(sl, 2));
console.log("sl[3] =", at(sl, 3));

sl = remove(sl, 4);
console.log("AFTER REMOVE 4");
console.log("----------");
print2(sl);
console.log("----------");

sl = remove(sl, 60);
console.log("AFTER REMOVE 60");
console.log("----------");
print2(sl);
console.log("----------");

sl = remove(sl, 60);
console.log("AFTER try REMOVE 60 again");
console.log("----------");
print2(sl);
console.log("----------");

sl = remove(sl, 61);
console.log("AFTER REMOVE non-existent 61");
console.log("----------");
print2(sl);
console.log("----------");


console.log("sl[0] =", at(sl, 0));
console.log("sl[1] =", at(sl, 1));
console.log("sl[2] =", at(sl, 2));
console.log("sl[3] =", at(sl, 3));

console.log("----------");
sl = add(sl, 4);
console.log("AFTER ADD 4");
console.log("----------");
print2(sl);
console.log("----------");

sl = remove(sl, 56);
console.log("AFTER REMOVE 56");
console.log("----------");
print2(sl);
console.log("----------");

sl = remove(sl, 9);
console.log("AFTER REMOVE 9");
console.log("----------");
print2(sl);
console.log("----------");

sl = remove(sl, 4);
console.log("AFTER REMOVE 4");
console.log("----------");
print2(sl);
console.log("----------");

(function() {
  const confirmEquality = (expected, actual, iterCount) => {
    for (let i = 0; i < expected.length + 100; i++) {
      const e = expected[i];
      const a = at(actual, i);
      if (e !== a) {
        console.log("EXPECTED:");
        console.log(expected);
        console.log("ACTUAL:");
        console.log("----------");
        print2(actual);
        console.log("----------");
        throw new Error(`iteration ${iterCount}, at ${i}: ${a} !== ${e}`)
      }
    }
  };
  const buffer = [];
  for (let i = 0; i < 100; i++) {
    buffer.push(i);
  }
  for (let i = 0; i < 100; i++) {
    const expected = [];
    let actual = newSkipList();
    const duplicateBuffer = [...buffer];
    for (let j = 0; j < 50; j++) {
      const randIdx = Math.floor(Math.random() * duplicateBuffer.length);
      const randItem = duplicateBuffer[randIdx];
      duplicateBuffer.splice(randIdx, 1);
      expected.push(randItem);
      actual = add(actual, randItem);
    }
    expected.sort((a, b) => a - b);
    confirmEquality(expected, actual, i+1);
    for (let j = 0; j < 50; j++) {
      if (Math.random() > 0.3) {
        if (!expected.length) continue;
        const randIdx = Math.floor(Math.random() * expected.length);
        const randItem = expected[randIdx];
        expected.splice(randIdx, 1);
        actual = remove(actual, randItem);
      }
      else {
        if (!duplicateBuffer.length) continue;
        const randIdx = Math.floor(Math.random() * duplicateBuffer.length);
        const randItem = duplicateBuffer[randIdx];
        duplicateBuffer.splice(randIdx, 1);
        expected.push(randItem);
        expected.sort((a, b) => a - b);
        actual = add(actual, randItem);
      }

      confirmEquality(expected, actual, i+1);
    }
  }

  console.log("all random tests passed");
})();