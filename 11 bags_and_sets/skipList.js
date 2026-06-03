const MAX_LEVEL = 32;

const newSkipList = () => ({
  value: -Infinity,
  next: [{ value: Infinity, next: [null] }]
});

const isEmpty = (sl) => sl.next[0].next[0] === null;

const print = (node) => {
  /*for (let i = 0; i < node.next.length; i++) {
    const levelItems = [];
    for (let ptr = node; ptr !== null; ptr = ptr.next[i]) {
      levelItems.push(`${ptr.value}`);
    }
    console.log(`${i}: ${levelItems}`);
  }
  return;*/
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

const _add = (currNode, currLevel, newNode, newLevel) => {
  if (newNode.value > currNode.next[currLevel].value) {
    _add(currNode.next[currLevel], currLevel, newNode, newLevel);
  } else {
    if (currLevel <= newLevel) {
      newNode.next[currLevel] = currNode.next[currLevel];
      currNode.next[currLevel] = newNode;
    }
    if (currLevel > 0) {
      _add(currNode, currLevel - 1, newNode, newLevel);
    }
  }
};

const add = (sl, valueToAdd) => {
  let newLevel = 0;
  while (newLevel < MAX_LEVEL && Math.random() > 0.5) {
    newLevel++;
  }
  const newNode = { value: valueToAdd, next: new Array(newLevel + 1) };

  let currLevel = _level(sl);

  // naive implementation.
  /*while (newLevel > currLevel) {
    let ptr = sl.next[currLevel];
    while (ptr.next[currLevel] !== null) {
      ptr = ptr.next[currLevel];
    }
    ptr.next.push(null);
    sl.next.push(ptr);
    currLevel++;
  }
  _add(sl, currLevel, newNode, newLevel);
  return sl;*/
  
  // to avoid need for inner while loop above,
  // always ensure the list at the topmost level is the empty list,
  // such that the number of levels of a non-empty skip list is always at least 1,
  // and the end sentinels point to the same reference.
  // By so doing adding new levels or removing empty levels can be done in
  // constant time.

  while (newLevel >= currLevel) {

    // at the beginning of each iteration,
    // sl.next[currLevel] = array of length equals to currLevel + 1,
    // in which each item is the same reference of the sole item created in the array
    // for an empty skip list;
    // and in which the number of nulls in the 'next' property of the sole item in the
    // repeated reference equals the currLevel + 1.
    const ptr = sl.next[currLevel];
    ptr.next.push(null);
    sl.next.push(ptr);
    currLevel++;
  }
  _add(sl, currLevel, newNode, newLevel);
  return sl;
};

const _remove = (currNode, currLevel, valueToRemove) => {
  if (valueToRemove > currNode.next[currLevel].value) {
    _remove(currNode.next[currLevel], currLevel, valueToRemove);
  } else {
    if (valueToRemove === currNode.next[currLevel].value) {
      currNode.next[currLevel] = currNode.next[currLevel].next[currLevel];
    }
    if (currLevel > 0) {
      _remove(currNode, currLevel - 1, valueToRemove);
    }
  }
};

const remove = (sl, valueToRemove) => {
  _remove(sl, _level(sl), valueToRemove);

  // naive implementation.
  /*for (
    let level = _level(sl);
    level > 0 && sl.next[level].next[level] === null;
    level--
  ) {
    sl.next[level].next.splice(level, 1);
    sl.next.splice(level, 1);
  }
  return sl;*/

  // to cooperate with need for addition logic to have quick access to end
  // sentinel, start from the level below the topmost level which always
  // is an empty list.
  // hence preserve empty list always at the topmost level.
  for (
    let level = _level(sl) - 1;
    
    // no need for level > 0, else two empty lists will remain, 
    // which is not a serious bug, but doesn't correspond nicely to 
    // skip list clearing bringing it to a state like the state of its creation.
    /*level > 0 &&*/ sl.next[level].next[level] === null;

    level--
  ) {
    sl.next[level].next.splice(level, 1);
    sl.next.splice(level, 1);
  }
  return sl;
};

module.exports = {
  newSkipList,
  isEmpty,
  add,
  find,
  print,
  remove
};
