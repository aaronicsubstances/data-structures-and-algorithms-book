const newDeque = () => ({ first: null, last: null });

const newNode = (value, prev = null, next = null) => ({ value, prev, next });

const isEmpty = (deque) => deque.first === null;

const enterFront = (deque, value) => {
  if (deque.first === null) {
    deque.first = deque.last = newNode(value, null, null);
  } else {
    const newValue = newNode(value, null, deque.first);
    deque.first.next = newValue;
    deque.first = newValue;
  }
};

const enterBack = (deque, value) => {
  if (deque.last === null) {
    deque.first = deque.last = newNode(value, null, null);
  } else {
    const newValue = newNode(value, deque.last, null);
    deque.last.prev = newValue;
    deque.last = newValue;
  }
};

const removeFront = (deque) => {
  if (!isEmpty(deque)) {
    deque.first = deque.first.next;
    if (deque.first === null) {
      deque.last = null;
    }
    else {
      // bug fix here. detected when mixing up removeFront and removeBack
      //; instead of nothing here
      deque.first.prev = null;
    }
  }
};

const removeBack = (deque) => {
  if (!isEmpty(deque)) {
    deque.last = deque.last.prev;
    if (deque.last === null) {
      deque.first = null;
    }
    else {
      // bug fix here. detected when mixing up removeFront and removeBack
      //; instead of nothing here
      deque.last.next = null;
    }
  }
};

const first = (deque) => (isEmpty(deque) ? undefined : deque.first.value);

const last = (deque) => (isEmpty(deque) ? undefined : deque.last.value);

module.exports = {
  isEmpty,
  newDeque,
  enterFront,
  enterBack,
  removeFront,
  removeBack,
  first,
  last
};
