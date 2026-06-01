const { newStack, isEmpty, top, pop } = require("../linkedStack");

const push = (stack, value) => {
  const maximum = isEmpty(stack) ? value : Math.max(value, stack.maximum);
  return { value, maximum, next: stack }
};

const maximum = (stack) => {
  if (!isEmpty(stack)) {
    return stack.maximum;
  }
};

module.exports = {
  isEmpty,
  newStack,
  push,
  pop,
  top,
  maximum
};

let st = newStack();
console.log("maximum", maximum(st));

st = push(st, 22);
console.log("maximum", maximum(st));
st = push(st, 9);
console.log("maximum", maximum(st));
st = push(st, 60);
console.log("maximum", maximum(st));
st = pop(st);
console.log("maximum", maximum(st));

/*
undefined
22
22
60
22
*/