const { newList, isEmpty, size, print } = require("../10 lists/linkedList");

const add = (list, valueToAdd) => {
  if (isEmpty(list) || valueToAdd < list.value) {
    list = { value: valueToAdd, next: list };
  } else {
    list.next = add(list.next, valueToAdd);
  }
  return list;
};

const find = (list, valueToFind) => {
  if (isEmpty(list) || valueToFind < list.value) {
    return false;
  } else if (valueToFind === list.value) {
    return true;
  } else {
    // valueToRemove > list.value
    return find(list.next, valueToFind);
  }
};

const remove = (list, valueToRemove) => {
  if (isEmpty(list) || valueToRemove < list.value) {
    return list;
  } else if (valueToRemove === list.value) {
    return list.next;
  } else {
    // valueToRemove > list.value
    list.next = remove(list.next, valueToRemove);
    return list;
  }
};

module.exports = {
  add,
  find,
  isEmpty,
  newList,
  print,
  remove,
  size
};

let demo = newList();
demo = add(demo, 9);
demo = add(demo, 12);
demo = add(demo, 4);
demo = add(demo, 60);
demo = add(demo, 22);
demo = add(demo, 56);

console.log(find(demo, 1)); // false
console.log(find(demo, 4)); // true
console.log(find(demo, 22)); // true
console.log(find(demo, 61)); // false

console.log("after removing...");

demo = remove(demo, 4);
demo = remove(demo, 22);

console.log(find(demo, 1)); // false
console.log(find(demo, 4)); // false
console.log(find(demo, 22)); // false
console.log(find(demo, 61)); // false
