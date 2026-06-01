const { newStack, isEmpty: stackIsEmpty, push, pop, top } = require("../linkedStack");

const newQueue = () => ({ inStack: newStack(), outStack: newStack() });

const isEmpty = (queue) => stackIsEmpty(queue.inStack) && stackIsEmpty(queue.outStack);

const enter = (queue, value) => {
  queue.inStack = push(queue.inStack, value);
  return queue;
};

const exit = (queue) => {
  if (stackIsEmpty(queue.outStack)) {
    while (!stackIsEmpty(queue.inStack)) {
        queue.outStack = push(queue.outStack, top(queue.inStack));
        queue.inStack = pop(queue.inStack);
    }
  }
  queue.outStack = pop(queue.outStack);
  return queue;
};

const front = (queue) => {
    if (stackIsEmpty(queue.outStack)) {
        while (!stackIsEmpty(queue.inStack)) {
            queue.outStack = push(queue.outStack, top(queue.inStack));
            queue.inStack = pop(queue.inStack);
        }
    }
    return top(queue.outStack);
};

let qq = newQueue();
console.log("QUEUE (should be top=, empty=true) ", front(qq), isEmpty(qq));

qq = enter(qq, 22);
qq = enter(qq, 9);
qq = enter(qq, 60);

console.log("QUEUE (should be top=22, empty=false) ", front(qq), isEmpty(qq));

qq = exit(qq);
qq = exit(qq);
console.log("QUEUE (should be top=60, empty=false) ", front(qq), isEmpty(qq));

qq = enter(qq, 12);
qq = enter(qq, 4);
console.log("QUEUE (should be top=60, empty=false) ", front(qq), isEmpty(qq));
qq = exit(qq);
console.log("QUEUE (should be top=12, empty=false) ", front(qq), isEmpty(qq));
qq = exit(qq);
console.log("QUEUE (should be top=4, empty=false) ", front(qq), isEmpty(qq));
qq = exit(qq);
console.log("QUEUE (should be top=, empty=true) ", front(qq), isEmpty(qq));
