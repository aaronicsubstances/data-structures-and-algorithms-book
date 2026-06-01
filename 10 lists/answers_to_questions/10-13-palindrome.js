const {
  newDeque,
  isEmpty,
  enterBack,
  removeFront,
  removeBack,
  first,
  last
} = require("../linkedDeque");

const detectPalindrome = function (s) {
  const d = newDeque();
  for (const ch of s.split("")) {
    if (/^\p{L}$/u.test(ch)) {
        enterBack(d, ch.toLowerCase());
    }
  }
  while (!isEmpty(d)) {
    const item1 = first(d);
    if (isEmpty(d)) break;
    const item2 = last(d);
    if (item1 !== item2) {
      return false;
    }
    removeFront(d);
    removeBack(d);
  }
  return true;
};

console.log(detectPalindrome("")); // true
console.log(detectPalindrome("a")); // true
console.log(detectPalindrome("ab")); // false
console.log(detectPalindrome("ab a")); // true
console.log(detectPalindrome("ab ac")); // false

console.log("testing with examples in question...");
console.log(detectPalindrome("Hannah")); // true
console.log(detectPalindrome("radar")); // true
console.log(detectPalindrome("Step on no pets")); // true
console.log(detectPalindrome("A man, a plan, a canal: Panama")); // true