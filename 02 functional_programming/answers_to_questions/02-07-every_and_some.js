const { negate } = require("./02-05-negate");

const some = (arr, fn) => arr.findIndex(fn) !== -1;

const every = (arr, fn) => arr.findIndex(negate(fn)) === -1;

module.exports = {
  some, every
};

if (require.main !== module) return;

const isAdult = (x) => x >= 21;

const group1 = [20, 24, 22];
const group2 = [20, 12, 15];
const group3 = [30, 24, 22];

console.log("Testing some...");
console.log(some(group1, isAdult));
console.log(some(group2, isAdult));
console.log(some(group3, isAdult));

console.log("Testing every...");
console.log(every(group1, isAdult));
console.log(every(group2, isAdult));
console.log(every(group3, isAdult));

/*
Testing some...
true
false
true
Testing every...
false
false
true
*/
