const {
  newSkipList,
  isEmpty,
  add,
  find,
  print,
  print2,
  remove
} = require("../skipList");

const restructureSkipList = (sl) => {
  // start by deleting pointers at all levels other than the bottom one

  let itemCount = -2; // take away start and end sentinels
  let endSentinel;
  for (let ptr = sl; ptr !== null; ptr = ptr.next[0]) {
    itemCount++;
    ptr.next.splice(1, ptr.next.length - 1);
    endSentinel = ptr; // will eventually be the end sentinel.
  }

  if (itemCount === 0) return;

  // Stop when the topmost list has only one element.
  while (itemCount > 1) {
    itemCount = 0;

    // create next level by going through current level and
    // choosing all elements at even positions
    const currLevel = sl.next.length - 1;

    let lastPtr = sl;
    let i = 0;
    for (
      let ptr = sl.next[currLevel]; // from first element after start sentinel
      ptr.next[currLevel] !== null; // up to last element before end sentinel
      ptr = ptr.next[currLevel], i++
    ) {
      if (i % 2 === 0) {
        itemCount++;
        // even position found.
        lastPtr.next.push(ptr);
        lastPtr = ptr;
      }
    }
    endSentinel.next.push(null);
    lastPtr.next.push(endSentinel);
  }

  // ensure there is an empty list at the topmost level
  // if list at level 0 is non-empty.
  endSentinel.next.push(null);
  sl.next.push(endSentinel);
};

let sl = newSkipList();
sl = add(sl, 80);
sl = add(sl, 85);
sl = add(sl, 17);
sl = add(sl, 37);
sl = add(sl, 67);
sl = add(sl, 47);
sl = add(sl, 77);
sl = add(sl, 7);
sl = add(sl, 90);
sl = add(sl, 95);
console.log("AFTER many ADDs");
console.log("----------");
print2(sl);
console.log("----------");

console.log("AFTER restructuring");
restructureSkipList(sl);
console.log("----------");
print2(sl);
console.log("----------");
