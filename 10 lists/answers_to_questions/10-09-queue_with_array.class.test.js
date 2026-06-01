const { Queue } = require("./10-09-queue_with_array.class.js");

const s = new Queue();
s.enter(22);
s.enter(9);
s.enter(60);
s.print();

console.log(s.enter(12).enter(4).exit());
s.print();

console.log(s.exit());
