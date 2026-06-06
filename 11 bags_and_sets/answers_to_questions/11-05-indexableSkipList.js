const MAX_LEVEL = 32;

const newSkipList = () => ({
  value: -Infinity,
  width: [1],
  next: [{ value: Infinity, next: [null] }]
});

const isEmpty = (sl) => sl.next[0].next[0] === null;

const print2 = (node, validate = true) => {
  for (let i = 0; i < node.next.length; i++) {
    const levelItems = [];
    for (let ptr = node; ptr !== null; ptr = ptr.next[i]) {
      levelItems.push(`${ptr.value}`);
      if (ptr.width) {
        levelItems[levelItems.length - 1] += `(${ptr.width[i]})`;
      }
    }
    console.log(`${i}: ${levelItems}`);
  }
  if (validate) {
    _validate(node);
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

const _validate = (sl) => {

  const widths = [];
  for (let i = 0; i < sl.next.length; i++) {
    widths.push([]);
    for (let ptr = sl; ptr !== null; ptr = ptr.next[i]) {
      if (ptr.width) {
        widths[widths.length - 1].push(ptr.width[i]);
      }
    }
  }

  if (!widths.length)
    throw new Error("no widths found");
  const targetSum = widths[0].reduce((prev, curr) => prev + curr, 0);
  if (targetSum === 1 && widths.length !== 1)
    throw new Error(`found unexpected ${widths.length} level count for an empty list`);
  if (targetSum > 1 && widths.length < 2)
    throw new Error(`found unexpected ${widths.length} level count for a non-empty list`);
  for (let i = 0; i < widths.length; i++) {
    if (!widths[i].length)
      throw new Error(`no widths found at level ${i}`);
    if (widths[i].some(item => item < 1))
      throw new Error(`nonpositive width found at level ${i}`);
    if (!i && widths[i].some(item => item !== 1))
      throw new Error(`width other than 1 found at level ${i}`);
    if (!i && widths[i].length !== targetSum)
      throw new Error(`unexpected width length found at level ${i}:
        expected ${targetSum} but got ${widths[i].length}`);
    const sum = widths[i].reduce((prev, curr) => prev + curr, 0);
    if (sum !== targetSum)
      throw new Error(`sum mismatch found at level ${i}`);
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

const _add = (currNode, currLevel, newNode, newLevel, processingState = null) => {
  if (newNode.value > currNode.next[currLevel].value) {
    if (processingState) {
      // At any level, if a link goes from node A to node B,
      // (making it a forward link pointing  to node B but stored by node A),
      // the width of the link is the sum of all the widths
      // from A (inclusive) to B (exclusive).
      // the first node from which indexing calculations starts 
      // is the start sentinel, rather than the first non-sentinel node.
      processingState[currLevel].prevNodeAbsIdx += currNode.width[currLevel];
    }

    _add(currNode.next[currLevel], currLevel, newNode, newLevel, processingState);
  } else {
    if (processingState) {
      processingState[currLevel].prevNode = currNode;
    }
    if (currLevel <= newLevel) {
      newNode.next[currLevel] = currNode.next[currLevel];
      currNode.next[currLevel] = newNode;
    }
    if (currLevel > 0) {
      if (processingState) {
        processingState[currLevel - 1].prevNodeAbsIdx =
         processingState[currLevel].prevNodeAbsIdx;
      }
      _add(currNode, currLevel - 1, newNode, newLevel, processingState);
    }
  }
};

const _add2 = (sl, currLevel, newNode, newLevel) => {
  const processingState = new Array(currLevel + 1)
    .fill(0)
    .map(() => ({ prevNode: null, prevNodeAbsIdx: 0 }));
  _add(sl, currLevel, newNode, newLevel, processingState);

  // All widths at the bottom level are 1.
  newNode.width[0] = 1;

  // simply fix the widths of prev nodes at levels above newLevel, 
  // by incrementing by 1.
  for (let level = newLevel + 1; level <= currLevel; level++) {
    const prevNode = processingState[level].prevNode;
    prevNode.width[level]++;
  }
  
  // Lastly, deal with computing the widths of newNode
  // and fixing the widths of prev nodes before newNode,
  // at levels from 1 up to newLevel.

  const absPrevNodeIndex = processingState[0].prevNodeAbsIdx;

  for (let level = 1; level <= newLevel; level++) {
    // compute width of next node relative to new node at some level,
    // ie new-to-next,
    // and fix width of new node relative to prev node
    // ie prev-to-new,
    // through the
    // equation: prev-to-new + new-to-next = prev-to-next + 1,
    // where prev-to-next is the existing value,
    // and the "plus 1" accounts for the addition of new node.
    const stepsConsumed = absPrevNodeIndex - processingState[level].prevNodeAbsIdx;
    const prevNode = processingState[level].prevNode;
    newNode.width[level] = prevNode.width[level] - stepsConsumed;
    prevNode.width[level] = stepsConsumed + 1;
  }
}

const add = (sl, valueToAdd) => {
  let newLevel = 0;
  while (newLevel < MAX_LEVEL && Math.random() > 0.5) {
    newLevel++;
  }
  const newNode = {
    value: valueToAdd,
    width: new Array(newLevel + 1).fill(0),
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
    sl.width.push(sl.width[sl.width.length - 1]);
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

      // refer to _add2 for equation based on which this adjustment is made.
      currNode.width[currLevel] += nextNode.width[currLevel] - 1;
    }
    else {
      if (processingState) {
        processingState.remainingNodesToAdjust.push({ level: currLevel, node: currNode });
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
      nodeInfo.node.width[nodeInfo.level]--;
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
    sl.width.splice(level, 1);
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
    while (node.next[level].next[level] !== null // ie next node is not end sentinel
        && i >= node.width[level]) { // if next step is not too far
      i -= node.width[level];  // subtract the current width
      node = node.next[level];    // traverse forward at the current level
    }
    if (!i) break; // early exit, although algorithm is correct without it
  }
  if (!i) { // a positive i at this stage means function received
            // invalid index from the start which is beyond bounds of skip list
    return node.value;
  }
};

(function(skip) {
  if (skip) return;

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
})();

(function(skip) {
  if (skip) return;

  const confirmEquality = (expected, actual, description) => {
    if (description && description.indexOf("50/50") !== -1
        && description.lastIndexOf("0") === description.length - 1) {
      console.log(`running iteration ${description}...`);
    }
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
        throw new Error(`${iterCount}, at ${i}: ${a} !== ${e}`)
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
    _validate(actual);
    const duplicateBuffer = [...buffer];
    for (let j = 0; j < 50; j++) {
      const randIdx = Math.floor(Math.random() * duplicateBuffer.length);
      const randItem = duplicateBuffer[randIdx];
      duplicateBuffer.splice(randIdx, 1);
      expected.push(randItem);
      actual = add(actual, randItem);
      _validate(actual);
    }
    expected.sort((a, b) => a - b);
    confirmEquality(expected, actual, `start of iter ${i+1}`);
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

      _validate(actual);
      confirmEquality(expected, actual, `step ${j+1}/50 of iter ${i+1}`);
    }
  }

  console.log("all random tests passed");
})();