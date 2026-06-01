const { negate } = require("./02-05-negate");
const { every } = require("./02-07-every_and_some");

const none = (arr, fn) => every(arr, negate(fn));

const isAdult = (x) => x >= 21;

const group1 = [20, 24, 22];
const group2 = [20, 12, 15];
const group3 = [30, 24, 22];

console.log(none(group1, isAdult));
console.log(none(group2, isAdult));
console.log(none(group3, isAdult));

/*
false
true
false
*/